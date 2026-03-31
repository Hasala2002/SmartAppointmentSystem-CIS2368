import asyncio
from app.database import get_db
from sqlalchemy import text

async def clear_old_queue():
    """Clear ALL queue entries (set them to 'left' status)"""
    async for db in get_db():
        # Update ALL queue entries to 'left' status (including today's)
        result = await db.execute(
            text("""
                UPDATE queue_entries 
                SET status = 'left', updated_at = NOW()
                WHERE status IN ('waiting', 'called', 'serving')
            """)
        )
        await db.commit()
        
        rows_updated = result.rowcount
        print(f"✓ Cleared {rows_updated} queue entries (including today's)")
        break

if __name__ == "__main__":
    asyncio.run(clear_old_queue())
