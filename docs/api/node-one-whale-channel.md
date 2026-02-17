# Node One - Whale Channel API

LoRa mesh network communication (Whale Channel).

## Overview

Whale Channel is the LoRa 915MHz mesh network for Node One devices. It provides infrastructure-independent communication with long range and low power.

## Configuration

### Frequency

- **915MHz** (US/Canada)
- **868MHz** (Europe)
- **433MHz** (Asia)

### LoRa Parameters

```cpp
// Spreading Factor: 7-12 (higher = longer range, slower)
LoRa.setSpreadingFactor(7);

// Bandwidth: 7.8kHz - 500kHz
LoRa.setSignalBandwidth(125E3);

// Coding Rate: 5-8
LoRa.setCodingRate4(5);

// TX Power: 2-20 dBm
LoRa.setTxPower(20);
```

## Mesh Protocol

### Node Discovery

```cpp
void discoverNodes() {
  sendToMesh("DISCOVER");
  // Wait for responses
  // Build neighbor table
}
```

### Routing

```cpp
struct Route {
  uint8_t destination;
  uint8_t nextHop;
  uint8_t hops;
};
```

### Message Forwarding

```cpp
void forwardMessage(MeshMessage* msg) {
  if (msg->destination == myNodeId) {
    processMessage(msg);
  } else {
    Route* route = findRoute(msg->destination);
    if (route) {
      sendToNode(route->nextHop, msg);
    }
  }
}
```

## Message Types

### Ping

```cpp
struct PingMessage {
  uint8_t type = MESSAGE_PING;
  uint8_t sourceNode;
  uint32_t timestamp;
};
```

### Data

```cpp
struct DataMessage {
  uint8_t type = MESSAGE_DATA;
  uint8_t sourceNode;
  uint8_t destinationNode;
  char payload[256];
  uint32_t timestamp;
};
```

### Heartbeat

```cpp
struct HeartbeatMessage {
  uint8_t type = MESSAGE_HEARTBEAT;
  uint8_t nodeId;
  uint8_t signalStrength;
  uint32_t timestamp;
};
```

## Performance

### Bandwidth

- **Target**: 0.350 kbps (Whale Song bandwidth)
- **Actual**: Depends on spreading factor and bandwidth settings
- **Optimization**: Use binary packing, compression

### Range

- **Line of sight**: 2-5 miles
- **Urban**: 0.5-1 mile
- **Indoor**: 100-500 feet

### Power Consumption

- **TX**: 100-200mA @ 20dBm
- **RX**: 10-20mA
- **Sleep**: <1mA

## Best Practices

1. **Use appropriate spreading factor** for range vs speed
2. **Implement acknowledgments** for critical messages
3. **Use mesh routing** for multi-hop communication
4. **Optimize payload size** for bandwidth constraints
5. **Implement retry logic** for reliability

## Documentation

- [Node One](../node-one.md)
- [Whale Channel](../whale-channel.md)
- [Hardware Communication](node-one-hardware.md)

💜 With love and light. As above, so below. 💜
