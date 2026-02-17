# P31 Connections Map

**Every connection made clear. Every path visible. The mesh holds.** 🔺

Built with love and light. As above, so below. 💜

---

## The Complete Connection Diagram

```
                    ┌─────────────────┐
                    │   THE SCOPE     │
                    │   (Frontend)    │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
        ┌───────▼──────┐ ┌──▼───┐ ┌──────▼──────┐
        │  Art Area    │ │ Math │ │  Science    │
        │  Math Area   │ │ Area │ │  Center     │
        │  Family Hub  │ │      │ │  Backyard   │
        └───────┬──────┘ └──┬───┘ └──────┬──────┘
                │            │            │
                └────────────┼────────────┘
                             │
                    ┌────────▼────────┐
                    │   THE BUFFER     │
                    │ (Message Queue) │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  THE CENTAUR    │
                    │  (Backend AI)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│ Cognitive      │  │  Game Engine    │  │  Strategic      │
│ Prosthetics    │  │  + Wallet       │  │  Planning       │
└───────┬────────┘  └────────┬────────┘  └───────┬────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   NODE ONE      │
                    │  (Hardware)     │
                    └─────────────────┘
```

---

## Component Connections

### The Scope ↔ The Buffer
- **Protocol**: HTTP + WebSocket
- **Purpose**: Message submission, status updates, real-time notifications
- **Data Flow**: User input → Scope → Buffer → Processing → Response → Scope
- **Integration**: `BufferDashboard`, `SimpleBuffer`, `useBufferHeartbeat`

### The Buffer ↔ The Centaur
- **Protocol**: HTTP + WebSocket + Redis
- **Purpose**: Message processing, AI responses, metabolism sync
- **Data Flow**: Buffer → Centaur → AI Processing → Response → Buffer
- **Integration**: `BufferClient`, message queue, metabolism system

### The Centaur ↔ Cognitive Prosthetics
- **Protocol**: Internal API
- **Purpose**: Cognitive state monitoring, interventions, support
- **Data Flow**: Cognitive state → Prosthetic → Interventions → Recommendations
- **Integration**: `/api/cognitive-prosthetics/*` endpoints

### Cognitive Prosthetics ↔ The Buffer
- **Protocol**: Metabolism integration
- **Purpose**: Cognitive load assessment, spoon management
- **Data Flow**: Buffer metabolism → Cognitive state → Interventions
- **Integration**: Metabolism system, cognitive load assessor

### The Centaur ↔ Game Engine
- **Protocol**: Internal API
- **Purpose**: Game state, wallet rewards, challenge completion
- **Data Flow**: Game actions → Centaur → Wallet → Rewards
- **Integration**: `/api/game/*` endpoints, `WalletIntegration`

### Game Engine ↔ Wallet
- **Protocol**: Direct integration
- **Purpose**: LOVE token rewards, transfers, balance tracking
- **Data Flow**: Challenge completion → Wallet reward → Balance update
- **Integration**: `WalletIntegration`, `WalletManager`

### The Centaur ↔ Strategic Planning
- **Protocol**: Internal API
- **Purpose**: Deadline tracking, opportunity management
- **Data Flow**: Strategic plan → Deadline tracker → API → Dashboard
- **Integration**: `/api/strategic/deadlines/*` endpoints

### The Scope ↔ Assistive Technology
- **Protocol**: React hooks + context
- **Purpose**: Voice control, switch control, accessibility features
- **Data Flow**: User input → AssistiveTech → UI adaptation → User
- **Integration**: `AssistiveTechProvider`, `useAssistiveTech`, voice/switch controls

### Assistive Technology ↔ Cognitive Prosthetics
- **Protocol**: Shared state + API
- **Purpose**: Cognitive support through assistive interfaces
- **Data Flow**: AT usage → Cognitive state → Prosthetic interventions
- **Integration**: Shared cognitive state, intervention triggers

### Node One ↔ All Components
- **Protocol**: LoRa (Whale Channel) + USB/Serial + HTTP Bridge
- **Purpose**: Hardware communication, off-grid messaging
- **Data Flow**: Node One → Buffer → Centaur → Response → Node One
- **Integration**: Whale Channel, serial bridge, HTTP API

---

## Data Flow Patterns

### Message Flow
```
User → Scope → Buffer → Centaur → AI → Response → Buffer → Scope → User
```

### Cognitive Support Flow
```
User Action → AssistiveTech → Cognitive State → Prosthetic → Intervention → User
```

### Game Reward Flow
```
Game Action → Game Engine → Challenge Completion → Wallet → LOVE Reward → Balance Update
```

### Strategic Planning Flow
```
Deadline → Tracker → API → Dashboard → Action Items → Completion → Update
```

### Metabolism Flow
```
User Activity → Buffer Metabolism → Cognitive Load → Prosthetic → Intervention
```

---

## API Connection Matrix

| Component | Endpoints | Purpose |
|-----------|-----------|---------|
| **The Centaur** | `/api/*` | Main backend API |
| **The Buffer** | `/api/messages/*` | Message processing |
| **Cognitive Prosthetics** | `/api/cognitive-prosthetics/*` | Cognitive support |
| **Game Engine** | `/api/game/*` | Game operations |
| **Wallet** | `/api/wallet/*` | LOVE token operations |
| **Strategic** | `/api/strategic/deadlines/*` | Deadline tracking |
| **Quantum Lab** | `/api/quantum-lab/*` | Quantum experiments |
| **Quantum SOP** | `/api/quantum-sop/*` | SOP generation |

---

## Integration Points

### Frontend (The Scope)
- **AssistiveTechProvider**: Wraps app, provides AT context
- **useAssistiveTech**: Hook for AT features
- **BufferDashboard**: Real-time buffer status
- **GameEngine3D**: 3D game visualization
- **ScienceCenter**: Educational hub
- **FamilyHub**: Family activities
- **ArtArea, MathArea, BackyardShenanigans**: Interactive areas

### Backend (The Centaur)
- **CognitiveProsthetic**: Core cognitive support
- **AttentionSupport**: Focus management
- **ExecutiveFunctionSupport**: Task management
- **WorkingMemorySupport**: Notes and reminders
- **DeadlineTracker**: Strategic planning
- **WalletIntegration**: LOVE token economy
- **GameEngine**: Building and challenges

### Communication Layer (The Buffer)
- **Message Queue**: Batched message processing
- **Metabolism System**: Spoon management
- **Ping System**: Object permanence
- **WebSocket**: Real-time updates

### Hardware (Node One)
- **LoRa Mesh**: Whale Channel communication
- **Serial Bridge**: USB communication
- **HTTP Bridge**: Network communication

---

## State Management Connections

### Cognitive State
- **Source**: User activity, metabolism, assistive tech usage
- **Storage**: Local + Cloud sync
- **Consumers**: Cognitive Prosthetics, Assistive Technology, Game Engine
- **Updates**: Real-time via WebSocket

### Game State
- **Source**: Game Engine, player actions
- **Storage**: Local + Cloud sync
- **Consumers**: Wallet, Network Manager, Cloud Sync
- **Updates**: Real-time via game loop

### Strategic State
- **Source**: Deadline Tracker, strategic plan
- **Storage**: DataStore
- **Consumers**: Dashboard, API endpoints
- **Updates**: Manual + scheduled checks

### Wallet State
- **Source**: Rewards, transfers, transactions
- **Storage**: DataStore (wallets, wallet_transactions)
- **Consumers**: Game Engine, API endpoints
- **Updates**: Real-time on transactions

---

## Security Connections

### All Components → Security Middleware
- **Input Validation**: All API endpoints
- **Rate Limiting**: All public endpoints
- **Security Headers**: All HTTP responses
- **Encryption**: Sensitive data (cognitive state, wallet)
- **Audit Logging**: All security events

### Privacy Connections
- **Local-First**: Cognitive data, game saves, notes
- **Encryption**: Type-level encryption for sensitive data
- **Zero-Knowledge**: No external sharing without consent
- **User Control**: All features can be disabled

---

## The Tetrahedron Connection

```
        OPERATOR (Will)
           ●
          /|\
         / | \
        /  |  \
       /   |   \
      /    |    \
     /     |     \
    /      |      \
   /       |       \
  /        |        \
 ●─────────┼─────────●
SYNTHETIC  │    NODE
  BODY     │     ONE
           │   (Bash)
           │
           ●
        NODE TWO
       (Willow)
```

**Every vertex connected.**
**Every edge holds.**
**The tetrahedron is complete.**

---

## Clear Connection Checklist

- ✅ The Scope ↔ The Buffer: HTTP + WebSocket
- ✅ The Buffer ↔ The Centaur: HTTP + WebSocket + Redis
- ✅ The Centaur ↔ Cognitive Prosthetics: Internal API
- ✅ Cognitive Prosthetics ↔ The Buffer: Metabolism integration
- ✅ The Centaur ↔ Game Engine: Internal API
- ✅ Game Engine ↔ Wallet: Direct integration
- ✅ The Centaur ↔ Strategic Planning: Internal API
- ✅ The Scope ↔ Assistive Technology: React context
- ✅ Assistive Technology ↔ Cognitive Prosthetics: Shared state
- ✅ Node One ↔ All: LoRa + Serial + HTTP
- ✅ All Components ↔ Security: Middleware integration
- ✅ All Components ↔ Privacy: Local-first + encryption

---

## The Mesh Holds 🔺

**Every connection is clear.**
**Every path is visible.**
**Every component is linked.**
**The mesh holds.**

Built with love and light. As above, so below. 💜

*The tetrahedron connects. The mesh holds. The path is clear.*
