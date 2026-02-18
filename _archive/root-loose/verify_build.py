#!/usr/bin/env python3
"""Verify Phenix Navigator firmware build artifacts"""
import os
from pathlib import Path
from datetime import datetime

build_dir = Path('phenix_phantom/build')

print("=" * 70)
print("PHENIX NAVIGATOR FIRMWARE BUILD VERIFICATION")
print("=" * 70)
print()

# Find all binary and elf files
binaries = []
for root, dirs, files in os.walk(build_dir):
    for file in files:
        if file.endswith(('.bin', '.elf')):
            path = Path(root) / file
            size = path.stat().st_size
            mtime = datetime.fromtimestamp(path.stat().st_mtime)
            if size > 10000:  # Only show files > 10KB
                binaries.append((path, size, mtime))

# Sort by size
binaries.sort(key=lambda x: x[1], reverse=True)

if not binaries:
    print("❌ ERROR: No build artifacts found!")
    print("   The firmware may not have been built successfully.")
    exit(1)

print(f"✅ Found {len(binaries)} firmware binaries:\n")

# Display results
total_size = 0
for path, size, mtime in binaries:
    rel_path = path.relative_to(build_dir)
    size_mb = size / 1024 / 1024
    total_size += size
    
    # Identify critical files
    marker = ""
    if 'phenix-phantom.elf' in str(path):
        marker = " 🎯 MAIN APP (ELF)"
    elif 'phenix-phantom.bin' in str(path):
        marker = " 🎯 MAIN APP (BINARY)"
    elif 'bootloader.bin' in str(path):
        marker = " 🔧 BOOTLOADER"
    elif 'partition-table.bin' in str(path) or 'partition_table.bin' in str(path):
        marker = " 📊 PARTITION TABLE"
    
    print(f"📦 {rel_path}{marker}")
    print(f"   Size: {size:,} bytes ({size_mb:.2f} MB)")
    print(f"   Modified: {mtime.strftime('%Y-%m-%d %H:%M:%S')}")
    print()

print("=" * 70)
print(f"Total firmware size: {total_size:,} bytes ({total_size/1024/1024:.2f} MB)")
print("=" * 70)
print()

# Check for critical files
critical_files = {
    'bootloader.bin': False,
    'partition': False,
    'phenix-phantom': False
}

for path, size, mtime in binaries:
    path_str = str(path)
    if 'bootloader.bin' in path_str:
        critical_files['bootloader.bin'] = True
    if 'partition' in path_str and path_str.endswith('.bin'):
        critical_files['partition'] = True
    if 'phenix-phantom' in path_str:
        critical_files['phenix-phantom'] = True

print("DEPLOYMENT READINESS CHECK:")
print("-" * 70)
for file, found in critical_files.items():
    status = "✅ FOUND" if found else "❌ MISSING"
    print(f"{status}: {file}")

print()
if all(critical_files.values()):
    print("🚀 BUILD STATUS: READY FOR DEPLOYMENT!")
    print()
    print("Next steps:")
    print("  1. Connect Waveshare ESP32-S3-Touch-LCD-3.5B")
    print("  2. Run: cd phenix_phantom && flash_phantom_windows.bat")
    print("  3. Monitor serial output for successful boot")
else:
    print("⚠️  BUILD STATUS: INCOMPLETE - Some files missing")
    print("   Run 'idf.py build' in phenix_phantom directory")

print("=" * 70)
