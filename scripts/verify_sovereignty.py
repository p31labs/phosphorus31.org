import os
import requests
import asyncio
import asyncpg
import redis
import sys
import json
from datetime import datetime
from pathlib import Path

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
REDIS_CONF = {"host": os.getenv("REDIS_HOST", "localhost"), "port": 6379}
DB_URL = os.getenv("DATABASE_URL", "postgresql://pilot:phenix_secret@localhost/phenix_core")
AUDIT_LOG_PATH = Path("forensics/sovereignty_audit.json")

class ConvergenceOracle:
    def __init__(self):
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "status": "DECOHERENT",
            "checks": {}
        }

    def log_check(self, name, passed, message):
        self.results["checks"][name] = {"passed": passed, "message": message}

    def check_abdication(self):
        private_key = Path("gov_private.pem")
        public_key = Path("gov_public.pem")
        if private_key.exists():
            self.log_check("Abdication", False, "Private Governance Key still exists. System is NOT sovereign.")
            return False
        if not public_key.exists():
            self.log_check("Abdication", False, "Public Governance Key missing. System cannot verify mesh.")
            return False
        self.log_check("Abdication", True, "Confirmed. System is Headless (Private Key Shredded).")
        return True

    async def check_ledger_integrity(self):
        try:
            conn = await asyncpg.connect(DB_URL)
            await conn.execute("SET app.current_user_id = ''")
            rows = await conn.fetch("SELECT * FROM care_ledger")
            if len(rows) > 0:
                self.log_check("RLS_Isolation", False, f"Leak detected! {len(rows)} rows visible without Node ID.")
                return False
            self.log_check("RLS_Isolation", True, "Active. Zero-Trust isolation verified.")
            await conn.close()
            return True
        except Exception as e:
            self.log_check("RLS_Isolation", False, f"Database unreachable: {e}")
            return False

    def check_catcher_mitt(self):
        try:
            r = redis.Redis(**REDIS_CONF)
            r.ping()
            self.log_check("Redis_Buffer", True, "Signal buffer active and responding.")
            return True
        except Exception as e:
            self.log_check("Redis_Buffer", False, f"Connectivity failure: {e}")
            return False

    def check_viewport_bridge(self):
        try:
            resp = requests.get(f"{BACKEND_URL}/health")
            if resp.status_code == 200 and resp.json().get("status") == "coherent":
                self.log_check("API_Gateway", True, "FastAPI Bridge is coherent.")
                return True
            self.log_check("API_Gateway", False, f"Unexpected status: {resp.json()}")
            return False
        except Exception as e:
            self.log_check("API_Gateway", False, f"Gateway Unreachable: {e}")
            return False

    def export_forensics(self):
        AUDIT_LOG_PATH.parent.mkdir(exist_ok=True)
        with open(AUDIT_LOG_PATH, "w") as f:
            json.dump(self.results, f, indent=2)

    async def run(self):
        s1 = self.check_abdication()
        s2 = await self.check_ledger_integrity()
        s3 = self.check_catcher_mitt()
        s4 = self.check_viewport_bridge()
        success = all([s1, s2, s3, s4])
        self.results["status"] = "ISOSTATIC_CONVERGENCE" if success else "DECOHERENT"
        self.export_forensics()
        return success

if __name__ == "__main__":
    oracle = ConvergenceOracle()
    success = asyncio.run(oracle.run())
    sys.exit(0 if success else 1)