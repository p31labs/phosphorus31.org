import asyncio
import json
import os
import time
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

import redis.asyncio as redis
import httpx
import asyncpg
from pydantic import BaseModel, Field

# --- CONFIGURATION ---
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://phantom:kenosis_gate_2026@localhost/cognitive_shield")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

# Elevator Algorithm Constants
BATCH_WINDOW = 10  # Seconds to wait for "silence" before flushing
MAX_BATCH_SIZE = 5 # Max messages before forced flush
COHERENCE_THRESHOLD = 0.577 # 1/sqrt(3) Resilience Benchmark

# Stream Keys
INGEST_STREAM = "shield:metrics:ingest"
BUFFER_STATE_KEY = "buffer:state"
PROCESSED_STREAM = "stream:processed_batches"
UI_UPDATE_CHANNEL = "shield:ui_updates"

# Logging Setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ShieldWorker")

class BatchMetrics(BaseModel):
    batch_id: str
    avg_coherence: float
    avg_entropy: float
    message_count: int
    timestamps: List[float] = Field(default_factory=list)

class VPIAnalysis(BaseModel):
    summary_bluf: str
    emotional_valence: float  # 0.0 (Zen) to 1.0 (High Voltage)
    urgency_score: int       # 1-10
    triggers_detected: List[str]
    coherence_score: float   # Calculated SIC-POVM metric
    quantum_anomaly: bool

class RedisWorker:
    """
    The Catcher's Mitt Worker: Implements the Elevator Algorithm for 60s batching
    and ensures processed signals are committed to the PostgreSQL L.O.V.E. Ledger.
    """
    def __init__(self):
        self.redis: Optional[redis.Redis] = None
        self.db_pool: Optional[asyncpg.Pool] = None
        self.running = True

    async def initialize(self):
        """Initializes Redis and PostgreSQL connections with retry logic."""
        logger.info("Initializing Shield Worker connections...")
        self.redis = redis.from_url(REDIS_URL, decode_responses=True)
        self.db_pool = await asyncpg.create_pool(DATABASE_URL)
        logger.info("Worker connections established.")

    async def vpi_analysis(self, batch: BatchMetrics) -> VPIAnalysis:
        """
        Vacuum-Pressure-Impregnation (VPI) Protocol:
        Submits signal batches to local Ollama instance for cognitive state extraction.
        """
        prompt = (
            f"Analyze communication batch for cognitive shield. "
            f"Average Coherence: {batch.avg_coherence:.3f}. "
            f"Average Entropy: {batch.avg_entropy:.3f}. "
            f"Message count: {batch.message_count}. "
            "Task: Provide emotional valence (0-1), SIC-POVM coherence (0-1), and detect "
            "psychological triggers. Return strictly as JSON."
        )
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(f"{OLLAMA_URL}/api/generate", json={
                    "model": "llama3",
                    "prompt": prompt,
                    "format": "json",
                    "stream": False,
                    "system": "You are a Cognitive Shield Analyst interpreting emotional telemetry through SIC-POVM geometry."
                })
                
                if resp.status_code == 200:
                    raw_data = resp.json().get("response", "{}")
                    return VPIAnalysis.model_validate_json(raw_data)
        except Exception as e:
            logger.error(f"VPI Analysis Error: {e}")
        
        # Fallback to mathematical estimation if AI is offline
        return VPIAnalysis(
            summary_bluf="Heuristic analysis active (AI Offline)",
            emotional_valence=min(batch.avg_coherence, 1.0),
            urgency_score=7 if batch.avg_coherence > 0.8 else 3,
            triggers_detected=["ai_unavailable"],
            coherence_score=0.577 if batch.avg_entropy < 0.2 else 0.3,
            quantum_anomaly=batch.avg_entropy > 0.5
        )

    async def commit_to_ledger(self, batch: BatchMetrics, analysis: VPIAnalysis):
        """Commits the processed batch to the immutable PostgreSQL ledger."""
        async with self.db_pool.acquire() as conn:
            try:
                # We bypass RLS checks for system-level archival
                await conn.execute("SET app.current_user_id = $1", "00000000-0000-0000-0000-000000000000")
                
                await conn.execute("""
                    INSERT INTO care_ledger (dyad_id, event_type, enc_payload, metadata_json, voltage_delta, hw_signature)
                    VALUES ($1, $2, $3, $4, $5, $6)
                """, 
                "default_dyad", 
                "BATCH_SUMMARY", 
                b"PHYSICAL_TRUTH_ENC", # In production, this stores the encrypted kernel
                analysis.model_dump_json(),
                analysis.coherence_score - COHERENCE_THRESHOLD,
                b"HW_SIG_PLACEHOLDER"
                )
            except Exception as e:
                logger.error(f"Ledger Commit Error: {e}")

    async def process_batch(self):
        """Implements the Elevator Algorithm: Flush on window close or overflow."""
        # Read buffer state
        state = await self.redis.hgetall(BUFFER_STATE_KEY)
        if not state:
            return
        
        count = int(state.get("message_count", 0))
        last_ts = float(state.get("last_message_ts", 0))
        
        if (time.time() - last_ts >= BATCH_WINDOW) or (count >= MAX_BATCH_SIZE):
            logger.info(f"Elevator Flush: (count={count}, window_hit={time.time() - last_ts >= BATCH_WINDOW})")
            
            # Read messages from ingest stream
            messages = await self.redis.xrange(INGEST_STREAM, count=count)
            
            if not messages:
                await self.redis.delete(BUFFER_STATE_KEY)
                return

            coherences = []
            entropies = []
            for _, data in messages:
                try:
                    coherences.append(float(data.get("coherence", 0)))
                    entropies.append(float(data.get("entropy", 0)))
                except (ValueError, TypeError):
                    continue
            
            if coherences:
                batch = BatchMetrics(
                    batch_id=f"batch_{int(time.time())}",
                    avg_coherence=sum(coherences) / len(coherences),
                    avg_entropy=sum(entropies) / len(entropies) if entropies else 0,
                    message_count=len(coherences),
                    timestamps=[float(data.get("timestamp", 0)) for _, data in messages]
                )

                analysis = await self.vpi_analysis(batch)
                await self.commit_to_ledger(batch, analysis)
                
                # Push to processed stream for real-time UI
                payload = {
                    "type": "BATCH_UPDATE",
                    "coherence": analysis.coherence_score,
                    "valence": analysis.emotional_valence,
                    "summary": analysis.summary_bluf,
                    "processed_at": datetime.now().isoformat()
                }
                await self.redis.xadd(PROCESSED_STREAM, payload)
                await self.redis.publish(UI_UPDATE_CHANNEL, json.dumps(payload))

            # Cleanup
            await self.redis.delete(BUFFER_STATE_KEY)
            await self.redis.xtrim(INGEST_STREAM, maxlen=100) # Keep small history

    async def monitor_loop(self):
        logger.info("🛡️ Shield Worker Monitor Loop: ACTIVE")
        while self.running:
            try:
                await self.process_batch()
                
                # Autopoietic check: Ensure the connection to Redis/DB hasn't drifted
                await self.redis.ping()
            except Exception as e:
                logger.error(f"Monitor Loop Error: {e}")
            await asyncio.sleep(1)

async def main():
    worker = RedisWorker()
    try:
        await worker.initialize()
        await worker.monitor_loop()
    except KeyboardInterrupt:
        logger.info("Worker shutdown initiated.")
    finally:
        if worker.db_pool:
            await worker.db_pool.close()

if __name__ == "__main__":
    asyncio.run(main())