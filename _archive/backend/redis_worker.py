"""
Phenix Protocol - Redis Worker with Catcher's Mitt Protocol

Implements the "Catcher's Mitt" logic for neurodivergent-friendly message processing:
- 60-second delay before processing (allows thought completion)
- Message batching to prevent "Machine Gun Effect"
- Voltage scoring for cognitive load estimation
- Integration with AI Companions for sanitization

The Catcher's Mitt ensures the Operator receives digested information
rather than raw, potentially overwhelming input streams.
"""

import os
import json
import asyncio
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List, Callable
from dataclasses import dataclass, field, asdict
from enum import Enum

import redis.asyncio as redis
from redis.asyncio.client import Redis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CatchersMitt")

# ============================================================================
# Configuration
# ============================================================================

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
BATCH_DELAY_SECONDS = int(os.getenv("PHENIX_BATCH_DELAY", "60"))
MAX_BATCH_SIZE = int(os.getenv("PHENIX_MAX_BATCH", "50"))
STREAM_PREFIX = "phenix:stream:"
PROCESSED_PREFIX = "phenix:processed:"


class MessagePriority(Enum):
    """Message priority levels aligned with Spoon Theory."""
    LOW = 1       # 1 spoon - reflexive response
    MEDIUM = 3    # 3 spoons - executive function required
    HIGH = 5      # 5 spoons - emotional labor required
    CRITICAL = 10 # Emergency - bypass batching


@dataclass
class IncomingMessage:
    """Represents an incoming message to be processed."""
    id: str
    source: str                    # email, chat, system, etc.
    content: str
    timestamp: float
    metadata: Dict[str, Any] = field(default_factory=dict)
    voltage: int = 0               # Estimated emotional voltage (1-10)
    complexity: int = 0            # Estimated complexity (1-10)
    priority: MessagePriority = MessagePriority.MEDIUM
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for Redis storage."""
        return {
            "id": self.id,
            "source": self.source,
            "content": self.content,
            "timestamp": self.timestamp,
            "metadata": json.dumps(self.metadata),
            "voltage": self.voltage,
            "complexity": self.complexity,
            "priority": self.priority.value
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "IncomingMessage":
        """Create from dictionary."""
        return cls(
            id=data.get("id", ""),
            source=data.get("source", "unknown"),
            content=data.get("content", ""),
            timestamp=float(data.get("timestamp", 0)),
            metadata=json.loads(data.get("metadata", "{}")),
            voltage=int(data.get("voltage", 0)),
            complexity=int(data.get("complexity", 0)),
            priority=MessagePriority(int(data.get("priority", 3)))
        )
    
    def calculate_spoon_cost(self) -> float:
        """
        Calculate spoon cost using the formula:
        Cost = (Voltage × Complexity / 100) + ADHD_Tax
        """
        adhd_tax = 2.0
        return (self.voltage * self.complexity / 100) + adhd_tax


@dataclass
class ProcessedBatch:
    """Represents a batch of processed messages."""
    batch_id: str
    messages: List[IncomingMessage]
    processed_at: float
    total_spoon_cost: float
    summary: str = ""
    ai_sanitized: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "batch_id": self.batch_id,
            "message_count": len(self.messages),
            "processed_at": self.processed_at,
            "total_spoon_cost": self.total_spoon_cost,
            "summary": self.summary,
            "ai_sanitized": self.ai_sanitized
        }


class CatchersMitt:
    """
    The Catcher's Mitt - Message batching and sanitization system.
    
    Protects the Operator from information overload by:
    1. Catching incoming messages in a Redis Stream
    2. Waiting for a "silence period" (no new messages for N seconds)
    3. Batching messages together
    4. Routing through AI Companion for voltage reduction
    5. Delivering a single, digestible summary
    """
    
    def __init__(
        self,
        operator_id: str,
        redis_url: str = REDIS_URL,
        batch_delay: int = BATCH_DELAY_SECONDS,
        max_batch_size: int = MAX_BATCH_SIZE
    ):
        """Initialize the Catcher's Mitt for a specific operator."""
        self.operator_id = operator_id
        self.redis_url = redis_url
        self.batch_delay = batch_delay
        self.max_batch_size = max_batch_size
        
        # Stream keys
        self.input_stream = f"{STREAM_PREFIX}{operator_id}:input"
        self.output_stream = f"{STREAM_PREFIX}{operator_id}:output"
        self.processed_key = f"{PROCESSED_PREFIX}{operator_id}"
        
        # Redis connection (async)
        self._redis: Optional[Redis] = None
        
        # Callbacks
        self._on_batch_ready: Optional[Callable] = None
        self._ai_sanitizer: Optional[Callable] = None
        
        # State
        self._running = False
        self._last_message_time = 0
        
        logger.info(f"CatchersMitt initialized for operator: {operator_id}")
    
    async def connect(self):
        """Connect to Redis."""
        if self._redis is None:
            self._redis = await redis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True
            )
            logger.info(f"Connected to Redis at {self.redis_url}")
    
    async def disconnect(self):
        """Disconnect from Redis."""
        if self._redis:
            await self._redis.close()
            self._redis = None
            logger.info("Disconnected from Redis")
    
    def set_batch_callback(self, callback: Callable):
        """Set callback for when a batch is ready."""
        self._on_batch_ready = callback
    
    def set_ai_sanitizer(self, sanitizer: Callable):
        """Set AI sanitization function."""
        self._ai_sanitizer = sanitizer
    
    # ========================================================================
    # Message Ingestion
    # ========================================================================
    
    async def ingest_message(self, message: IncomingMessage) -> str:
        """
        Ingest a new message into the stream.
        Returns the message ID assigned by Redis.
        """
        await self.connect()
        
        # Add to stream
        msg_id = await self._redis.xadd(
            self.input_stream,
            message.to_dict(),
            maxlen=1000  # Keep last 1000 messages
        )
        
        self._last_message_time = datetime.utcnow().timestamp()
        
        logger.debug(f"Ingested message {msg_id} from {message.source}")
        return msg_id
    
    async def ingest_raw(
        self,
        source: str,
        content: str,
        metadata: Optional[Dict] = None,
        voltage: int = 5,
        complexity: int = 5
    ) -> str:
        """Convenience method to ingest a raw message."""
        import uuid
        
        message = IncomingMessage(
            id=str(uuid.uuid4()),
            source=source,
            content=content,
            timestamp=datetime.utcnow().timestamp(),
            metadata=metadata or {},
            voltage=voltage,
            complexity=complexity
        )
        
        return await self.ingest_message(message)
    
    # ========================================================================
    # Batch Processing
    # ========================================================================
    
    async def _get_pending_messages(self) -> List[IncomingMessage]:
        """Get all pending messages from the stream."""
        await self.connect()
        
        # Read all messages from beginning
        messages = []
        result = await self._redis.xrange(self.input_stream, "-", "+")
        
        for msg_id, data in result:
            try:
                msg = IncomingMessage.from_dict(data)
                msg.id = msg_id  # Use Redis ID
                messages.append(msg)
            except Exception as e:
                logger.error(f"Failed to parse message {msg_id}: {e}")
        
        return messages
    
    async def _check_silence_period(self) -> bool:
        """Check if we've had enough silence to process."""
        if not self._last_message_time:
            return False
        
        elapsed = datetime.utcnow().timestamp() - self._last_message_time
        return elapsed >= self.batch_delay
    
    async def process_batch(self) -> Optional[ProcessedBatch]:
        """
        Process pending messages into a batch.
        Called after silence period has elapsed.
        """
        messages = await self._get_pending_messages()
        
        if not messages:
            return None
        
        # Calculate total spoon cost
        total_cost = sum(m.calculate_spoon_cost() for m in messages)
        
        # Create batch
        batch = ProcessedBatch(
            batch_id=f"batch_{datetime.utcnow().timestamp()}",
            messages=messages,
            processed_at=datetime.utcnow().timestamp(),
            total_spoon_cost=total_cost
        )
        
        # Run through AI sanitizer if available
        if self._ai_sanitizer:
            try:
                sanitized = await self._ai_sanitizer(messages)
                batch.summary = sanitized.get("summary", "")
                batch.ai_sanitized = True
            except Exception as e:
                logger.error(f"AI sanitization failed: {e}")
                batch.summary = self._generate_basic_summary(messages)
        else:
            batch.summary = self._generate_basic_summary(messages)
        
        # Store processed batch
        await self._redis.hset(
            self.processed_key,
            batch.batch_id,
            json.dumps(batch.to_dict())
        )
        
        # Clear processed messages from input stream
        for msg in messages:
            await self._redis.xdel(self.input_stream, msg.id)
        
        # Trigger callback
        if self._on_batch_ready:
            await self._on_batch_ready(batch)
        
        logger.info(
            f"Processed batch {batch.batch_id}: "
            f"{len(messages)} messages, {total_cost:.1f} spoons"
        )
        
        return batch
    
    def _generate_basic_summary(self, messages: List[IncomingMessage]) -> str:
        """Generate a basic summary without AI."""
        sources = {}
        for msg in messages:
            sources[msg.source] = sources.get(msg.source, 0) + 1
        
        source_summary = ", ".join(
            f"{count} from {source}" 
            for source, count in sources.items()
        )
        
        total_voltage = sum(m.voltage for m in messages) / len(messages)
        
        return (
            f"Batch contains {len(messages)} messages: {source_summary}. "
            f"Average voltage: {total_voltage:.1f}/10"
        )
    
    # ========================================================================
    # Worker Loop
    # ========================================================================
    
    async def run(self):
        """Main worker loop."""
        self._running = True
        await self.connect()
        
        logger.info(f"CatchersMitt worker started (delay: {self.batch_delay}s)")
        
        while self._running:
            try:
                # Check for new messages
                messages = await self._get_pending_messages()
                
                if messages:
                    # Check if silence period has elapsed
                    if await self._check_silence_period():
                        await self.process_batch()
                    else:
                        # Check for critical priority messages
                        critical = [
                            m for m in messages 
                            if m.priority == MessagePriority.CRITICAL
                        ]
                        if critical:
                            logger.warning(f"Processing {len(critical)} critical messages")
                            await self.process_batch()
                
                # Sleep before next check
                await asyncio.sleep(5)
                
            except Exception as e:
                logger.error(f"Worker error: {e}")
                await asyncio.sleep(10)
        
        await self.disconnect()
        logger.info("CatchersMitt worker stopped")
    
    async def stop(self):
        """Stop the worker loop."""
        self._running = False
    
    # ========================================================================
    # Utility Methods
    # ========================================================================
    
    async def get_queue_status(self) -> Dict[str, Any]:
        """Get current queue status."""
        await self.connect()
        
        messages = await self._get_pending_messages()
        
        return {
            "operator_id": self.operator_id,
            "pending_count": len(messages),
            "total_spoon_cost": sum(m.calculate_spoon_cost() for m in messages),
            "oldest_message": min(
                (m.timestamp for m in messages), 
                default=None
            ),
            "silence_elapsed": (
                datetime.utcnow().timestamp() - self._last_message_time
                if self._last_message_time else 0
            ),
            "batch_delay": self.batch_delay,
            "ready_to_process": await self._check_silence_period() if messages else False
        }
    
    async def flush_queue(self) -> int:
        """Force flush the queue without processing."""
        await self.connect()
        
        messages = await self._get_pending_messages()
        count = len(messages)
        
        for msg in messages:
            await self._redis.xdel(self.input_stream, msg.id)
        
        logger.info(f"Flushed {count} messages from queue")
        return count
    
    async def get_processed_batches(self, limit: int = 10) -> List[Dict]:
        """Get recent processed batches."""
        await self.connect()
        
        batches = await self._redis.hgetall(self.processed_key)
        
        result = []
        for batch_id, data in list(batches.items())[-limit:]:
            try:
                result.append(json.loads(data))
            except Exception:
                pass
        
        return result


# ============================================================================
# AI Sanitization Integration
# ============================================================================

async def create_ollama_sanitizer(model: str = "cognitive-shield"):
    """
    Create an AI sanitizer using local Ollama.
    This connects to the Cognitive Shield companion.
    """
    import httpx
    
    ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
    
    async def sanitize(messages: List[IncomingMessage]) -> Dict[str, Any]:
        """Sanitize messages through the Cognitive Shield."""
        # Prepare context
        context = "\n".join([
            f"[{m.source}] ({m.voltage}/10 voltage): {m.content}"
            for m in messages
        ])
        
        prompt = f"""Process this batch of messages for a neurodivergent operator:

{context}

Provide:
1. BLUF (Bottom Line Up Front) - What needs attention?
2. Voltage Assessment - Overall emotional intensity (1-10)
3. Recommended Action - What should the operator do?
4. Summary - Calm, clear, kind summary of all messages

Format as JSON with keys: bluf, voltage, action, summary"""
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{ollama_url}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=60.0
            )
            
            if response.status_code == 200:
                result = response.json()
                try:
                    return json.loads(result.get("response", "{}"))
                except json.JSONDecodeError:
                    return {"summary": result.get("response", "")}
            else:
                raise Exception(f"Ollama error: {response.status_code}")
    
    return sanitize


# ============================================================================
# FastAPI Integration
# ============================================================================

def create_router():
    """Create FastAPI router for the Catcher's Mitt API."""
    from fastapi import APIRouter, HTTPException
    from pydantic import BaseModel
    
    router = APIRouter(prefix="/api/catchersmitt", tags=["Catcher's Mitt"])
    
    # Global mitt instance per operator
    _mitts: Dict[str, CatchersMitt] = {}
    
    def get_mitt(operator_id: str) -> CatchersMitt:
        if operator_id not in _mitts:
            _mitts[operator_id] = CatchersMitt(operator_id)
        return _mitts[operator_id]
    
    class IngestRequest(BaseModel):
        source: str
        content: str
        metadata: Dict[str, Any] = {}
        voltage: int = 5
        complexity: int = 5
    
    @router.post("/{operator_id}/ingest")
    async def ingest_message(operator_id: str, request: IngestRequest):
        """Ingest a message into the Catcher's Mitt."""
        mitt = get_mitt(operator_id)
        msg_id = await mitt.ingest_raw(
            source=request.source,
            content=request.content,
            metadata=request.metadata,
            voltage=request.voltage,
            complexity=request.complexity
        )
        return {"status": "ingested", "message_id": msg_id}
    
    @router.get("/{operator_id}/status")
    async def get_status(operator_id: str):
        """Get queue status."""
        mitt = get_mitt(operator_id)
        return await mitt.get_queue_status()
    
    @router.post("/{operator_id}/process")
    async def force_process(operator_id: str):
        """Force process the current batch."""
        mitt = get_mitt(operator_id)
        batch = await mitt.process_batch()
        if batch:
            return batch.to_dict()
        return {"status": "empty", "message": "No messages to process"}
    
    @router.get("/{operator_id}/batches")
    async def get_batches(operator_id: str, limit: int = 10):
        """Get recent processed batches."""
        mitt = get_mitt(operator_id)
        return await mitt.get_processed_batches(limit)
    
    @router.delete("/{operator_id}/flush")
    async def flush_queue(operator_id: str):
        """Flush the queue without processing."""
        mitt = get_mitt(operator_id)
        count = await mitt.flush_queue()
        return {"status": "flushed", "count": count}
    
    return router


# ============================================================================
# CLI / Self-Test
# ============================================================================

async def main():
    """Self-test for the Catcher's Mitt."""
    print("=== Catcher's Mitt Self-Test ===\n")
    
    # Create mitt with short delay for testing
    mitt = CatchersMitt("test_operator", batch_delay=5)
    
    # Set up batch callback
    async def on_batch(batch: ProcessedBatch):
        print(f"\n📬 Batch Ready!")
        print(f"   Messages: {len(batch.messages)}")
        print(f"   Spoon Cost: {batch.total_spoon_cost:.1f}")
        print(f"   Summary: {batch.summary}")
    
    mitt.set_batch_callback(on_batch)
    
    # Ingest test messages
    print("Ingesting test messages...")
    
    await mitt.ingest_raw(
        source="email",
        content="Important meeting tomorrow at 10am",
        voltage=3,
        complexity=2
    )
    
    await mitt.ingest_raw(
        source="chat",
        content="Hey, did you see my message?",
        voltage=4,
        complexity=3
    )
    
    await mitt.ingest_raw(
        source="system",
        content="Backup completed successfully",
        voltage=1,
        complexity=1
    )
    
    # Check status
    status = await mitt.get_queue_status()
    print(f"\nQueue Status: {json.dumps(status, indent=2)}")
    
    # Wait for batch processing
    print("\nWaiting for silence period...")
    await asyncio.sleep(6)
    
    # Process batch
    batch = await mitt.process_batch()
    
    if batch:
        print(f"\nProcessed Batch: {batch.to_dict()}")
    
    # Final status
    status = await mitt.get_queue_status()
    print(f"\nFinal Status: {json.dumps(status, indent=2)}")
    
    await mitt.disconnect()
    print("\n=== Self-Test Complete ===")


if __name__ == "__main__":
    asyncio.run(main())
