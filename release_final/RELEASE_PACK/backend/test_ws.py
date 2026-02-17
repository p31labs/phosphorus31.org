#!/usr/bin/env python3
"""
Simple WebSocket test client for the Cognitive Shield backend.
Run this after starting the backend to verify WebSocket connectivity.
"""

import asyncio
import websockets
import sys
import json

async def test_websocket():
    uri = "ws://localhost:8000/ws/mesh"
    try:
        async with websockets.connect(uri) as websocket:
            print(f"✅ Connected to {uri}")
            
            # Wait for the initial status message
            initial = await websocket.recv()
            print(f"📥 Received initial message: {initial}")
            
            # Send a test message (optional, if the server expects any)
            # await websocket.send(json.dumps({"type": "ping"}))
            
            # Wait for a few seconds to see if we receive any updates
            print("⏳ Waiting for updates (press Ctrl+C to stop)...")
            try:
                for i in range(10):  # Listen for up to 10 messages
                    message = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                    print(f"📥 Update: {message}")
            except asyncio.TimeoutError:
                print("⏱️  No updates received within 5 seconds (this is okay if no data is being published)")
                
    except websockets.exceptions.ConnectionClosedError as e:
        print(f"❌ WebSocket connection closed unexpectedly: {e}")
        return False
    except ConnectionRefusedError:
        print(f"❌ Connection refused. Is the backend server running on {uri}?")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    # Install websockets package if not available: pip install websockets
    try:
        import websockets
    except ImportError:
        print("⚠️  The 'websockets' package is not installed.")
        print("   Install it with: pip install websockets")
        sys.exit(1)
    
    success = asyncio.run(test_websocket())
    sys.exit(0 if success else 1)