import os
import json
import logging
import time
import redis
import psycopg2
from datetime import datetime
from phenix_shield import ToxinFilter

class CognitiveShield:
    def __init__(self):
        # Connect to Redis (Nervous System)
        self.r = redis.Redis(host=os.getenv('REDIS_HOST', 'phenix_redis'), port=6379, db=0)
        self.pubsub = self.r.pubsub()
        self.pubsub.subscribe('phenix.input')
        
        # Connect to DB (Memory) with retry logic
        max_attempts = 30
        for attempt in range(max_attempts):
            try:
                self.conn = psycopg2.connect(
                    host=os.getenv('DB_HOST', 'phenix_db'),
                    database="phenix_core",
                    user="pilot",
                    password=os.getenv('DB_PASSWORD', 'phenix_secret')
                )
                break
            except psycopg2.OperationalError as e:
                print(f"DB connection failed (attempt {attempt+1}/{max_attempts}): {e}")
                time.sleep(2)
        else:
            raise RuntimeError("Could not connect to DB after multiple attempts.")
        self.sanitizer = ToxinFilter()
        print("PHENIX SHIELD: Connected to Cortex and Nervous System.")

    def watch_stream(self):
        print("Listening on Channel: phenix.input...")
        for msg in self.pubsub.listen():
            if msg['type'] == 'message':
                data = json.loads(msg['data'])
                score = self.sanitizer.scan_voltage(data['content'])
                
                # Log to DB
                cursor = self.conn.cursor()
                cursor.execute(
                    "INSERT INTO system_metrics (integrity_score, status_mode) VALUES (%s, %s)",
                    (score, 'FLOATING_NEUTRAL' if score > 0.65 else 'BUNKER_MODE')
                )
                self.conn.commit()
                
                # Publish Clean Data
                if score > 0.65:
                    self.r.publish('phenix.clean', json.dumps(data))

if __name__ == "__main__":
    shield = CognitiveShield()
    shield.watch_stream()