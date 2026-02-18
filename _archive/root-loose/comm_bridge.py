import asyncio
import json
import os
import subprocess
import redis
from datetime import datetime
from telethon import TelegramClient, events

# --- CONFIGURATION ---
# Replace with your actual credentials
TELEGRAM_API_ID = '12345678'
TELEGRAM_API_HASH = 'abcdef1234567890'
SIGNAL_USER = '+15550000000' # Your Signal Number

# Redis connection for publishing to the Shield
REDIS_HOST = os.getenv('REDIS_HOST', 'phenix_redis')
r_client = redis.Redis(host=REDIS_HOST, port=6379, db=0)

# --- TELEGRAM SENTINEL ---
client = TelegramClient('phenix_session', TELEGRAM_API_ID, TELEGRAM_API_HASH)

@client.on(events.NewMessage)
async def handle_telegram(event):
    sender = await event.get_sender()
    sender_name = getattr(sender, 'username', 'Unknown') or getattr(sender, 'title', 'Unknown')
    
    packet = {
        "source": f"Telegram: {sender_name}",
        "timestamp": datetime.now().isoformat(),
        "content": event.raw_text,
        "type": "incoming"
    }
    push_to_shield(packet)

# --- SIGNAL SENTINEL ---
async def monitor_signal():
    """
    Spawns a subprocess to listen to signal-cli JSON output.
    """
    print("[BRIDGE] Attaching to Signal Daemon...")
    try:
        # Check if signal-cli is available
        process = await asyncio.create_subprocess_exec(
            'signal-cli', '-u', SIGNAL_USER, 'receive', '--json',
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        while True:
            line = await process.stdout.readline()
            if not line:
                break
            
            try:
                data = json.loads(line.decode().strip())
                # Parse signal-cli JSON structure
                if 'envelope' in data and 'dataMessage' in data['envelope']:
                    message_content = data['envelope']['dataMessage'].get('message')
                    source = data['envelope'].get('sourceName') or data['envelope'].get('source')
                    
                    if message_content:
                        packet = {
                            "source": f"Signal: {source}",
                            "timestamp": datetime.now().isoformat(),
                            "content": message_content,
                            "type": "incoming"
                        }
                        push_to_shield(packet)
            except Exception as e:
                print(f"[ERROR] Signal Parse Fail: {e}")
    except FileNotFoundError:
        print("[ERROR] signal-cli not found. Continuing with Telegram monitoring only")
    except Exception as e:
        print(f"[ERROR] Signal monitoring failed: {e}")

# --- THE AIRLOCK (Data Handoff) ---
def push_to_shield(packet):
    """
    Publishes the raw packet to Redis channel 'phenix.input' for the Shield to consume.
    """
    try:
        # Publish to Redis channel instead of writing to file
        r_client.publish('phenix.input', json.dumps(packet))
        print(f"[SENT] {packet['source']} -> Redis Bus")
    except Exception as e:
        print(f"[FAIL] Redis Error: {e}")

# --- MAIN LOOP ---
async def main():
    print("--- PHENIX COMM-BRIDGE INITIALIZED ---")
    print(f"Targeting Redis: {REDIS_HOST}")
    
    # Start Telegram Listener with default phone number to avoid interactive prompt
    try:
        await client.start(phone=lambda: "1234567890")  # Use a default phone number
        print("[INFO] Telegram client started successfully")
    except Exception as e:
        print(f"[ERROR] Telegram client failed to start: {e}")
        print("[INFO] Continuing with Signal monitoring only")
    
    # Run Signal Monitor and Telegram loop concurrently
    try:
        await asyncio.gather(
            client.run_until_disconnected(),
            monitor_signal()
        )
    except Exception as e:
        print(f"[ERROR] Bridge failed: {e}")
        print("[INFO] Bridge will restart...")
        # Don't exit, just restart the main function
        await main()

if __name__ == '__main__':
    asyncio.run(main())