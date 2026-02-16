#!/usr/bin/env python3
"""
Database initialization script
Creates database schema and admin account
"""
import asyncio
import os
import sys
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

# Admin credentials
ADMIN_EMAIL = "labtag.admin@theviswagroup.com"
ADMIN_PASSWORD = "y9kS!2d2^5W$1Eor*1WX"
ADMIN_FIRST_NAME = "LabTag"
ADMIN_LAST_NAME = "Admin"

async def init_database():
    """Initialize database schema and create admin user"""
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("ERROR: DATABASE_URL environment variable is not set")
        sys.exit(1)
    
    print(f"Connecting to database...")
    
    # Create async engine
    engine = create_async_engine(database_url, echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    try:
        async with async_session() as session:
            # Read and execute schema.sql
            # Try multiple possible locations
            possible_paths = [
                "/app/schema.sql",  # Docker container path
                os.path.join(os.path.dirname(__file__), "schema.sql"),  # Same directory
                os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "schema.sql"),  # Root
            ]
            
            schema_path = None
            for path in possible_paths:
                if os.path.exists(path):
                    schema_path = path
                    break
            
            if schema_path:
                print(f"Loading schema from {schema_path}")
                with open(schema_path, 'r', encoding='utf-8') as f:
                    schema_sql = f.read()
                
                # Execute schema
                await session.execute(text(schema_sql))
                await session.commit()
                print("✓ Database schema created successfully")
            else:
                print(f"WARNING: Schema file not found in any of: {possible_paths}")
            
            # Check if admin user already exists
            result = await session.execute(
                text("SELECT id FROM users WHERE email = :email"),
                {"email": ADMIN_EMAIL}
            )
            existing_admin = result.fetchone()
            
            if existing_admin:
                print(f"✓ Admin user already exists: {ADMIN_EMAIL}")
            else:
                # Create admin user using PostgreSQL's crypt function
                await session.execute(
                    text("""
                        INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, email_verified)
                        VALUES (:email, crypt(:password, gen_salt('bf')), :first_name, :last_name, 'staff', true, true)
                        RETURNING id
                    """),
                    {
                        "email": ADMIN_EMAIL,
                        "password": ADMIN_PASSWORD,
                        "first_name": ADMIN_FIRST_NAME,
                        "last_name": ADMIN_LAST_NAME
                    }
                )
                
                # Get the newly created user ID
                result = await session.execute(
                    text("SELECT id FROM users WHERE email = :email"),
                    {"email": ADMIN_EMAIL}
                )
                user_id = result.fetchone()[0]
                
                # Create staff record with global admin access
                await session.execute(
                    text("""
                        INSERT INTO staff (user_id, is_admin, has_global_access)
                        VALUES (:user_id, true, true)
                    """),
                    {"user_id": user_id}
                )
                
                await session.commit()
                print(f"✓ Admin user created successfully: {ADMIN_EMAIL}")
                print(f"  Password: {ADMIN_PASSWORD}")
            
            print("\n✓✓✓ Database initialization completed successfully ✓✓✓\n")
            
    except Exception as e:
        print(f"ERROR: Failed to initialize database: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_database())
