# Cognitive Prosthetics API 🔺

**Assistive technology for neurodivergent cognitive support**

Built with love and light. As above, so below. 💜

## Overview

The Cognitive Prosthetics API provides endpoints for cognitive support tools including attention management, executive function support, and working memory aids.

## Base URL

```
/api/cognitive-prosthetics
```

## Endpoints

### Cognitive State

#### Get Cognitive State

**GET** `/state`

Get current cognitive state, health score, interventions, and recommendations.

**Response:**
```json
{
  "success": true,
  "state": {
    "attention": 45,
    "executiveFunction": 60,
    "workingMemory": 50,
    "emotionalRegulation": 70,
    "sensoryProcessing": 65,
    "timestamp": 1234567890
  },
  "healthScore": 58,
  "interventions": [
    {
      "type": "attention",
      "severity": "medium",
      "message": "Attention support needed...",
      "actions": ["Take a 5-minute break", "Use focus timer"],
      "timestamp": 1234567890
    }
  ],
  "recommendations": [
    "Take regular breaks",
    "Use assistive tools available"
  ]
}
```

#### Update Cognitive State

**POST** `/state`

Update cognitive state values.

**Request Body:**
```json
{
  "attention": 45,
  "executiveFunction": 60,
  "workingMemory": 50,
  "emotionalRegulation": 70,
  "sensoryProcessing": 65
}
```

**Response:**
```json
{
  "success": true,
  "state": { ... },
  "interventions": [ ... ]
}
```

### Attention Support

#### Get Focus Session

**GET** `/attention/session`

Get current focus session and history.

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "session_1234567890",
    "startTime": 1234567890,
    "endTime": null,
    "duration": 0,
    "focusScore": 75,
    "distractions": 2,
    "breaks": 0
  },
  "history": [ ... ],
  "averageScore": 72,
  "isOnBreak": false
}
```

#### Start Focus Session

**POST** `/attention/session/start`

Start a new focus session.

**Response:**
```json
{
  "success": true,
  "session": { ... }
}
```

#### Start Pomodoro Timer

**POST** `/attention/pomodoro/start`

Start a 25-minute Pomodoro timer.

**Response:**
```json
{
  "success": true,
  "message": "Pomodoro timer started"
}
```

### Executive Function Support

#### Get Tasks

**GET** `/executive/tasks`

Get all tasks, optionally filtered by status or priority.

**Query Parameters:**
- `status`: `pending` | `in-progress` | `completed` | `blocked`
- `priority`: `low` | `medium` | `high`

**Response:**
```json
{
  "success": true,
  "tasks": [
    {
      "id": "task_123",
      "title": "Complete project",
      "description": "Finish the P31 project",
      "priority": "high",
      "status": "in-progress",
      "subtasks": [ ... ],
      "createdAt": 1234567890
    }
  ]
}
```

#### Create Task

**POST** `/executive/tasks`

Create a new task.

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the P31 project",
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "task": { ... }
}
```

### Working Memory Support

#### Get Notes

**GET** `/memory/notes`

Get notes, optionally filtered by query, category, or tag.

**Query Parameters:**
- `query`: Search query
- `category`: Filter by category
- `tag`: Filter by tag

**Response:**
```json
{
  "success": true,
  "notes": [
    {
      "id": "note_123",
      "content": "Important information",
      "category": "work",
      "tags": ["urgent"],
      "importance": "high",
      "createdAt": 1234567890,
      "accessedAt": 1234567890,
      "accessCount": 5
    }
  ]
}
```

#### Create Note

**POST** `/memory/notes`

Create a new note.

**Request Body:**
```json
{
  "content": "Important information",
  "category": "work",
  "tags": ["urgent"],
  "importance": "high"
}
```

**Response:**
```json
{
  "success": true,
  "note": { ... }
}
```

#### Get Due Reminders

**GET** `/memory/reminders`

Get all due reminders.

**Response:**
```json
{
  "success": true,
  "reminders": [
    {
      "id": "reminder_123",
      "message": "Call doctor",
      "dueTime": 1234567890,
      "completed": false
    }
  ]
}
```

### Health Check

**GET** `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "Cognitive Prosthetics",
  "timestamp": "2026-01-15T10:30:00.000Z"
}
```

## Integration

The Cognitive Prosthetics API integrates with:
- **The Buffer**: Metabolism system for cognitive load assessment
- **The Centaur**: Main backend API server
- **The Scope**: Frontend visualization and controls

## Privacy & Security

- All cognitive data is stored locally
- No external sharing without explicit consent
- Encrypted storage for sensitive data
- User control over all features

## The Mesh Holds 🔺

Built with love and light. As above, so below. 💜

*Cognitive prosthetics are tools that support, not replace. They empower, they don't diminish.*
