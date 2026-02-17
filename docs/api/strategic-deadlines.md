# Strategic Deadline Tracker API

**Track critical deadlines and opportunities**

Built with love and light. As above, so below. 💜  
The Mesh Holds. 🔺

## Overview

The Strategic Deadline Tracker API provides endpoints for managing deadlines, opportunities, and action items from the 120-day strategic plan.

## Base URL

```
/api/strategic/deadlines
```

## Endpoints

### Get All Deadlines

**GET** `/`

Get all deadlines, optionally filtered.

**Query Parameters:**
- `priority`: `critical` | `high` | `medium` | `low`
- `status`: `pending` | `in-progress` | `completed` | `missed`
- `upcoming`: `true` (get upcoming deadlines)
- `days`: Number of days for upcoming filter (default: 30)
- `overdue`: `true` (get overdue deadlines)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "deadlines": [
    {
      "id": "autism-tech-accelerator",
      "title": "Autism Tech Accelerator Application",
      "date": 1708992000000,
      "priority": "critical",
      "status": "pending",
      "category": "application",
      "description": "Free, 10-week virtual accelerator...",
      "actionItems": ["Review requirements", "Submit application"],
      "value": "Free 10-week accelerator, no equity",
      "url": "https://multiple.co/autism-tech-accelerator",
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  ]
}
```

### Get Critical Deadlines

**GET** `/critical`

Get critical deadlines in the next 14 days.

**Response:**
```json
{
  "success": true,
  "count": 1,
  "deadlines": [ ... ]
}
```

### Get Deadline Summary

**GET** `/summary`

Get summary statistics.

**Response:**
```json
{
  "success": true,
  "summary": {
    "total": 10,
    "pending": 7,
    "inProgress": 2,
    "completed": 1,
    "overdue": 0,
    "critical": 1,
    "upcoming": 3
  }
}
```

### Get Deadline by ID

**GET** `/:id`

Get specific deadline.

**Response:**
```json
{
  "success": true,
  "deadline": { ... }
}
```

### Create Deadline

**POST** `/`

Create new deadline.

**Request Body:**
```json
{
  "title": "New Deadline",
  "date": "2026-03-15",
  "priority": "high",
  "category": "grant",
  "description": "Description",
  "actionItems": ["Action 1", "Action 2"],
  "value": "Strategic value",
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "deadline": { ... }
}
```

### Update Deadline

**PUT** `/:id`

Update deadline.

**Request Body:**
```json
{
  "status": "in-progress",
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "success": true,
  "deadline": { ... }
}
```

### Complete Deadline

**POST** `/:id/complete`

Mark deadline as completed.

**Response:**
```json
{
  "success": true,
  "deadline": { ... }
}
```

### Start Deadline

**POST** `/:id/start`

Mark deadline as in-progress.

**Response:**
```json
{
  "success": true,
  "deadline": { ... }
}
```

### Delete Deadline

**DELETE** `/:id`

Delete deadline.

**Response:**
```json
{
  "success": true,
  "message": "Deadline deleted"
}
```

## Default Deadlines

The system initializes with default deadlines from the strategic plan:
- Autism Tech Accelerator (Feb 27, 2026)
- Mario Day + Birthday (March 10, 2026)
- Beyond Compliance Conference (March 10-11, 2026)
- Family Court Hearing (March 12, 2026)
- Mario Movie Release (April 1, 2026)

## The Mesh Holds 🔺

Built with love and light. As above, so below. 💜
