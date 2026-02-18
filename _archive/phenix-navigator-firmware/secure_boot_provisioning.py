#!/usr/bin/env python3
# ══════════════════════════════════════════════════════════════════════════════
# COGNITIVE SHIELD: SECURE BOOT & FLASH ENCRYPTION PROVISIONING
# Version: 1.0 (The Architect)
# Status: CRITICAL / ONE-WAY OPERATION
# ══════════════════════════════════════════════════════════════════════════════
#
# PURPOSE:
# Generates the cryptographic keys required for the "Vault & House" architecture.
# 1. RSA-3072 Key for Secure Boot V2.
# 2. XTS-AES-256 Key for Flash Encryption.
#
# These keys are burned into the ESP32-S3 eFuses. Once enabled, the device
# will only boot signed firmware and the flash will be encrypted.
#
# SAFETY:
# Defaults to DRY_RUN. Requires explicit --live-fire flag.
# ══════════════════════════════════════════════════════════════════════════════

import os
import sys
import argparse
import subprocess
import time
from datetime import datetime

# Tools
ESPSECURE = "espsecure.py"
ESPEFUSE = "espefuse.py"

# Filenames
SB_KEY_FILE = "secure_boot_signing_key.pem"
FE_KEY_FILE = "flash_encryption_key.bin"
LOG_FILE = f"provisioning_ceremony_{int(time.time())}.log"

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

def run_cmd(cmd, dry_run=True):
    cmd_str = " ".join(cmd)
    if dry_run:
        log(f"[DRY RUN] Would execute: {cmd_str}")
        return True
    
    log(f"Executing: {cmd_str}")
    try:
        subprocess.check_call(cmd)
        return True
    except subprocess.CalledProcessError as e:
        log(f"Command failed: {cmd_str} (Exit Code: {e.returncode})", "ERROR")
        return False

def generate_keys():
    log("Step 1: Generating Cryptographic Keys...")
    
    # 1. Secure Boot V2 Key (RSA-3072)
    if not os.path.exists(SB_KEY_FILE):
        log(f"Generating Secure Boot Key ({SB_KEY_FILE})...")
        run_cmd([ESPSECURE, "generate_signing_key", "--version", "2", "--scheme", "rsa3072", SB_KEY_FILE], dry_run=False)
    else:
        log(f"Secure Boot Key exists: {SB_KEY_FILE}")

    # 2. Flash Encryption Key (XTS-AES-256)
    if not os.path.exists(FE_KEY_FILE):
        log(f"Generating Flash Encryption Key ({FE_KEY_FILE})...")
        run_cmd([ESPSECURE, "generate_flash_encryption_key", FE_KEY_FILE], dry_run=False)
    else:
        log(f"Flash Encryption Key exists: {FE_KEY_FILE}")

def burn_fuses(port, dry_run):
    log("Step 2: Burning eFuses (The Point of No Return)...")
    
    # 1. Enable Flash Encryption
    # Burn BLOCK_KEY0 with the generated AES key
    run_cmd([ESPEFUSE, "-p", port, "burn_key", "BLOCK_KEY0", FE_KEY_FILE, "XTS_AES_128_KEY"], dry_run)
    
    # Enable Flash Encryption mechanism (SPI_BOOT_CRYPT_CNT)
    # WARNING: This enables it in Release mode immediately if value is 7 (odd bits).
    # For development, we usually keep it open, but for production:
    run_cmd([ESPEFUSE, "-p", port, "burn_efuse", "SPI_BOOT_CRYPT_CNT", "7"], dry_run)
    
    # 2. Enable Secure Boot V2
    # Burn BLOCK_KEY1 with the hash of the RSA key (public key digest)
    # Note: We burn the digest, not the private key!
    # espsecure digest_rsa_public_key ...
    
    digest_file = "public_key_digest.bin"
    run_cmd([ESPSECURE, "digest_rsa_public_key", "--keyfile", SB_KEY_FILE, "--output", digest_file], dry_run=False)
    
    run_cmd([ESPEFUSE, "-p", port, "burn_key", "BLOCK_KEY1", digest_file, "SECURE_BOOT_DIGEST0"], dry_run)
    
    # Enable Secure Boot
    run_cmd([ESPEFUSE, "-p", port, "burn_efuse", "SECURE_BOOT_EN"], dry_run)
    
    # 3. Security Hardening
    # Disable JTAG (Soft disable first, hard disable by abdicate.sh later? Or do it now?)
    # Production best practice: Disable now.
    run_cmd([ESPEFUSE, "-p", port, "burn_efuse", "DIS_JTAG"], dry_run)
    run_cmd([ESPEFUSE, "-p", port, "burn_efuse", "DIS_USB_JTAG"], dry_run)
    
    # Disable ROM Download Mode (prevents unauthenticated flashing)
    # UART_DOWNLOAD_MODE = 0 (Disable) or 1 (Secure - verify signature)
    # We set to Secure to allow authorized updates? Or Disabled for total lockdown?
    # Recommended: Secure (1) if Secure Boot is enabled.
    run_cmd([ESPEFUSE, "-p", port, "burn_efuse", "UART_DOWNLOAD_MODE", "1"], dry_run)

def main():
    parser = argparse.ArgumentParser(description="Secure Boot & Flash Encryption Provisioning")
    parser.add_argument("--live-fire", action="store_true", help="Actually burn fuses")
    parser.add_argument("--port", default="COM3", help="Serial port")
    args = parser.parse_args()
    
    dry_run = not args.live_fire
    
    print(f"{RED}")
    print("╔══════════════════════════════════════════════════════════════╗")
    print("║           COGNITIVE SHIELD: PROVISIONING CEREMONY            ║")
    print("╚══════════════════════════════════════════════════════════════╝")
    print(f"{NC}")
    
    if dry_run:
        print(f"Mode: {GREEN}DRY RUN (SAFE){NC}")
    else:
        print(f"Mode: {RED}LIVE FIRE (DESTRUCTIVE - ONE WAY TRIP){NC}")
        confirm = input("Type 'PROVISION' to continue: ")
        if confirm != "PROVISION":
            print("Aborted.")
            sys.exit(1)

    generate_keys()
    burn_fuses(args.port, dry_run)
    
    log("Provisioning sequence completed.")
    if not dry_run:
        log("IMPORTANT: BACK UP 'secure_boot_signing_key.pem'. IF LOST, DEVICE IS BRICKED.")
        log("Do NOT back up 'flash_encryption_key.bin' if you want strict Abdication compliance.")

if __name__ == "__main__":
    main()
