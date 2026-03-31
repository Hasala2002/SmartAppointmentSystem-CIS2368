import asyncio
from app.database import get_db
from sqlalchemy import text

async def check_subscriptions():
    """Check push subscriptions in database"""
    async for db in get_db():
        result = await db.execute(
            text("""
                SELECT 
                    ps.id,
                    ps.user_id,
                    u.email,
                    ps.is_active,
                    ps.created_at,
                    LEFT(ps.endpoint, 50) as endpoint_preview
                FROM push_subscriptions ps
                JOIN users u ON ps.user_id = u.id
                ORDER BY ps.created_at DESC
                LIMIT 10
            """)
        )
        
        rows = result.fetchall()
        print("\n=== Push Subscriptions ===")
        if not rows:
            print("No subscriptions found!")
        else:
            for row in rows:
                print(f"\nUser: {row[2]}")
                print(f"  ID: {row[0]}")
                print(f"  Active: {row[3]}")
                print(f"  Created: {row[4]}")
                print(f"  Endpoint: {row[5]}...")
        
        print(f"\nTotal: {len(rows)}")
        break

if __name__ == "__main__":
    asyncio.run(check_subscriptions())
