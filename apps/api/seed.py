#!/usr/bin/env python3
"""
Idempotent seed script for the Smart Appointment System database.

The data was captured once via `pg_dump` against the Neon production-style
database and inlined here so that fresh local builds get a useful baseline of
locations, availability, users, and staff without ever needing network access
to Neon.

The dump source-of-truth is preserved in `seed_data.sql` next to this file.
If you need to refresh the seed, regenerate that dump and re-import the
relevant rows below.

Behavior:
- Connects with the same DATABASE_URL the API uses.
- Uses raw asyncpg connections (same as init_db.py) so we don't depend on the
  rest of the application package being importable.
- Every insert is wrapped in `ON CONFLICT (id) DO NOTHING` so re-running the
  script (or running it on a non-empty DB) is safe.
- Skips silently if the schema isn't there yet (the API container's CMD calls
  init_db.py first).

The neon dump had a few extra columns (date_of_birth, dental_insurance_status,
has_dental_insurance) that don't exist in this project's schema.sql. They are
intentionally dropped here.
"""
from __future__ import annotations

import asyncio
import os
import sys
from datetime import time
from urllib.parse import urlparse, urlunparse

import asyncpg


def _parse_time(value: str) -> time:
    """Parse 'HH:MM' or 'HH:MM:SS' into a datetime.time.

    asyncpg's bind protocol requires datetime.time for time columns; passing a
    string raises DataError before the SQL even hits the server.
    """
    parts = value.split(":")
    h = int(parts[0])
    m = int(parts[1]) if len(parts) > 1 else 0
    s = int(parts[2]) if len(parts) > 2 else 0
    return time(hour=h, minute=m, second=s)

# ---------------------------------------------------------------------------
# Seed data (snapshotted from the Neon DB on 2026-04-27 via pg_dump)
# ---------------------------------------------------------------------------

LOCATIONS: list[dict] = [
    {
        "id": "83e0e502-d82c-450a-a2a0-09094d97828f",
        "name": "Houston - Downtown",
        "slug": "houston-downtown",
        "address": "123 Main St",
        "city": "Houston",
        "state": "TX",
        "zip_code": "77002",
        "phone": "(713) 555-0101",
        "timezone": "America/Chicago",
        "appointment_duration_mins": 30,
        "buffer_mins": 10,
        "is_active": True,
    },
    {
        "id": "2b54653a-04df-4955-ab13-be2cd6ac2d74",
        "name": "Houston - Galleria",
        "slug": "houston-galleria",
        "address": "456 Westheimer Rd",
        "city": "Houston",
        "state": "TX",
        "zip_code": "77056",
        "phone": "(713) 555-0102",
        "timezone": "America/Chicago",
        "appointment_duration_mins": 30,
        "buffer_mins": 10,
        "is_active": True,
    },
    {
        "id": "cfa2dc76-3c0f-4eae-a557-4bb8c77b6b48",
        "name": "Austin - Central",
        "slug": "austin-central",
        "address": "789 Congress Ave",
        "city": "Austin",
        "state": "TX",
        "zip_code": "78701",
        "phone": "(512) 555-0103",
        "timezone": "America/Chicago",
        "appointment_duration_mins": 30,
        "buffer_mins": 10,
        "is_active": True,
    },
    {
        "id": "f560fb2d-bec6-4e53-9289-c43da44f5d8d",
        "name": "Austin - Round Rock",
        "slug": "austin-round-rock",
        "address": "321 Palm Valley Blvd",
        "city": "Round Rock",
        "state": "TX",
        "zip_code": "78664",
        "phone": "(512) 555-0104",
        "timezone": "America/Chicago",
        "appointment_duration_mins": 30,
        "buffer_mins": 10,
        "is_active": True,
    },
    {
        "id": "0038db68-eb7b-488f-a390-fb6b9cbb2225",
        "name": "Dallas - Uptown",
        "slug": "dallas-uptown",
        "address": "555 McKinney Ave",
        "city": "Dallas",
        "state": "TX",
        "zip_code": "75201",
        "phone": "(214) 555-0105",
        "timezone": "America/Chicago",
        "appointment_duration_mins": 30,
        "buffer_mins": 10,
        "is_active": True,
    },
    {
        "id": "90105d5e-feb7-4eda-bda1-1cea1eb3ed63",
        "name": "Fort Worth - Sundance",
        "slug": "fort-worth-sundance",
        "address": "888 Sundance Square",
        "city": "Fort Worth",
        "state": "TX",
        "zip_code": "76102",
        "phone": "(817) 555-0106",
        "timezone": "America/Chicago",
        "appointment_duration_mins": 30,
        "buffer_mins": 10,
        "is_active": True,
    },
]

# Mon-Fri 09:00-17:00 for every location.
AVAILABILITY: list[dict] = [
    {"id": "3e482814-4439-47ab-849b-819dd22f4876", "location_id": "0038db68-eb7b-488f-a390-fb6b9cbb2225", "day_of_week": 1, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "58cf33c5-7b70-424b-871c-45cffb69c999", "location_id": "0038db68-eb7b-488f-a390-fb6b9cbb2225", "day_of_week": 2, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "5b64c171-b8ff-4190-959b-795667d1cf2c", "location_id": "0038db68-eb7b-488f-a390-fb6b9cbb2225", "day_of_week": 3, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "77dc978e-b45f-4c07-a8ab-5efa6082a289", "location_id": "0038db68-eb7b-488f-a390-fb6b9cbb2225", "day_of_week": 4, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "d71539fc-7072-4b61-87db-07d3d6ad4e69", "location_id": "0038db68-eb7b-488f-a390-fb6b9cbb2225", "day_of_week": 5, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "02fa1dab-e51e-453a-8bf3-4286dc5cc86b", "location_id": "2b54653a-04df-4955-ab13-be2cd6ac2d74", "day_of_week": 1, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "281371dd-bcc1-4429-9d11-08743c44277f", "location_id": "2b54653a-04df-4955-ab13-be2cd6ac2d74", "day_of_week": 2, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "5c9ac97b-2fc8-41b9-b6c3-37712c7424ec", "location_id": "2b54653a-04df-4955-ab13-be2cd6ac2d74", "day_of_week": 3, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "98caabec-ed1d-4734-8dc7-784c6edd1fc6", "location_id": "2b54653a-04df-4955-ab13-be2cd6ac2d74", "day_of_week": 4, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "5f996874-c162-41b5-a83d-59fefeebc16d", "location_id": "2b54653a-04df-4955-ab13-be2cd6ac2d74", "day_of_week": 5, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "5bb33536-811a-4122-ac20-520508ae5ff4", "location_id": "83e0e502-d82c-450a-a2a0-09094d97828f", "day_of_week": 1, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "f858159e-a822-420c-b7de-d743adfd01bf", "location_id": "83e0e502-d82c-450a-a2a0-09094d97828f", "day_of_week": 2, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "4ba65942-1d51-407d-83f2-eb21bc8476fe", "location_id": "83e0e502-d82c-450a-a2a0-09094d97828f", "day_of_week": 3, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "03d6294c-6ce3-44a6-b24e-7710ad92d69b", "location_id": "83e0e502-d82c-450a-a2a0-09094d97828f", "day_of_week": 4, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "4fa3f147-5b1c-4c6e-af97-e5aadfd99095", "location_id": "83e0e502-d82c-450a-a2a0-09094d97828f", "day_of_week": 5, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "468c90ac-b04b-4594-901b-069efdfbd790", "location_id": "90105d5e-feb7-4eda-bda1-1cea1eb3ed63", "day_of_week": 1, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "d06c4004-b90e-4406-bf0a-b9ec421780cd", "location_id": "90105d5e-feb7-4eda-bda1-1cea1eb3ed63", "day_of_week": 2, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "e3cb2004-5ba1-4109-a929-5e58b5e5190c", "location_id": "90105d5e-feb7-4eda-bda1-1cea1eb3ed63", "day_of_week": 3, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "36888133-fae8-453c-99e4-00905742c873", "location_id": "90105d5e-feb7-4eda-bda1-1cea1eb3ed63", "day_of_week": 4, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "c99ab0a2-388a-4623-9789-7b08633d36ac", "location_id": "90105d5e-feb7-4eda-bda1-1cea1eb3ed63", "day_of_week": 5, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "30289329-e0a9-4f78-a3d1-ff846f7197ee", "location_id": "cfa2dc76-3c0f-4eae-a557-4bb8c77b6b48", "day_of_week": 1, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "16c37fcf-a218-4ef2-8a51-75f57041630e", "location_id": "cfa2dc76-3c0f-4eae-a557-4bb8c77b6b48", "day_of_week": 2, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "d26e0c5d-1fb9-4391-aa9e-49592871c082", "location_id": "cfa2dc76-3c0f-4eae-a557-4bb8c77b6b48", "day_of_week": 3, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "1dc3f630-d54e-4334-bda4-13ca4bd8d6c0", "location_id": "cfa2dc76-3c0f-4eae-a557-4bb8c77b6b48", "day_of_week": 4, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "20b5f49e-1fa1-4e0e-8e2e-0ae58158713a", "location_id": "cfa2dc76-3c0f-4eae-a557-4bb8c77b6b48", "day_of_week": 5, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "33f35e3e-7be9-4116-b59a-066cb7bcf032", "location_id": "f560fb2d-bec6-4e53-9289-c43da44f5d8d", "day_of_week": 1, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "7b21a2e2-9359-4986-ba1d-acc9f8b2eb44", "location_id": "f560fb2d-bec6-4e53-9289-c43da44f5d8d", "day_of_week": 2, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "c5b22210-1757-441e-90b8-7f682fb0e75b", "location_id": "f560fb2d-bec6-4e53-9289-c43da44f5d8d", "day_of_week": 3, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "e0588072-b5e4-4e49-8ac9-fedb9c4cf2b9", "location_id": "f560fb2d-bec6-4e53-9289-c43da44f5d8d", "day_of_week": 4, "start_time": "09:00", "end_time": "17:00", "is_available": True},
    {"id": "b6c3b679-75fa-4854-899b-5053d0042b7a", "location_id": "f560fb2d-bec6-4e53-9289-c43da44f5d8d", "day_of_week": 5, "start_time": "09:00", "end_time": "17:00", "is_available": True},
]

# Password hashes are the original bcrypt hashes from the Neon dump. The
# admin / staff users keep their original credentials; customer users keep
# whatever password they had in the source DB.
USERS: list[dict] = [
    {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "email": "admin@lonestardental.com",
        "password_hash": "$2a$06$5l.FNMpwoRWWFLfLbmsLIeHd1/G/Yy12r0jYw94e8IdPny.AZNqyC",
        "first_name": "Lone Star",
        "last_name": "Admin",
        "phone": "000",
        "role": "staff",
        "is_active": True,
        "email_verified": True,
    },
    {
        "id": "991044a2-0607-48d7-9fc2-a22f74be6f69",
        "email": "galhouston.admin@lonestardental.com",
        "password_hash": "$2a$06$hTX8oezy/VB.Xj2.x9TDpuU4feccUQBAR20tFt3kdkyynR5VfIhZy",
        "first_name": "Galleria Houston",
        "last_name": "Admin",
        "phone": "000",
        "role": "staff",
        "is_active": True,
        "email_verified": True,
    },
    {
        "id": "76fd6b1f-d215-4189-b8c2-9e6fd8c31be1",
        "email": "hhasala2002@gmail.com",
        "password_hash": "$2b$12$2jWd/2ZeVGt/0rrw/QBTSOnnc8Dlk.AL9z6P1NiiH61FPDQnWgTvC",
        "first_name": "Hasala",
        "last_name": "Heiyanthuduwa",
        "phone": "8322765131",
        "role": "customer",
        "is_active": True,
        "email_verified": False,
    },
    {
        "id": "92045a2d-79c7-4381-b442-c40ad9ef07c5",
        "email": "hvishwa2004@gmail.com",
        "password_hash": "$2b$12$w/LmiL1cXXSFO7DlvqBYAeRdTpI2BZQY56yrgBJ0LelMf0ri.E.9S",
        "first_name": "Vishwa",
        "last_name": "Heiyanthuduwa",
        "phone": "8323591504",
        "role": "customer",
        "is_active": True,
        "email_verified": False,
    },
    {
        "id": "94d7d45f-6c1e-4626-a775-07ceec5c7ec9",
        "email": "john@gmail.com",
        "password_hash": "$2b$12$OepZZoaIrwX9AL/pPzL0PeZCvkEexbP.OXRe/onrZaIxa6eds3Iiq",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "1111111111",
        "role": "customer",
        "is_active": True,
        "email_verified": False,
    },
    {
        "id": "71d384ba-7eb3-4505-ae34-64a25fd1fd10",
        "email": "hasala.heiyanthuduwa@gmail.com",
        "password_hash": "$2b$12$5QF6IXCS7ZqKUUoCaOEHiOil543E4SV5GEXJwIF3B.AupebUngp82",
        "first_name": "Hasala2",
        "last_name": "Heiyanthuduwa2",
        "phone": "8322765131",
        "role": "customer",
        "is_active": True,
        "email_verified": False,
    },
]

STAFF: list[dict] = [
    {
        # Lone Star Admin - global admin, no specific location.
        "id": "2eeb09dc-0e02-4f0f-9c5e-628687706b95",
        "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "location_id": None,
        "is_admin": True,
        "has_global_access": True,
    },
    {
        # Galleria Houston Admin - scoped to that location.
        "id": "5dad7536-a164-48cc-9c3e-b1c836986116",
        "user_id": "991044a2-0607-48d7-9fc2-a22f74be6f69",
        "location_id": "2b54653a-04df-4955-ab13-be2cd6ac2d74",
        "is_admin": True,
        "has_global_access": False,
    },
]


# ---------------------------------------------------------------------------
# Implementation
# ---------------------------------------------------------------------------

def _normalize_dsn(database_url: str) -> str:
    """Strip the SQLAlchemy `+asyncpg` driver suffix so raw asyncpg can connect."""
    parsed = urlparse(database_url)
    scheme = parsed.scheme
    if "+" in scheme:
        scheme = scheme.split("+", 1)[0]
    if scheme not in ("postgresql", "postgres"):
        scheme = "postgresql"
    return urlunparse(parsed._replace(scheme=scheme))


async def _table_exists(conn: asyncpg.Connection, table: str) -> bool:
    return bool(
        await conn.fetchval(
            "SELECT 1 FROM information_schema.tables "
            "WHERE table_schema = 'public' AND table_name = $1",
            table,
        )
    )


async def _seed_locations(conn: asyncpg.Connection) -> int:
    inserted = 0
    for row in LOCATIONS:
        result = await conn.execute(
            """
            INSERT INTO locations (
                id, name, slug, address, city, state, zip_code, phone,
                timezone, appointment_duration_mins, buffer_mins, is_active
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (id) DO NOTHING
            """,
            row["id"],
            row["name"],
            row["slug"],
            row["address"],
            row["city"],
            row["state"],
            row["zip_code"],
            row["phone"],
            row["timezone"],
            row["appointment_duration_mins"],
            row["buffer_mins"],
            row["is_active"],
        )
        if result.endswith(" 1"):
            inserted += 1
    return inserted


async def _seed_users(conn: asyncpg.Connection) -> int:
    inserted = 0
    for row in USERS:
        result = await conn.execute(
            """
            INSERT INTO users (
                id, email, password_hash, first_name, last_name, phone,
                role, is_active, email_verified
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7::user_role, $8, $9)
            ON CONFLICT (id) DO NOTHING
            """,
            row["id"],
            row["email"],
            row["password_hash"],
            row["first_name"],
            row["last_name"],
            row["phone"],
            row["role"],
            row["is_active"],
            row["email_verified"],
        )
        if result.endswith(" 1"):
            inserted += 1
    return inserted


async def _seed_staff(conn: asyncpg.Connection) -> int:
    inserted = 0
    for row in STAFF:
        result = await conn.execute(
            """
            INSERT INTO staff (
                id, user_id, location_id, is_admin, has_global_access
            )
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (id) DO NOTHING
            """,
            row["id"],
            row["user_id"],
            row["location_id"],
            row["is_admin"],
            row["has_global_access"],
        )
        if result.endswith(" 1"):
            inserted += 1
    return inserted


async def _seed_availability(conn: asyncpg.Connection) -> int:
    inserted = 0
    for row in AVAILABILITY:
        result = await conn.execute(
            """
            INSERT INTO availability (
                id, location_id, day_of_week, start_time, end_time, is_available
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING
            """,
            row["id"],
            row["location_id"],
            row["day_of_week"],
            _parse_time(row["start_time"]),
            _parse_time(row["end_time"]),
            row["is_available"],
        )
        if result.endswith(" 1"):
            inserted += 1
    return inserted


async def seed() -> None:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL environment variable is not set")
        sys.exit(1)

    dsn = _normalize_dsn(database_url)
    print("Seeding database...")
    conn = await asyncpg.connect(dsn=dsn)
    try:
        # Bail out cleanly if init_db.py never ran for some reason.
        for required in ("locations", "users", "staff", "availability"):
            if not await _table_exists(conn, required):
                print(
                    f"WARNING: table '{required}' does not exist - "
                    "skipping seed (run init_db.py first)."
                )
                return

        async with conn.transaction():
            n_locations = await _seed_locations(conn)
            # Users must come before staff because staff.user_id FK references users.id.
            n_users = await _seed_users(conn)
            n_staff = await _seed_staff(conn)
            n_availability = await _seed_availability(conn)

        print(
            "Seed complete: "
            f"{n_locations}/{len(LOCATIONS)} locations, "
            f"{n_users}/{len(USERS)} users, "
            f"{n_staff}/{len(STAFF)} staff, "
            f"{n_availability}/{len(AVAILABILITY)} availability rows inserted "
            "(rows that already existed are left untouched)."
        )
    except Exception as e:
        print(f"ERROR: Failed to seed database: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(seed())
