# BLE Test Component

BLE (Bluetooth Low Energy) test component for Node One device.

## Overview

This component provides a BLE GATT server for testing connectivity to the Node One ESP32-S3 device. It implements a simple GATT service with a read/write characteristic for data exchange.

## Features

- **Device Name**: `P31-Node-One`
- **GATT Server**: Custom 128-bit UUID service
- **Test Characteristic**: Read/write characteristic for data exchange
- **Connection Monitoring**: Tracks connection status and client count
- **Auto-advertising**: Automatically starts advertising after initialization

## Service UUID

- **Service UUID**: `00112233-4455-6677-8899-aabbccddeeff`
- **Characteristic UUID**: `00112233-4455-6677-8899-aabbccddee01`

## Testing with Mobile Apps

### Android (nRF Connect)

1. Install **nRF Connect** from Google Play Store
2. Open the app and scan for devices
3. Look for device named **"P31-Node-One"**
4. Connect to the device
5. Navigate to the service with UUID `00112233-4455-6677-8899-aabbccddeeff`
6. Open the characteristic with UUID `00112233-4455-6677-8899-aabbccddee01`
7. **Read**: Tap the "Read" button to read current data
8. **Write**: Enter text and tap "Write" to send data to the device

### iOS (LightBlue)

1. Install **LightBlue** from App Store
2. Open the app and scan for devices
3. Look for device named **"P31-Node-One"**
4. Connect to the device
5. Navigate to the service with UUID `00112233-4455-6677-8899-aabbccddeeff`
6. Open the characteristic with UUID `00112233-4455-6677-8899-aabbccddee01`
7. **Read**: Tap "Read" to read current data
8. **Write**: Enter text and tap "Write" to send data

### Linux (bluetoothctl)

```bash
# Start bluetoothctl
bluetoothctl

# Scan for devices
scan on

# Wait for "P31-Node-One" to appear, then:
scan off

# Connect (replace XX:XX:XX:XX:XX:XX with actual MAC address)
connect XX:XX:XX:XX:XX:XX

# List services
menu gatt
list-attributes

# Select service (UUID: 00112233-4455-6677-8899-aabbccddeeff)
select-attribute /org/bluez/hci0/dev_XX_XX_XX_XX_XX_XX/service0012/char0013

# Read characteristic
read

# Write characteristic
write "test data"
```

### Windows (Windows Bluetooth LE Explorer)

1. Install **Windows Bluetooth LE Explorer** from Microsoft Store
2. Open the app and scan for devices
3. Look for device named **"P31-Node-One"**
4. Connect to the device
5. Navigate to the service and characteristic
6. Use read/write operations

## Python Testing Script

```python
import asyncio
from bleak import BleakScanner, BleakClient

# Service and characteristic UUIDs
SERVICE_UUID = "00112233-4455-6677-8899-aabbccddeeff"
CHAR_UUID = "00112233-4455-6677-8899-aabbccddee01"

async def test_ble():
    # Scan for device
    print("Scanning for P31-Node-One...")
    devices = await BleakScanner.discover()
    
    device = None
    for d in devices:
        if d.name == "P31-Node-One":
            device = d
            break
    
    if not device:
        print("Device not found!")
        return
    
    print(f"Found device: {device.address}")
    
    # Connect
    async with BleakClient(device) as client:
        print("Connected!")
        
        # Read characteristic
        data = await client.read_gatt_char(CHAR_UUID)
        print(f"Read data: {data}")
        
        # Write characteristic
        test_data = b"Hello from Python!"
        await client.write_gatt_char(CHAR_UUID, test_data)
        print(f"Wrote data: {test_data}")
        
        # Read again to verify
        data = await client.read_gatt_char(CHAR_UUID)
        print(f"Read data after write: {data}")

if __name__ == "__main__":
    asyncio.run(test_ble())
```

**Requirements**: `pip install bleak`

## Expected Behavior

1. **On Device Boot**: BLE initializes and starts advertising
2. **On Connection**: Device logs connection details (handle, MAC address)
3. **On Read**: Device returns current test data buffer
4. **On Write**: Device receives and logs the data
5. **On Disconnect**: Device automatically restarts advertising

## Log Messages

The component logs the following events:

- `BLE test component initialized` - Component initialized
- `BLE host synchronized` - BLE stack ready
- `BLE advertising started as 'P31-Node-One'` - Advertising active
- `BLE connection established` - Client connected
- `Characteristic read request` - Read operation received
- `Characteristic write request` - Write operation received
- `Received data: ...` - Data received from client
- `BLE disconnection` - Client disconnected

## Troubleshooting

### Device Not Appearing in Scan

1. Check serial logs for BLE initialization errors
2. Verify `CONFIG_BT_ENABLED=y` in `sdkconfig`
3. Ensure ESP32-S3 has Bluetooth support (all ESP32-S3 chips support BLE)

### Connection Fails

1. Check device is still advertising (logs should show "advertising started")
2. Verify device is not already connected to another client
3. Check signal strength (move closer to device)

### Read/Write Fails

1. Verify you're using the correct characteristic UUID
2. Check device logs for error messages
3. Ensure characteristic supports the operation (read/write flags)

## API Reference

See `include/ble_test.h` for full API documentation.

## Configuration

BLE settings are configured in `sdkconfig.defaults`:

```
CONFIG_BT_ENABLED=y
CONFIG_BT_NIMBLE_ENABLED=y
CONFIG_BT_NIMBLE_ROLE_PERIPHERAL=y
CONFIG_BT_NIMBLE_ROLE_BROADCASTER=y
CONFIG_BT_NIMBLE_MAX_CONNECTIONS=1
```

## Integration

The component is automatically initialized in `main.cpp` after shield server initialization. No additional configuration required.
