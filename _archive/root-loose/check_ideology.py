import redis, json, time, sys

try:
    r = redis.Redis(host='localhost', port=6379, db=0)
    r.ping()
except Exception:
    print("❌ ERROR: Docker Redis not found. Run 'docker-compose up -d' first.")
    sys.exit(1)

payload = {
    "source": "Futurist Feed",
    "timestamp": "2026-01-28T16:00:00",
    "content": "Balaji announces new Network State sovereignty project! Startup Cities are the future. Join Zuzalu now.",
    "type": "test_ideology"
}

print(f"--- INJECTING IDEOLOGICAL TRIGGER ---")
print(f"Input: {payload['content']}")
r.publish('phenix.input', json.dumps(payload))
print(">> Packet sent. Check Dashboard for interception.")