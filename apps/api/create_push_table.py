import asyncio
from app.database import get_db
from sqlalchemy import text

async def create_push_subscriptions_table():
    """Create the push_subscriptions table"""
    async for db in get_db():
        # Create table
        await db.execute(text("""
            CREATE TABLE IF NOT EXISTS push_subscriptions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                endpoint VARCHAR NOT NULL,
                p256dh_key VARCHAR NOT NULL,
                auth_key VARCHAR NOT NULL,
                user_agent VARCHAR,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT uq_user_endpoint UNIQUE (user_id, endpoint)
            )
        """))
        print("✓ Table created")
        
        # Create indexes
        await db.execute(text(
            "CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id)"
        ))
        print("✓ Index 1 created")
        
        await db.execute(text(
            "CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(is_active) WHERE is_active = TRUE"
        ))
        print("✓ Index 2 created")
        
        await db.commit()
        print("✓ push_subscriptions table created successfully")
        break

if __name__ == "__main__":
    asyncio.run(create_push_subscriptions_table())
