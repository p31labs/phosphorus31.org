"""
Phenix Navigator: Final Build & Packaging Utility
Path: C:\MASTER_PROJECT\67\package_build.py
Purpose: Aggregates Firmware, Viewport, and Citadel into a Sovereign Sled.
Version: 4.1.0 "Keystone Final"
"""

import os
import shutil
import json
import time
import sys
import subprocess
from pathlib import Path

# --- CONFIGURATION ---
PROJECT_ROOT = Path(__file__).resolve().parent
BUILD_DIR = PROJECT_ROOT / "DIST_SOVEREIGN_SLED"
DATE_STAMP = time.strftime("%Y%m%d_%H%M")

def fail_build(message):
    """Prints a failure message and exits with a non-zero code."""
    print(f"\n[FAIL] BUILD FAILED: {message}", file=sys.stderr)
    sys.exit(1)

def init_build_structure():
    """Initializes the forensic directory structure."""
    print(f">> Initializing Sovereign Sled: {BUILD_DIR.name}_{DATE_STAMP}")
    if BUILD_DIR.exists():
        print(f"   - Cleaning previous build directory...")
        shutil.rmtree(BUILD_DIR)
    
    (BUILD_DIR / "firmware").mkdir(parents=True)
    (BUILD_DIR / "viewport").mkdir(parents=True)
    (BUILD_DIR / "sovereignty" / "scripts").mkdir(parents=True)
    (BUILD_DIR / "forensics").mkdir(parents=True)

def run_preflight_checks():
    """Runs the isostatic tests to ensure system integrity before packaging."""
    print("\n>> Running Pre-flight Isostatic Validation...")
    test_script = PROJECT_ROOT / "run_isostatic_tests.py"
    
    if not test_script.exists():
        fail_build(f"Isostatic test runner not found at '{test_script}'.")
        
    result = subprocess.run([sys.executable, str(test_script)], capture_output=True, text=True)
    print(result.stdout)
    
    if result.returncode != 0:
        fail_build("Geometric Integrity Score (GIS) is below threshold. Rigidity compromised.")
    
    print("   - [OK] System is Isostatically Rigid. Proceeding with packaging.")

def gather_firmware():
    """Gathers pre-compiled ESP32-S3 binaries for rapid flashing."""
    print(">> Gathering Phantom v4.0 Firmware...")
    firmware_src_dir = PROJECT_ROOT / "phenix_phantom" / "build"
    files_to_copy = [
        "phenix_phantom.bin", 
        "bootloader/bootloader.bin", 
        "partition_table/partition-table.bin"
    ]
    
    if not firmware_src_dir.exists():
        fail_build(f"Firmware source missing: '{firmware_src_dir}'. Run 'idf.py build'.")

    for f_rel_path in files_to_copy:
        src = firmware_src_dir / f_rel_path
        dest_filename = os.path.basename(f_rel_path)
        dest = BUILD_DIR / "firmware" / dest_filename
        
        if not src.exists():
            fail_build(f"Firmware component '{f_rel_path}' missing.")
            
        shutil.copy(src, dest)
    
    # Also include the flashing script
    shutil.copy(PROJECT_ROOT / "phenix_phantom" / "flash_phantom.sh", BUILD_DIR / "firmware")
    print("   - [OK] Firmware binaries and flash utility secured.")

def gather_viewport():
    """Gathers the production-ready React Dashboard."""
    print(">> Gathering Sovereign Viewport (UI)...")
    dist_dir = PROJECT_ROOT / "dashboard" / "dist"
    
    if not dist_dir.exists() or not any(dist_dir.iterdir()):
        fail_build("Dashboard build missing. Run 'npm run build' in 'dashboard/'.")
        
    shutil.copytree(dist_dir, BUILD_DIR / "viewport", dirs_exist_ok=True)
    print("   - [OK] Viewport secured.")

def gather_sovereignty_kit():
    """Gathers the scripts required to prove the system is Headless."""
    print(">> Gathering Sovereignty & Forensic Kit...")
    scripts_to_copy = ["abdicate.sh", "run_isostatic_tests.py"]
    
    for script_name in scripts_to_copy:
        shutil.copy(PROJECT_ROOT / script_name, BUILD_DIR / "sovereignty")
        
    # Copy sovereignty oracle
    shutil.copy(
        PROJECT_ROOT / "scripts" / "verify_sovereignty.py", 
        BUILD_DIR / "sovereignty" / "scripts"
    )
    
    # Archive the last GIS report as baseline proof
    gis_report = PROJECT_ROOT / "forensics" / "last_gis_report.json"
    if gis_report.exists():
        shutil.copy(gis_report, BUILD_DIR / "forensics" / f"gis_report_{DATE_STAMP}.json")
    
    print("   - [OK] Abdication Protocol and Oracles secured.")

def create_genesis_launcher():
    """Creates a master Windows batch file for the operator."""
    print(">> Creating GENESIS_LAUNCHER.bat...")
    launcher_path = BUILD_DIR / "GENESIS_LAUNCHER.bat"
    
    content = f"""@echo off
TITLE PHENIX NAVIGATOR // SOVEREIGN OPERATOR
chcp 65001 > nul
set "SLED_ROOT=%~dp0"

echo ===================================================================
echo   PHENIX NAVIGATOR: GENESIS GATE v4.0
echo   OPERATOR: {os.getenv('USERNAME', 'Unknown')}
echo   SYSTEM STATE: ISOSTATICALLY RIGID
echo   BUILD DATE: {time.strftime('%Y-%m-%d %H:%M:%S')}
echo ===================================================================
echo.
echo   [1] Run Sovereignty Audit (Verify System is Headless)
echo   [2] Launch Sprout Map Viewport (UI Dashboard)
echo   [3] Review Abdication Protocol (The Point of No Return)
echo   [4] Flash Firmware to Node (Phantom v4.0)
echo.

:menu
set /p "opt=Select Vector [1-4]: "

if "%opt%"=="1" (
    python "%SLED_ROOT%sovereignty\\scripts\\verify_sovereignty.py"
    goto end
)
if "%opt%"=="2" (
    start "" "%SLED_ROOT%viewport\\index.html"
    goto end
)
if "%opt%"=="3" (
    echo.
    echo WARNING: The Abdication Protocol is IRREVERSIBLE.
    type "%SLED_ROOT%sovereignty\\abdicate.sh"
    goto end
)
if "%opt%"=="4" (
    echo.
    echo Flash Instructions:
    echo Connect ESP32 and run: idf.py -p (PORT) flash
    goto end
)

:end
echo.
pause
"""
    launcher_path.write_text(content, encoding='utf-8')
    print("   - [OK] Master control panel generated.")

if __name__ == "__main__":
    try:
        init_build_structure()
        run_preflight_checks()
        gather_firmware()
        gather_viewport()
        gather_sovereignty_kit()
        create_genesis_launcher()
        print(f"\n\n** BUILD COMPLETE: {BUILD_DIR.resolve()}")
    except SystemExit:
        pass
    except Exception as e:
        print(f"\n[FAIL] Unexpected error: {e}")
        sys.exit(1)
