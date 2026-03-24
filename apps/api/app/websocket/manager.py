from fastapi import WebSocket
from typing import Dict, Set
from datetime import datetime
import json

class ConnectionManager:
    """
    In-memory WebSocket connection manager.
    For single-server deployment (no Redis).
    """
    
    def __init__(self):
        # location_id -> set of WebSocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # websocket -> location_id (for cleanup)
        self.connection_locations: Dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, location_id: str):
        """Accept connection and add to location group."""
        await websocket.accept()
        
        if location_id not in self.active_connections:
            self.active_connections[location_id] = set()
        
        self.active_connections[location_id].add(websocket)
        self.connection_locations[websocket] = location_id
        
        print(f"[WS] Client connected to location {location_id}. Total: {len(self.active_connections[location_id])}")

    def disconnect(self, websocket: WebSocket):
        """Remove connection from location group."""
        location_id = self.connection_locations.get(websocket)
        
        if location_id and location_id in self.active_connections:
            self.active_connections[location_id].discard(websocket)
            
            # Clean up empty location groups
            if not self.active_connections[location_id]:
                del self.active_connections[location_id]
        
        if websocket in self.connection_locations:
            del self.connection_locations[websocket]
        
        print(f"[WS] Client disconnected from location {location_id}")

    async def broadcast_to_location(self, location_id: str, message: dict):
        """Send message to all connections for a location."""
        if location_id not in self.active_connections:
            return
        
        message["timestamp"] = datetime.utcnow().isoformat()
        message_json = json.dumps(message)
        
        dead_connections = set()
        
        for connection in self.active_connections[location_id]:
            try:
                await connection.send_text(message_json)
            except Exception as e:
                print(f"[WS] Error sending to client: {e}")
                dead_connections.add(connection)
        
        # Clean up dead connections
        for conn in dead_connections:
            self.disconnect(conn)

    async def send_to_customer(self, location_id: str, customer_id: str, message: dict):
        """
        Send message to a specific customer.
        Note: For this to work, we'd need to track customer_id per connection.
        For now, we broadcast to location and client filters by their ID.
        """
        # In a more complex setup, we'd maintain customer_id -> websocket mapping
        # For Sprint 2, broadcasting to location is sufficient
        await self.broadcast_to_location(location_id, message)

    def get_connection_count(self, location_id: str) -> int:
        """Get number of active connections for a location."""
        return len(self.active_connections.get(location_id, set()))


# Global instance
manager = ConnectionManager()
