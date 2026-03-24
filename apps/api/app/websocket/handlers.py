from app.websocket.manager import manager
from app.services.queue_service import QueueService
from sqlalchemy.ext.asyncio import AsyncSession

async def broadcast_queue_update(location_id: str, db: AsyncSession):
    """
    Broadcast updated queue state to all connected clients.
    Call this after any queue state change.
    """
    service = QueueService(db)
    queue_status = await service.get_queue_status(location_id)
    
    await manager.broadcast_to_location(
        str(location_id),
        {
            "type": "queue_state",
            "payload": queue_status
        }
    )

async def notify_customer_called(location_id: str, queue_number: str, customer_id: str):
    """Notify a customer that they've been called."""
    await manager.broadcast_to_location(
        str(location_id),
        {
            "type": "customer_called",
            "payload": {
                "queue_number": queue_number,
                "customer_id": str(customer_id),
                "message": f"{queue_number}, please proceed to the counter"
            }
        }
    )

async def notify_position_update(location_id: str, customer_id: str, old_position: int, new_position: int, wait_mins: int):
    """Notify a customer that their position changed."""
    await manager.broadcast_to_location(
        str(location_id),
        {
            "type": "position_update",
            "payload": {
                "customer_id": str(customer_id),
                "old_position": old_position,
                "new_position": new_position,
                "estimated_wait_mins": wait_mins
            }
        }
    )
