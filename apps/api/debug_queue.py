import asyncio
from app.database import get_db
from sqlalchemy import text

async def debug_queue():
    """Show all queue entries to debug"""
    async for db in get_db():
        # Show all queue entries
        result = await db.execute(
            text("""
                SELECT 
                    id,
                    queue_number,
                    status,
                    created_at::date as created_date,
                    CURRENT_DATE as today,
                    created_at >= CURRENT_DATE as is_today
                FROM queue_entries 
                ORDER BY created_at DESC
                LIMIT 10
            """)
        )
        
        rows = result.fetchall()
        print("\n=== Queue Entries ===")
        print(f"{'ID':<40} {'#':>5} {'Status':<12} {'Created':<12} {'Today?':<8}")
        print("-" * 90)
        for row in rows:
            print(f"{str(row[0]):<40} {row[1]:>5} {row[2]:<12} {str(row[3]):<12} {str(row[5]):<8}")
        
        print(f"\nTotal entries shown: {len(rows)}")
        break

if __name__ == "__main__":
    asyncio.run(debug_queue())
