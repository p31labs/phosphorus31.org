#!/usr/bin/env python3
# ══════════════════════════════════════════════════════════════════════════════
# COGNITIVE SHIELD: ABDICATION PROTOCOL (abdicate.py)
# Version: 2.0 (Python Wrapper)
# Status: CRITICAL / DESTRUCTIVE
# ══════════════════════════════════════════════════════════════════════════════

import sys
import os
import argparse
import subprocess
import time
import hashlib
from datetime import datetime

# Configuration
ESPEFUSE_CMD = "espefuse.py"
LOG_FILE = f"abdication_ceremony_{int(time.time())}.log"

# Colors
RED = "\033[0;31m"
GREEN = "\033[0;32m"
YELLOW = "\033[1;33m"
NC = "\033[0m"

def log(msg, level="INFO"):
    timestamp = datetime.now().strftime("%T")
    formatted_msg = f"[{timestamp}] [{level}] {msg}"
    print(formatted_msg)
    with open(LOG_FILE, "a") as f:
        f.write(formatted_msg + "\n")

def warn(msg):
    print(f"{YELLOW}[WARNING] {msg}{NC}")
    with open(LOG_FILE, "a") as f:
        f.write(f"[WARNING] {msg}\n")

def crit(msg):
    print(f"{RED}[CRITICAL] {msg}{NC}")
    with open(LOG_FILE, "a") as f:
        f.write(f"[CRITICAL] {msg}\n")

def run_command(cmd_list, dry_run=True):
    cmd_str = " ".join(cmd_list)
    if dry_run:
        log(f"[DRY RUN] Would execute: {cmd_str}")
        return True
    
    log(f"Executing: {cmd_str}")
    try:
        subprocess.check_call(cmd_list)
        return True
    except subprocess.CalledProcessError as e:
        crit(f"Command failed: {cmd_str} (Exit Code: {e.returncode})")
        return False
    except FileNotFoundError:
        crit(f"Command not found: {cmd_list[0]}")
        return False

def burn_jtag(port, dry_run):
    log("Step 1: Disabling Hardware Debugging (JTAG)...")
    cmds = [
        [ESPEFUSE_CMD, "-p", port, "burn_efuse", "DIS_JTAG", "--do-not-confirm"],
        [ESPEFUSE_CMD, "-p", port, "burn_efuse", "DIS_USB_JTAG", "--do-not-confirm"]
    ]
    for cmd in cmds:
        run_command(cmd, dry_run)

def corrupt_flash_encryption_key(port, dry_run):
    log("Step 2: Corrupting Flash Encryption Key (BLOCK_KEY0)...")
    # Attempt to burn max encryption cycles
    run_command([ESPEFUSE_CMD, "-p", port, "burn_efuse", "SPI_BOOT_CRYPT_CNT", "7", "--do-not-confirm"], dry_run)
    
    # Attempt to overwrite key block with junk
    junk_file = "key_corruption_payload.bin"
    if not dry_run and not os.path.exists(junk_file):
        with open(junk_file, "wb") as f:
            f.write(b'\xFF' * 32)
            
    run_command([ESPEFUSE_CMD, "-p", port, "burn_key", "BLOCK_KEY0", junk_file, "--force", "--do-not-confirm"], dry_run)
    
    if not dry_run and os.path.exists(junk_file):
        os.remove(junk_file)

def destroy_nvs_keys(port, dry_run):
    log("Step 3: Destroying NVS Encryption Key (HMAC_UP)...")
    junk_file = "nvs_corruption_payload.bin"
    if not dry_run and not os.path.exists(junk_file):
        with open(junk_file, "wb") as f:
            f.write(b'\xFF' * 32)
            
    run_command([ESPEFUSE_CMD, "-p", port, "burn_key", "HMAC_UP", junk_file, "--force", "--do-not-confirm"], dry_run)
    
    if not dry_run and os.path.exists(junk_file):
        os.remove(junk_file)

def shred_local_artifacts(dry_run):
    log("Step 4: Shredding local filesystem artifacts...")
    target_dir = "./sensitive_material"
    
    if os.path.exists(target_dir):
        if dry_run:
            log(f"[DRY RUN] Would execute: find {target_dir} -type f -exec shred -u -z -n 3 {{}} ;")
        else:
            # Python equivalent of shredding logic or calling shred
            # For simplicity/robustness, calling system shred if on Linux/Mac
            if sys.platform != "win32":
                run_command(["find", target_dir, "-type", "f", "-exec", "shred", "-u", "-z", "-n", "3", "{}", ";"], dry_run)
                run_command(["rm", "-rf", target_dir], dry_run)
            else:
                log("Windows detected. Using secure delete fallback (sdelete if available, else os.remove).")
                # Fallback logic for Windows
                for root, dirs, files in os.walk(target_dir, topdown=False):
                    for name in files:
                        path = os.path.join(root, name)
                        log(f"Secure deleting: {path}")
                        with open(path, "wb") as f:
                            f.write(os.urandom(os.path.getsize(path)))
                        os.remove(path)
                    for name in dirs:
                        os.rmdir(os.path.join(root, name))
                os.rmdir(target_dir)
            log("Local artifacts shredded.")
    else:
        log(f"No local sensitive directory found ({target_dir}).")

def main():
    parser = argparse.ArgumentParser(description="Cognitive Shield Abdication Protocol")
    parser.add_argument("--live-fire", action="store_true", help="Execute actual destructive commands")
    parser.add_argument("--port", default="/dev/ttyUSB0", help="Serial port for ESP32")
    args = parser.parse_args()

    dry_run = not args.live_fire

    print(f"{RED}")
    print("  ___  ______ _____ _____ _____  ___ _____ _____ _____ _   _ ")
    print(" / _ \ | ___ \  _  \_   _/  __ \/ _ \_   _|_   _|  _  | \ | |")
    print("/ /_\ \| |_/ / | | | | | | /  \/ /_\ \ | |   | | | | | |  \| |")
    print("|  _  || ___ \ | | | | | | |   |  _  | | |   | | | | | | . \ |")
    print("| | | || |_/ / |/ / _| |_| \__/\ | | | | |  _| |_\ \_/ / |\  |")
    print("\_| |_/\____/|___/  \___/ \____/\_| |_/\_/  \___/ \___/\_| \_/")
    print(f"{NC}")
    print("Cognitive Shield: Abdication Protocol v2.0 (Python)")
    print(f"Target: Phenix Navigator (ESP32-S3) | Port: {args.port}")
    if dry_run:
        print(f"Mode: {GREEN}DRY RUN (SAFE){NC}")
    else:
        print(f"Mode: {RED}LIVE FIRE (DESTRUCTIVE){NC}")
    print("────────────────────────────────────────────────────────────────")

    if not dry_run:
        print(f"{RED}WARNING: THIS PROCESS IS IRREVERSIBLE.{NC}")
        print("You are about to cryptographically erase the device identity.")
        confirm = input("Type 'ABDICATE' to continue: ")
        if confirm != "ABDICATE":
            print("Aborted.")
            sys.exit(1)

    log("Starting Abdication Sequence...")

    burn_jtag(args.port, dry_run)
    corrupt_flash_encryption_key(args.port, dry_run)
    destroy_nvs_keys(args.port, dry_run)
    shred_local_artifacts(dry_run)

    log("────────────────────────────────────────────────────────────────")
    if dry_run:
        log("Ceremony complete (Simulated). No keys were destroyed.")
        log("Run with --live-fire to execute.")
    else:
        log("ABDICATION COMPLETE. The center has been removed.")
        log("Device is now cryptographically inert.")

    # Hash the log
    with open(LOG_FILE, "rb") as f:
        digest = hashlib.sha256(f.read()).hexdigest()
    with open(LOG_FILE + ".sha256", "w") as f:
        f.write(digest)

if __name__ == "__main__":
    main()
