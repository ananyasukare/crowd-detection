from fastapi import WebSocket, WebSocketDisconnect
from typing import List, Dict

class ConnectionManager:
    def __init__(self):
        # office_id -> list of websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, office_id: str):
        await websocket.accept()
        if office_id not in self.active_connections:
            self.active_connections[office_id] = []
        self.active_connections[office_id].append(websocket)

    def disconnect(self, websocket: WebSocket, office_id: str):
        if office_id in self.active_connections:
            self.active_connections[office_id].remove(websocket)

    async def broadcast_to_office(self, office_id: str, message: dict):
        if office_id in self.active_connections:
            for connection in self.active_connections[office_id]:
                await connection.send_json(message)

manager = ConnectionManager()
