#!/usr/bin/env python3
"""
Mock Signal Generator for Cognitive Shield Testing
Simulates Phenix Phantom nodes sending quantum metrics to the Catcher's Mitt.
"""

import asyncio
import aiohttp
import random
import time
import sys
from datetime import datetime

API_BASE = "http://localhost:8000"

NODES = [
    {"id": "node_alpha", "tetrahedron_id": "tetra_1", "dyad_id": "dyad_1"},
    {"id": "node_beta", "tetrahedron_id": "tetra_1", "dyad_id": "dyad_1"},
    {"id": "node_gamma", "tetrahedron_id": "tetra_2", "dyad_id": "dyad_2"},
    {"id": "node_delta", "tetrahedron_id": "tetra_2", "dyad_id": "dyad_2"},
]

VIBES = ["coherent", "entangled", "decoherent", "spooky", "zen", "chaotic"]

async def send_metric(session, node_info):
    """Send a single quantum metric to the Catcher's Mitt."""
    payload = {
        "node_id": node_info["id"],
        "coherence": random.uniform(0.3, 0.9),
        "entropy": random.uniform(0.1, 0.7),
        "vibe": random.choice(VIBES),
    }
    
    try:
        async with session.post(f"{API_BASE}/ingest/metrics", json=payload) as resp:
            if resp.status == 200:
                result = await resp.json()
                print(f"[{datetime.now().strftime('%H:%M:%S')}] {node_info['id']}: {result['status']} ({result['logic']})")
            else:
                print(f"Error: {resp.status}")
    except Exception as e:
        print(f"Failed to send metric for {node_info['id']}: {e}")

async def main():
    """Generate mock signals at random intervals."""
    print("🚀 Starting Mock Signal Generator for Cognitive Shield...")
    print(f"📡 Sending to {API_BASE}")
    print("Press Ctrl+C to stop.\n")
    
    async with aiohttp.ClientSession() as session:
        while True:
            # Pick a random node
            node = random.choice(NODES)
            await send_metric(session, node)
            
            # Random interval between 0.5 and 3 seconds
            await asyncio.sleep(random.uniform(0.5, 3))

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Mock generator stopped.")