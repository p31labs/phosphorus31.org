# P31 Node One - Multi-Board Flashing Utility

Flash multiple Node One boards simultaneously on different COM/serial ports.

## Quick Start

### Windows (PowerShell)

```powershell
# Flash boards on COM5 and COM6
.\flash_multi_boards.ps1 -Ports COM5,COM6

# Build first, then flash
.\flash_multi_boards.ps1 -Build -Ports COM5,COM6

# Flash in parallel (faster for multiple boards)
.\flash_multi_boards.ps1 -Parallel -Ports COM5,COM6,COM7

# Flash and monitor
.\flash_multi_boards.ps1 -Ports COM5 -Monitor
```

### Linux/Mac (Bash)

```bash
# Make executable
chmod +x flash_multi_boards.sh

# Flash boards on /dev/ttyUSB0 and /dev/ttyUSB1
./flash_multi_boards.sh -p /dev/ttyUSB0,/dev/ttyUSB1

# Build first, then flash
./flash_multi_boards.sh --build -p /dev/ttyUSB0,/dev/ttyUSB1

# Flash in parallel (requires GNU parallel)
sudo apt-get install parallel  # Linux
brew install parallel          # macOS
./flash_multi_boards.sh --parallel -p /dev/ttyUSB0,/dev/ttyUSB1

# Flash and monitor
./flash_multi_boards.sh -p /dev/ttyUSB0 --monitor
```

## Interactive Mode

If you don't specify ports, the script will:
1. Detect all available COM/serial ports
2. Display them with numbers
3. Ask you to select which ports to flash

```powershell
# Windows - Interactive
.\flash_multi_boards.ps1

# Linux/Mac - Interactive
./flash_multi_boards.sh
```

## Options

### Windows (PowerShell)

| Option | Description |
|--------|-------------|
| `-Ports` | Comma-separated list of COM ports (e.g., `COM5,COM6`) |
| `-Parallel` | Flash boards in parallel (faster) |
| `-Build` | Build firmware before flashing |
| `-Monitor` | Start serial monitor after flashing |
| `-FirmwareDir` | Firmware directory (default: current) |

### Linux/Mac (Bash)

| Option | Description |
|--------|-------------|
| `-p, --ports` | Comma-separated list of ports (e.g., `/dev/ttyUSB0,/dev/ttyUSB1`) |
| `--parallel` | Flash boards in parallel (requires GNU parallel) |
| `--build` | Build firmware before flashing |
| `--monitor` | Start serial monitor after flashing |
| `-d, --dir` | Firmware directory (default: current) |

## Examples

### Flash 3 boards sequentially
```powershell
.\flash_multi_boards.ps1 -Ports COM5,COM6,COM7
```

### Flash 3 boards in parallel (faster)
```powershell
.\flash_multi_boards.ps1 -Parallel -Ports COM5,COM6,COM7
```

### Build and flash single board
```powershell
.\flash_multi_boards.ps1 -Build -Ports COM5
```

### Flash and monitor
```powershell
.\flash_multi_boards.ps1 -Ports COM5 -Monitor
```

### Interactive selection
```powershell
.\flash_multi_boards.ps1
# Script will show available ports and ask you to select
```

## Port Detection

### Windows
- Automatically detects COM ports via WMI
- Falls back to port scanning if WMI unavailable
- Shows port description (e.g., "USB Serial Port")

### Linux
- Detects `/dev/ttyUSB*` and `/dev/ttyACM*` devices
- Sorted alphabetically

### macOS
- Detects `/dev/tty.usbserial*` and `/dev/tty.usbmodem*` devices
- Sorted alphabetically

## Boot Mode

If an ESP32 is not detected on a port, the script will:
1. Prompt you to enter boot mode
2. Wait 3 seconds
3. Continue with flashing

**Boot Mode Steps:**
1. Hold BOOT button
2. Press RST while holding BOOT
3. Release RST, then release BOOT

## Error Handling

- Each board is flashed independently
- Failures on one board don't stop others
- Summary shows success/failure for each port
- Exit code reflects overall success (0 = all success, 1 = any failure)

## Parallel Flashing

**Windows:**
- Uses PowerShell `Start-Job` for parallel execution
- All boards flash simultaneously
- Faster for multiple boards

**Linux/Mac:**
- Requires GNU `parallel` utility
- Install: `sudo apt-get install parallel` (Linux) or `brew install parallel` (macOS)
- Falls back to sequential if not available

## G.O.D. Protocol Compliance

✅ **No Backdoors** - No hardcoded credentials or recovery mechanisms  
✅ **Code for Departure** - Autonomous operation ready  
✅ **Defensive Architecture** - Error handling throughout  
✅ **Audit Trail** - All operations logged  

## Troubleshooting

### "ESP-IDF not found"
- Windows: Run `$env:IDF_PATH\export.ps1`
- Linux/Mac: Run `. $IDF_PATH/export.sh`

### "No COM ports detected"
- Check USB connections
- Verify drivers installed
- Try unplugging and replugging devices

### "Flash failed"
- Enter boot mode manually
- Check USB cable (data-capable, not charge-only)
- Verify power supply (5V/1A minimum)
- Check for other processes using the port

### "Parallel mode not working" (Linux/Mac)
- Install GNU parallel: `sudo apt-get install parallel`
- Or use sequential mode (default)

## Expected Output

After successful flash, you should see:
- BSP initialization logs
- AXP2101 power rail configuration
- I2C bus initialization
- Component initialization
- "The Mesh Holds. 🔺" message

## Notes

- All boards flash the same firmware
- Each board operates independently after flashing
- Port selection is persistent during the session
- Monitor mode only works with one board at a time

---

**The Mesh Holds. 🔺**

*G.O.D. Protocol Compliant - No Backdoors*
