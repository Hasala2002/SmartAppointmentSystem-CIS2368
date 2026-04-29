#!/usr/bin/env python3
"""
Database initialization script
Creates database schema and admin account.

Uses raw asyncpg connections (not SQLAlchemy sessions) for the schema bootstrap
because the schema.sql contains multiple DDL statements (CREATE EXTENSION, DO
blocks, multiple CREATE TABLE statements, etc.). asyncpg's prepared statement
protocol (which SQLAlchemy uses by default) does not support multi-statement
queries, but asyncpg's `Connection.execute` with no positional args runs the
query as a simple_query and supports multi-statements.
"""
import asyncio
import os
import sys
from urllib.parse import urlparse, urlunparse

import asyncpg

# Admin credentials
ADMIN_EMAIL = "labtag.admin@theviswagroup.com"
ADMIN_PASSWORD = "y9kS!2d2^5W$1Eor*1WX"
ADMIN_FIRST_NAME = "LabTag"
ADMIN_LAST_NAME = "Admin"


def _normalize_dsn(database_url: str) -> str:
    """Convert SQLAlchemy-style URLs (postgresql+asyncpg://...) to plain DSNs.

    asyncpg only understands `postgresql://` / `postgres://` schemes, so we
    strip the SQLAlchemy driver suffix when present.
    """
    parsed = urlparse(database_url)
    scheme = parsed.scheme
    if "+" in scheme:
        scheme = scheme.split("+", 1)[0]
    if scheme not in ("postgresql", "postgres"):
        scheme = "postgresql"
    return urlunparse(parsed._replace(scheme=scheme))


def _find_schema_path() -> str | None:
    """Locate schema.sql by checking the most likely locations."""
    here = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        "/app/schema.sql",  # Docker container path
        os.path.join(here, "schema.sql"),  # Same directory as this script
        os.path.join(here, "..", "..", "schema.sql"),  # Project root (apps/api/.. /..)
    ]
    for path in candidates:
        if os.path.exists(path):
            return os.path.abspath(path)
    return None


async def init_database() -> None:
    """Initialize database schema and create admin user."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL environment variable is not set")
        sys.exit(1)

    dsn = _normalize_dsn(database_url)
    print("Connecting to database...")

    conn = await asyncpg.connect(dsn=dsn)
    try:
        schema_path = _find_schema_path()
        if schema_path:
            print(f"Loading schema from {schema_path}")
            with open(schema_path, "r", encoding="utf-8") as f:
                schema_sql = f.read()
            # Wrap the entire bootstrap script in a transaction. asyncpg's
            # Connection.execute with a single string argument runs as a simple
            # query, which supports multiple statements (unlike prepared
            # statements used by SQLAlchemy).
            async with conn.transaction():
                await conn.execute(schema_sql)
            print("✓ Database schema created successfully")
        else:
            print("WARNING: schema.sql not found in any of the expected locations")

        # Check if admin user already exists
        existing = await conn.fetchval(
            "SELECT id FROM users WHERE email = $1", ADMIN_EMAIL
        )
        if existing:
            print(f"✓ Admin user already exists: {ADMIN_EMAIL}")
        else:
            async with conn.transaction():
                user_id = await conn.fetchval(
                    """
                    INSERT INTO users (
                        email, password_hash, first_name, last_name,
                        role, is_active, email_verified
                    )
                    VALUES (
                        $1, crypt($2, gen_salt('bf')), $3, $4,
                        'staff', true, true
                    )
                    RETURNING id
                    """,
                    ADMIN_EMAIL,
                    ADMIN_PASSWORD,
                    ADMIN_FIRST_NAME,
                    ADMIN_LAST_NAME,
                )
                await conn.execute(
                    """
                    INSERT INTO staff (user_id, is_admin, has_global_access)
                    VALUES ($1, true, true)
                    """,
                    user_id,
                )
            print(f"✓ Admin user created successfully: {ADMIN_EMAIL}")

        print("\n✓✓✓ Database initialization completed successfully ✓✓✓\n")
    except Exception as e:
        print(f"ERROR: Failed to initialize database: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(init_database())
