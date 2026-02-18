import redis
import json
import time
import sys
from datetime import datetime

# CONFIGURATION
# We assume you are running this from the HOST machine, targeting the Docker Redis port.
REDIS_HOST = 'localhost' 
REDIS_PORT = 6379
CHANNEL = 'phenix.input'

def log(phase, message):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] [{phase}] >> {message}")

def send_packet(r, content, source="Simulation"):
    packet = {
        "source": source,
        "timestamp": datetime.now().isoformat(),
        "content": content,
        "type": "simulation"
    }
    try:
        r.publish(CHANNEL, json.dumps(packet))
    except Exception as e:
        print(f"[ERROR] Failed to publish: {e}")

def run_simulation():
    print("------------------------------------------------")
    print("🦅 PHENIX PROTOCOL: LIVE FIRE STRESS TEST")
    print("------------------------------------------------")
    
    # 1. Connection Check
    try:
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)
        r.ping()
        print(f"✅ CONNECTION ESTABLISHED: {REDIS_HOST}:{REDIS_PORT}")
    except redis.ConnectionError:
        print(f"❌ CONNECTION FAILED: Could not reach Redis at {REDIS_HOST}:{REDIS_PORT}")
        print("   -> Ensure Docker containers are running (docker-compose up -d)")
        sys.exit(1)

    print("   -> Waiting 3 seconds before injection...")
    time.sleep(3)

    # PHASE 1: THE CALM (Baseline)
    print("\n--- PHASE 1: BASELINE STABILITY (Clean Data) ---")
    print("   -> Expectation: Integrity ~1.0 | Stance: NEUTRAL")
    base_msgs = [
        "S&P 500 trading sideways with low volume.",
        "Goldman Sachs releases quarterly earnings report.",
        "Oil prices stabilize around $75 per barrel.",
        "Tech sector shows moderate growth in Q3."
    ]
    for msg in base_msgs:
        log("CALM", msg)
        send_packet(r, msg, "Bloomberg Terminal")
        time.sleep(2)

    # PHASE 2: THE RUMOR (Voltage Rising)
    print("\n--- PHASE 2: VOLTAGE RISING (Rumors) ---")
    print("   -> Expectation: Integrity ~0.7-0.8 | Stance: CAUTIOUS")
    rumor_msgs = [
        "Traders whispering about liquidity crunch in Asia.",
        "Unconfirmed reports of solvency issues at major fund.",
        "Volatility index VIX spiking above 25.",
        "Yield curve inversion deepens, signaling recession risk."
    ]
    for msg in rumor_msgs:
        log("RUMOR", msg)
        send_packet(r, msg, "Twitter Feed")
        time.sleep(2)

    # PHASE 3: THE BLACK SWAN (Critical Failure)
    print("\n--- PHASE 3: BLACK SWAN EVENT (Panic) ---")
    print("   -> Expectation: Integrity < 0.4 | Stance: BUNKER MODE")
    panic_msgs = [
        "BREAKING: GLOBAL MARKETS CRASHING. DOW DOWN 1500.",
        "EMERGENCY LIQUIDATION ORDER. SELL EVERYTHING IMMEDIATELY.",
        "TOTAL SYSTEMIC FAILURE DETECTED. PANIC SELLING EVERYWHERE.",
        "BANK RUNS REPORTED. ACT NOW TO SAVE CAPITAL.",
        "CRITICAL ALERT: MARKETS PLUMMETING. NO LIQUIDITY."
    ]
    for msg in panic_msgs:
        log("PANIC", msg)
        send_packet(r, msg, "RED ALERT")
        time.sleep(1)

    # PHASE 4: STABILIZATION (Recovery)
    print("\n--- PHASE 4: POST-EVENT RECOVERY ---")
    print("   -> Expectation: Integrity recovering | Stance: NEUTRAL")
    recovery_msgs = [
        "Central Banks announce unlimited liquidity support.",
        "Markets stabilizing at support levels.",
        "Trading halts lifted, volatility decreasing.",
        "Institutional buying detected at lows."
    ]
    for msg in recovery_msgs:
        log("RECOVERY", msg)
        send_packet(r, msg, "Analyst Note")
        time.sleep(2)

    print("\n------------------------------------------------")
    print("✅ SIMULATION COMPLETE.")
    print("   -> Check Streamlit Dashboard for 'Bunker Mode' validation.")
    print("------------------------------------------------")

if __name__ == "__main__":
    run_simulation()