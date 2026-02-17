#!/usr/bin/env python3

import subprocess
import sys
import json
import time

try:
    import requests
except ImportError:
    print("Missing 'requests' package. Install with: pip install requests")
    sys.exit(1)

# List of critical services to check in docker-compose
CRITICAL_SERVICES = [
    "dashboard",
    "engine",
    "bridge",
    "shield",
    "monitoring",
    "backup"
]

# Optional: endpoints to check for HTTP health
ENDPOINTS = {
    "dashboard": "http://localhost:8080",
    # Add more endpoints as needed
}

def run_command(cmd):
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Command failed: {' '.join(cmd)}")
        print(e.stderr)
        sys.exit(1)

def check_services():
    print("Checking Docker Compose services status...")
    output = run_command(["docker-compose", "ps", "--format", "json"])
    try:
        services = json.loads(output)
    except Exception:
        print("Failed to parse docker-compose output. Raw output:")
        print(output)
        sys.exit(1)

    failed = []
    for svc in CRITICAL_SERVICES:
        svc_info = next((s for s in services if s["Name"].startswith(svc)), None)
        if not svc_info:
            print(f"[FAIL] Service '{svc}' not found.")
            failed.append(svc)
            continue
        state = svc_info.get("State", "")
        if "Up" not in state:
            print(f"[FAIL] Service '{svc}' is not running (state: {state})")
            failed.append(svc)
        else:
            print(f"[OK]   Service '{svc}' is running.")

    return failed

def check_endpoints():
    print("\nChecking HTTP endpoints...")
    failed = []
    for name, url in ENDPOINTS.items():
        try:
            resp = requests.get(url, timeout=5)
            if resp.status_code == 200:
                print(f"[OK]   {name} endpoint reachable: {url}")
            else:
                print(f"[FAIL] {name} endpoint returned status {resp.status_code}: {url}")
                failed.append(name)
        except Exception as e:
            print(f"[FAIL] {name} endpoint not reachable: {url} ({e})")
            failed.append(name)
    return failed

def main():
    failed_services = check_services()
    failed_endpoints = check_endpoints()

    if not failed_services and not failed_endpoints:
        print("\nAll critical services and endpoints are healthy.")
        sys.exit(0)
    else:
        print("\nDeployment verification failed.")
        if failed_services:
            print("Failed services:", ", ".join(failed_services))
        if failed_endpoints:
            print("Failed endpoints:", ", ".join(failed_endpoints))
        sys.exit(2)

if __name__ == "__main__":
    main()