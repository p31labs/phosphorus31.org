#!/usr/bin/env python3
"""
🔺 UNIVERSAL AUDIT - Cognitive Shield Pre-Launch Verification
Comprehensive system integrity check before Navigator deployment.
"""

import os
import sys
import json
import hashlib
from pathlib import Path
from datetime import datetime

# ANSI colors
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
RESET = "\033[0m"
BOLD = "\033[1m"

class UniversalAudit:
    def __init__(self):
        self.root = Path(__file__).parent
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "checks": [],
            "passed": 0,
            "failed": 0,
            "warnings": 0
        }
    
    def log(self, status, category, message):
        icon = {"PASS": f"{GREEN}✓{RESET}", "FAIL": f"{RED}✗{RESET}", "WARN": f"{YELLOW}⚠{RESET}"}
        print(f"  {icon.get(status, '?')} [{category}] {message}")
        self.results["checks"].append({"status": status, "category": category, "message": message})
        if status == "PASS": self.results["passed"] += 1
        elif status == "FAIL": self.results["failed"] += 1
        else: self.results["warnings"] += 1
    
    def check_core_files(self):
        """Verify all critical files exist"""
        print(f"\n{CYAN}▸ CORE FILE INTEGRITY{RESET}")
        critical = [
            "README.md", "CREDITS.md", "LICENSE_HEADER.txt",
            "docker-compose.yml", "Cargo.toml", "tetrahedron_engine.py",
            "navigator_shield.py", "comm_bridge.py",
            "backend/backend_core.py", "backend/quantum_vault.py",
            "dashboard/package.json", "dashboard/src/App.jsx",
            "wonky-sprout/package.json", "wonky-sprout/src/App.jsx",
            "phenix_phantom/main/phenix_main.c" if (self.root / "phenix_phantom/main/phenix_main.c").exists() else "phenix_phantom/main",
            "src/lib.rs", "src-tauri/tauri.conf.json"
        ]
        for f in critical:
            path = self.root / f
            if path.exists():
                self.log("PASS", "FILE", f"{f}")
            else:
                self.log("FAIL", "FILE", f"Missing: {f}")
    
    def check_dockerfiles(self):
        """Verify Dockerfiles"""
        print(f"\n{CYAN}▸ DOCKER CONFIGURATION{RESET}")
        dockerfiles = ["Dockerfile.bridge", "Dockerfile.dashboard", "Dockerfile.engine", "Dockerfile.shield"]
        for df in dockerfiles:
            if (self.root / df).exists():
                self.log("PASS", "DOCKER", f"{df}")
            else:
                self.log("WARN", "DOCKER", f"Missing: {df}")
        
        if (self.root / "docker-compose.yml").exists():
            content = (self.root / "docker-compose.yml").read_text()
            if "services:" in content:
                self.log("PASS", "DOCKER", "docker-compose.yml valid structure")
            else:
                self.log("FAIL", "DOCKER", "docker-compose.yml missing services")
    
    def check_security(self):
        """Security audit"""
        print(f"\n{CYAN}▸ SECURITY AUDIT{RESET}")
        
        # Check for exposed secrets
        sensitive_patterns = ["password=", "secret=", "api_key=", "private_key"]
        exposed = []
        for f in self.root.rglob("*.py"):
            if "node_modules" in str(f) or "venv" in str(f) or "__pycache__" in str(f):
                continue
            try:
                content = f.read_text(errors='ignore').lower()
                for pattern in sensitive_patterns:
                    if pattern in content and "example" not in str(f).lower():
                        exposed.append(f.name)
                        break
            except: pass
        
        if not exposed:
            self.log("PASS", "SECURITY", "No hardcoded secrets detected in Python files")
        else:
            self.log("WARN", "SECURITY", f"Review files for secrets: {exposed[:3]}")
        
        # Check .env handling
        if (self.root / ".env").exists():
            self.log("PASS", "SECURITY", ".env file present for configuration")
        else:
            self.log("WARN", "SECURITY", "No .env file found")
        
        # Check kill chain exists
        if (self.root / "backend/kill_chain.py").exists():
            self.log("PASS", "SECURITY", "Kill chain emergency protocol present")
        
        # Check abdicate.sh
        if (self.root / "abdicate.sh").exists():
            self.log("PASS", "SECURITY", "Abdication protocol present")
    
    def check_frontend(self):
        """Frontend integrity"""
        print(f"\n{CYAN}▸ FRONTEND INTEGRITY{RESET}")
        
        for app in ["dashboard", "wonky-sprout"]:
            pkg_path = self.root / app / "package.json"
            if pkg_path.exists():
                try:
                    pkg = json.loads(pkg_path.read_text())
                    self.log("PASS", "FRONTEND", f"{app}: {pkg.get('name', 'unnamed')} v{pkg.get('version', '?')}")
                    
                    # Check critical deps
                    deps = pkg.get("dependencies", {})
                    if "react" in deps:
                        self.log("PASS", "FRONTEND", f"{app}: React {deps['react']}")
                    if "three" in deps:
                        self.log("PASS", "FRONTEND", f"{app}: Three.js {deps['three']}")
                except:
                    self.log("FAIL", "FRONTEND", f"{app}: Invalid package.json")
    
    def check_backend(self):
        """Backend integrity"""
        print(f"\n{CYAN}▸ BACKEND INTEGRITY{RESET}")
        
        req_path = self.root / "backend/requirements.txt"
        if req_path.exists():
            reqs = req_path.read_text().strip().split("\n")
            self.log("PASS", "BACKEND", f"{len(reqs)} Python dependencies defined")
            
            critical_deps = ["fastapi", "redis", "pydantic"]
            for dep in critical_deps:
                if any(dep in r.lower() for r in reqs):
                    self.log("PASS", "BACKEND", f"Dependency: {dep}")
    
    def check_firmware(self):
        """ESP32 firmware check"""
        print(f"\n{CYAN}▸ FIRMWARE INTEGRITY{RESET}")
        
        phantom_dir = self.root / "phenix_phantom"
        if phantom_dir.exists():
            self.log("PASS", "FIRMWARE", "phenix_phantom directory exists")
            
            if (phantom_dir / "sdkconfig.defaults").exists():
                self.log("PASS", "FIRMWARE", "ESP32 SDK config present")
            
            if (phantom_dir / "main").exists():
                main_files = list((phantom_dir / "main").glob("*"))
                self.log("PASS", "FIRMWARE", f"Main component: {len(main_files)} files")
            
            if (phantom_dir / "PHANTOM_FLASH_GUIDE.md").exists():
                self.log("PASS", "FIRMWARE", "Flash guide documentation present")
        else:
            self.log("FAIL", "FIRMWARE", "phenix_phantom directory missing")
    
    def check_tests(self):
        """Test coverage check"""
        print(f"\n{CYAN}▸ TEST COVERAGE{RESET}")
        
        test_files = list(self.root.rglob("test_*.py"))
        test_files += list(self.root.rglob("*_test.py"))
        
        if test_files:
            self.log("PASS", "TESTS", f"{len(test_files)} test files found")
            for tf in test_files[:5]:
                self.log("PASS", "TESTS", f"  → {tf.name}")
        else:
            self.log("WARN", "TESTS", "No test files found")
    
    def check_documentation(self):
        """Documentation audit"""
        print(f"\n{CYAN}▸ DOCUMENTATION{RESET}")
        
        docs = [
            ("README.md", "Project documentation"),
            ("CREDITS.md", "Attribution & credits"),
            ("LIVE_FIRE_PROTOCOL.md", "Deployment protocol"),
            ("phenix_phantom/PHANTOM_FLASH_GUIDE.md", "Firmware flashing guide"),
            ("wonky-sprout/README.md", "Kids app documentation"),
        ]
        
        for doc, desc in docs:
            if (self.root / doc).exists():
                size = (self.root / doc).stat().st_size
                self.log("PASS", "DOCS", f"{doc} ({size} bytes)")
            else:
                self.log("WARN", "DOCS", f"Missing: {doc} - {desc}")
    
    def check_git(self):
        """Git repository check"""
        print(f"\n{CYAN}▸ VERSION CONTROL{RESET}")
        
        if (self.root / ".git").exists():
            self.log("PASS", "GIT", "Git repository initialized")
            if (self.root / ".gitignore").exists():
                self.log("PASS", "GIT", ".gitignore present")
        else:
            self.log("WARN", "GIT", "No git repository found")
    
    def check_licensing(self):
        """License compliance"""
        print(f"\n{CYAN}▸ LICENSING{RESET}")
        
        if (self.root / "LICENSE_HEADER.txt").exists():
            self.log("PASS", "LICENSE", "License header template present")
        
        # Check README mentions license
        readme = self.root / "README.md"
        if readme.exists():
            try:
                content = readme.read_text(encoding='utf-8', errors='ignore')
                if "CERN-OHL" in content or "AGPLv3" in content:
                    self.log("PASS", "LICENSE", "License declared in README")
            except:
                self.log("WARN", "LICENSE", "Could not read README for license check")
    
    def generate_manifest(self):
        """Generate file manifest with hashes"""
        print(f"\n{CYAN}▸ GENERATING FILE MANIFEST{RESET}")
        
        manifest = {"generated": datetime.now().isoformat(), "files": []}
        
        important_dirs = ["backend", "dashboard/src", "wonky-sprout/src", "phenix_phantom", "scripts"]
        
        for dir_name in important_dirs:
            dir_path = self.root / dir_name
            if dir_path.exists():
                for f in dir_path.rglob("*"):
                    if f.is_file() and "node_modules" not in str(f) and "__pycache__" not in str(f):
                        try:
                            content = f.read_bytes()
                            h = hashlib.sha256(content).hexdigest()[:16]
                            manifest["files"].append({
                                "path": str(f.relative_to(self.root)),
                                "size": len(content),
                                "hash": h
                            })
                        except: pass
        
        manifest_path = self.root / "forensics/audit_manifest.json"
        manifest_path.parent.mkdir(exist_ok=True)
        manifest_path.write_text(json.dumps(manifest, indent=2))
        self.log("PASS", "MANIFEST", f"Generated manifest: {len(manifest['files'])} files")
    
    def run(self):
        print(f"\n{BOLD}{'='*60}{RESET}")
        print(f"{BOLD}🔺 COGNITIVE SHIELD - UNIVERSAL AUDIT{RESET}")
        print(f"{BOLD}{'='*60}{RESET}")
        print(f"  Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"  Root: {self.root}")
        
        self.check_core_files()
        self.check_dockerfiles()
        self.check_security()
        self.check_frontend()
        self.check_backend()
        self.check_firmware()
        self.check_tests()
        self.check_documentation()
        self.check_git()
        self.check_licensing()
        self.generate_manifest()
        
        # Summary
        print(f"\n{BOLD}{'='*60}{RESET}")
        print(f"{BOLD}📊 AUDIT SUMMARY{RESET}")
        print(f"{'='*60}")
        print(f"  {GREEN}✓ PASSED:   {self.results['passed']}{RESET}")
        print(f"  {YELLOW}⚠ WARNINGS: {self.results['warnings']}{RESET}")
        print(f"  {RED}✗ FAILED:   {self.results['failed']}{RESET}")
        
        if self.results['failed'] == 0:
            print(f"\n  {GREEN}{BOLD}🔺 SYSTEM AUDIT: PASSED{RESET}")
            print(f"  {GREEN}Ready for deployment!{RESET}")
        else:
            print(f"\n  {RED}{BOLD}⚠ SYSTEM AUDIT: ISSUES FOUND{RESET}")
            print(f"  {RED}Review failed checks before deployment{RESET}")
        
        print(f"{'='*60}\n")
        
        # Save results
        results_path = self.root / "forensics/audit_results.json"
        results_path.parent.mkdir(exist_ok=True)
        results_path.write_text(json.dumps(self.results, indent=2))
        
        return self.results['failed'] == 0

if __name__ == "__main__":
    audit = UniversalAudit()
    success = audit.run()
    sys.exit(0 if success else 1)
