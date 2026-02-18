import subprocess
import sys
import json
import time
from pathlib import Path

class IsostaticTestRunner:
    def __init__(self):
        self.root = Path(__file__).parent
        self.results = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "gis_score": 0.0,
            "components": {}
        }

    def log_result(self, name, passed, output=""):
        self.results["components"][name] = {"passed": passed, "summary": output[:200].replace('\n', ' ')}
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"[{status}] {name}")

    def run_command(self, name, cmd, cwd=None):
        print(f"🚀 Testing {name}...")
        try:
            res = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd or self.root)
            passed = res.returncode == 0
            self.log_result(name, passed, res.stdout if passed else res.stderr)
            return passed
        except Exception as e:
            self.log_result(name, False, str(e))
            return False

    def calculate_gis(self):
        total = len(self.results["components"])
        if total == 0: return 0.0
        passed = sum(1 for c in self.results["components"].values() if c["passed"])
        oracle = self.results["components"].get("Sovereignty_Oracle")
        if not oracle or not oracle.get("passed"):
            print("⚠️ CRITICAL: Sovereignty Oracle failed. GIS penalized to 0.0.")
            return 0.0
        return round(passed / total, 2)

    def execute(self):
        print("\n" + "="*50)
        print("PHENIX NAVIGATOR: ISOSTATIC VALIDATION")
        print("="*50 + "\n")
        self.run_command("Fisher_Escola_Logic", "pytest backend/tests/test_fisher_escola.py")
        self.run_command("Sovereignty_Oracle", "python scripts/verify_sovereignty.py")
        self.run_command("Dashboard_Build", "npm run build", cwd=self.root / "dashboard")
        self.run_command("Firmware_Handshake", "python scripts/test_firmware_logs.py --mock")
        gis = self.calculate_gis()
        self.results["gis_score"] = gis
        print(f"\n" + "-"*50)
        print(f"GEOMETRIC INTEGRITY SCORE (GIS): {gis}")
        print("-"*50)
        Path("forensics").mkdir(exist_ok=True)
        report_path = self.root / "forensics" / "last_gis_report.json"
        with open(report_path, "w") as f:
            json.dump(self.results, f, indent=2)
        if gis < 0.90:
            print(f"⚠️ STATUS: DECOHERENT. Review {report_path}")
            sys.exit(1)
        else:
            print("💎 STATUS: ISOSTATICALLY RIGID.")
            sys.exit(0)

if __name__ == "__main__":
    IsostaticTestRunner().execute()