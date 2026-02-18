import redis, json, sys

try:
    r = redis.Redis(host='localhost', port=6379, db=0)
    r.ping()
except Exception:
    print("❌ ERROR: Docker Redis not found.")
    sys.exit(1)

payload = {
    "source": "Legal Alert",
    "timestamp": "2026-01-28T16:30:00",
    "content": "URGENT: You have been SERVED. Immediate ASSET SPLIT required for DIVORCE SETTLEMENT.",
    "type": "test_personal"
}

print(f"--- INJECTING PERSONAL RISK TRIGGER ---")
print(f"Input: {payload['content']}")
r.publish('phenix.input', json.dumps(payload))
print(">> Packet sent. Check Dashboard for 'BUNKER MODE' activation.")