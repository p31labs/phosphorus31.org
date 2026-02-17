# P31 Language API

**Domain-Specific Language for the P31 Ecosystem**

Built with love and light. As above, so below. 💜  
The Mesh Holds. 🔺

## Overview

The P31 Language API provides endpoints for parsing, interpreting, and executing P31 DSL code.

## Base URL

```
/api/p31-language
```

## Endpoints

### Parse P31 Code

**POST** `/parse`

Parse P31 source code into Abstract Syntax Tree (AST).

**Request Body:**
```json
{
  "code": "tetrahedron my_tetra {\n  vertex a: \"The Operator\";\n}"
}
```

**Response:**
```json
{
  "success": true,
  "ast": [
    {
      "type": "Tetrahedron",
      "id": "my_tetra",
      "vertices": [
        {
          "type": "Vertex",
          "id": "a",
          "label": "The Operator"
        }
      ],
      "edges": []
    }
  ]
}
```

### Execute P31 Code

**POST** `/execute`

Execute P31 code and return results.

**Request Body:**
```json
{
  "code": "let spoons: int = 10;\nconsume_spoons(3);"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "spoons": 7
  },
  "output": "[P31] Consumed 3 spoons, remaining: 7"
}
```

### Validate Tetrahedron

**POST** `/validate-tetrahedron`

Validate tetrahedron topology.

**Request Body:**
```json
{
  "tetrahedron": {
    "vertices": ["a", "b", "c", "d"],
    "edges": [
      {"from": "a", "to": "b"},
      {"from": "a", "to": "c"},
      {"from": "a", "to": "d"},
      {"from": "b", "to": "c"},
      {"from": "b", "to": "d"},
      {"from": "c", "to": "d"}
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "message": "Tetrahedron is valid"
}
```

### Get Language Info

**GET** `/info`

Get P31 language information.

**Response:**
```json
{
  "success": true,
  "language": {
    "name": "P31",
    "version": "1.0.0",
    "keywords": ["tetrahedron", "vertex", "edge", ...],
    "types": ["Tetrahedron", "Vertex", "Edge", ...],
    "functions": ["connect", "measure_coherence", ...]
  }
}
```

## The Mesh Holds 🔺

Built with love and light. As above, so below. 💜
