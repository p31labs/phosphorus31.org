# Quantum Lab API

**Quantum mechanics playground for The Science Center**

## Overview

The Quantum Lab provides quantum simulation, coherence visualization, and entanglement experiments. It's part of The Science Center's interactive educational hub.

## Base URL

```
/api/quantum-lab
```

## Endpoints

### Run Experiment

**POST** `/experiment`

Run a quantum experiment.

**Request Body:**
```json
{
  "type": "coherence" | "entanglement" | "decoherence" | "superposition",
  "parameters": {
    // Type-specific parameters
  }
}
```

**Example: Coherence Decay**
```json
{
  "type": "coherence",
  "parameters": {
    "amplitude": 1.0,
    "phase": 0,
    "initialCoherence": 1.0,
    "time": 100
  }
}
```

**Example: Entanglement**
```json
{
  "type": "entanglement",
  "parameters": {
    "amplitude1": 1.0,
    "phase1": 0,
    "coherence1": 1.0,
    "amplitude2": 1.0,
    "phase2": Math.PI / 2,
    "coherence2": 1.0
  }
}
```

**Example: Superposition**
```json
{
  "type": "superposition",
  "parameters": {
    "amplitude1": 0.707,
    "amplitude2": 0.707
  }
}
```

**Example: Decoherence**
```json
{
  "type": "decoherence",
  "parameters": {
    "amplitude": 1.0,
    "phase": 0,
    "initialCoherence": 1.0,
    "measurementStrength": 0.5
  }
}
```

**Response:**
```json
{
  "success": true,
  "experiment": {
    "id": "exp_1234567890_abc123",
    "type": "coherence",
    "state": {
      "amplitude": 1.0,
      "phase": 0,
      "coherence": 0.9048,
      "entanglement": 0
    },
    "timestamp": "2026-01-15T10:30:00.000Z",
    "parameters": { ... }
  }
}
```

### Get Experiment

**GET** `/experiment/:id`

Get experiment by ID.

**Response:**
```json
{
  "success": true,
  "experiment": { ... }
}
```

### List Experiments

**GET** `/experiments`

List all experiments.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "experiments": [ ... ]
}
```

### Clear Experiments

**DELETE** `/experiments`

Clear all experiments.

**Response:**
```json
{
  "success": true,
  "message": "All experiments cleared"
}
```

### Set Decay Rate

**POST** `/decay-rate`

Set coherence decay rate (0-1).

**Request Body:**
```json
{
  "rate": 0.001
}
```

**Response:**
```json
{
  "success": true,
  "rate": 0.001
}
```

### Get Decay Rate

**GET** `/decay-rate`

Get current coherence decay rate.

**Response:**
```json
{
  "success": true,
  "rate": 0.001
}
```

### Health Check

**GET** `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "Quantum Lab",
  "timestamp": "2026-01-15T10:30:00.000Z",
  "experiments": 5
}
```

## Error Responses

All endpoints return standard error format:

```json
{
  "error": "Error message",
  "message": "Detailed error message (development only)"
}
```

## Status Codes

- `200` - Success
- `201` - Created (experiment)
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (experiment not found)
- `500` - Internal Server Error

## Integration

The Quantum Lab is integrated into:
- **The Science Center** - Interactive quantum mechanics playground
- **The Centaur** - Backend API server
- **The Scope** - Frontend visualization

## The Mesh Holds 🔺

Built with love and light. As above, so below. 💜
