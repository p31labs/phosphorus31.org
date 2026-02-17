import os
import json
import asyncio
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis

# --- CONFIG ---
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
UI_UPDATE_CHANNEL = "shield:ui_updates"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ShieldBackend")

app = FastAPI(title="Cognitive Shield API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_client = None

@app.on_event("startup")
async def startup():
    global redis_client
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    logger.info("Redis connected")

@app.on_event("shutdown")
async def shutdown():
    pass

@app.get("/health")
async def health():
    return {"status": "coherent", "mesh": "active"}

@app.websocket("/ws/mesh")
async def websocket_mesh(websocket: WebSocket):
    """
    Subscribes to Redis Pub/Sub updates from the Worker and forwards them 
    to the React/Tauri frontend in real-time.
    """
    await websocket.accept()
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(UI_UPDATE_CHANNEL)
    
    logger.info("Dashboard client connected to Mesh WebSocket")
    
    # Send initial status
    await websocket.send_json({"type": "STATUS", "msg": "Quantum Link Established"})

    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                data = json.loads(message["data"])
                await websocket.send_json(data)
    except WebSocketDisconnect:
        logger.info("Dashboard client disconnected")
    except Exception as e:
        logger.error(f"WebSocket Error: {e}")
    finally:
        await pubsub.unsubscribe(UI_UPDATE_CHANNEL)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend_core:app", host="0.0.0.0", port=8000, reload=False)
