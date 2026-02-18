#!/usr/bin/env python3
"""
System Health Check for Phenix Live Fire Simulation
Verifies all required services are running before stress test execution.
"""

import subprocess
import sys
import time
from datetime import datetime

def run_command(cmd):
    """Execute shell command and return output."""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return 1, "", str(e)

def check_docker_containers():
    """Check if all required Docker containers are running."""
    print("🔍 Checking Docker Containers...")
    
    # Get container status
    code, output, error = run_command("docker-compose ps --format 'table {{.Name}}\\t{{.Status}}\\t{{.Ports}}'")
    
    if code != 0:
        print(f"❌ Docker command failed: {error}")
        return False
    
    # Parse output
    lines = output.strip().split('\n')
    containers = {}
    
    for line in lines[1:]:  # Skip header
        if line.strip():
            parts = line.split('\t')
            if len(parts) >= 2:
                name = parts[0].strip()
                status = parts[1].strip()
                containers[name] = status
    
    # Required containers
    required = [
        'phenix_redis',
        'phenix_db', 
        'phenix_bridge',
        'phenix_shield',
        'phenix_engine',
        'phenix_hud'
    ]
    
    all_running = True
    for container in required:
        if container in containers:
            if 'Up' in containers[container]:
                print(f"✅ {container}: {containers[container]}")
            else:
                print(f"❌ {container}: {containers[container]}")
                all_running = False
        else:
            print(f"❌ {container}: NOT FOUND")
            all_running = False
    
    return all_running

def check_redis_connection():
    """Test Redis connection from host."""
    print("\n🔍 Testing Redis Connection...")
    
    try:
        import redis
        r = redis.Redis(host='localhost', port=6379, db=0)
        r.ping()
        print("✅ Redis connection successful")
        return True
    except ImportError:
        print("❌ Redis Python library not installed. Run: pip install redis")
        return False
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        print("   -> Ensure Redis container is running and port 6379 is exposed")
        return False

def check_dashboard_access():
    """Check if Streamlit dashboard is accessible."""
    print("\n🔍 Checking Dashboard Access...")
    
    try:
        import requests
        response = requests.get('http://localhost:8501', timeout=5)
        if response.status_code == 200:
            print("✅ Dashboard accessible at http://localhost:8501")
            return True
        else:
            print(f"❌ Dashboard returned status {response.status_code}")
            return False
    except ImportError:
        print("❌ Requests library not installed. Dashboard check skipped.")
        return True  # Don't fail the check for missing optional dependency
    except Exception as e:
        print(f"❌ Dashboard not accessible: {e}")
        print("   -> Ensure dashboard container is running")
        return False

def check_python_dependencies():
    """Check if required Python packages are installed."""
    print("\n🔍 Checking Python Dependencies...")
    
    required_packages = ['redis']
    missing = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} installed")
        except ImportError:
            print(f"❌ {package} missing")
            missing.append(package)
    
    if missing:
        print(f"   -> Install missing packages: pip install {' '.join(missing)}")
        return False
    
    return True

def main():
    """Main health check function."""
    print("🦅 PHENIX SYSTEM HEALTH CHECK")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    checks = [
        ("Docker Containers", check_docker_containers),
        ("Redis Connection", check_redis_connection),
        ("Python Dependencies", check_python_dependencies),
        ("Dashboard Access", check_dashboard_access),
    ]
    
    all_passed = True
    for check_name, check_func in checks:
        print(f"\n📋 {check_name}")
        print("-" * 30)
        try:
            result = check_func()
            if not result:
                all_passed = False
        except Exception as e:
            print(f"❌ Check failed with error: {e}")
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 ALL SYSTEM CHECKS PASSED!")
        print("   Ready to execute Live Fire simulation.")
        print("   Run: python stress_test.py")
    else:
        print("⚠️  SOME CHECKS FAILED!")
        print("   Please resolve issues before running simulation.")
        sys.exit(1)

if __name__ == "__main__":
    main()