from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
from app.services.queue_service import QueueService
from app.websocket.manager import manager

router = APIRouter()

@router.websocket("/ws/queue/{location_id}")
async def websocket_queue(
    websocket: WebSocket,
    location_id: str
):
    """
    WebSocket endpoint for real-time queue updates.
    
    Client connects to /ws/queue/{location_id}
    Server sends queue_state on connect and on any changes.
    """
    await manager.connect(websocket, location_id)
    
    try:
        # Send initial queue state
        # Note: We need a db session here. For simplicity, we'll create one.
        from app.database import AsyncSessionLocal
        async with AsyncSessionLocal() as db:
            service = QueueService(db)
            queue_status = await service.get_queue_status(location_id)
            
            await websocket.send_json({
                "type": "queue_state",
                "payload": queue_status,
                "timestamp": None
            })
        
        # Keep connection alive and handle incoming messages
        while True:
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
                
                if message.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
                
                # Add other message handlers as needed
                
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "message": "Invalid JSON"})
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"[WS] Error: {e}")
        manager.disconnect(websocket)
