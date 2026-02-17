# 🔗 SOVEREIGN SYSTEM CONNECTIONS GUIDE

## Complete Map of How Everything Connects

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SOVEREIGN ECOSYSTEM                                  │
│                                                                             │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │   FRONTEND       │    │   BACKEND        │    │   CLOUD          │      │
│  │   (React)        │◄──►│   (Python)       │◄──►│   (Google)       │      │
│  │   localhost:5173 │    │   localhost:8000 │    │   Apps Script    │      │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘      │
│         │                       │                       │                   │
│         ▼                       ▼                       ▼                   │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │   HARDWARE       │    │   DATABASE       │    │   DRIVE          │      │
│  │   (ESP32)        │    │   (PostgreSQL)   │    │   (3-Zone)       │      │
│  │   Phenix Nav     │    │   localhost:5432 │    │   Folder System  │      │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📍 CONNECTION POINTS

### 1. Dashboard ↔ Genesis Gate (Google Apps Script)

**Hook:** `dashboard/src/hooks/useGenesisGate.js`

```javascript
// Configure the connection
const { setGenesisGateUrl } = useGenesisGate();
setGenesisGateUrl('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec');
```

**Data Flow:**
- `?action=telemetry` → System status, XP, medication alerts
- `?action=neuralMap` → 3-Zone folder structure
- `?action=automaton&cmd=X` → Terminal commands

**Setup:**
1. Open `genesis-gate/GENESIS_GATE_v3.gs` in Google Apps Script
2. Deploy → New deployment → Web app
3. Copy the URL
4. Paste into dashboard settings

---

### 2. Dashboard ↔ Phenix Navigator Hardware

**Hook:** `dashboard/src/hooks/useNavigatorSerial.js`

```javascript
const { connect, sendCommand, isConnected } = useNavigatorSerial();

// Connect to ESP32 via Web Serial API
await connect();

// Send commands
sendCommand('HAPTIC_PULSE');
```

**Capabilities:**
- Haptic feedback patterns
- LED status indicators
- Spoon budget physical display
- Breathing exercise sync

---

### 3. Dashboard ↔ Backend API

**Hook:** `dashboard/src/hooks/useSovereignSync.js`

```javascript
const { syncWithBackend, pushState } = useSovereignSync();

// WebSocket connection
ws://localhost:8000/ws/sovereign
```

**Endpoints:**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/state` | GET | Fetch current state |
| `/api/activity` | POST | Log activity |
| `/api/spoons` | GET/POST | Spoon budget |
| `/ws/sovereign` | WS | Real-time sync |

---

### 4. Backend ↔ Database

**File:** `backend/backend_core.py`

```python
# PostgreSQL connection
DATABASE_URL = "postgresql://postgres:password@localhost:5432/phenix"

# Redis for caching/queue
REDIS_URL = "redis://localhost:6379"
```

**Tables:**
- `activities` - L.O.V.E. ledger entries
- `medications` - Medication tracking
- `spoon_log` - Energy budget history
- `hostile_intercepts` - Cognitive Shield logs

---

### 5. Backend ↔ Ollama (Local AI)

**Models:** `backend/ollama_models/`

```bash
# Install models
ollama create cognitive-shield -f backend/ollama_models/cognitive-shield.modelfile
ollama create truth-anchor -f backend/ollama_models/truth-anchor.modelfile
```

**Usage:**
- Cognitive Shield: Email analysis for hostile patterns
- Truth Anchor: Reality validation, anti-gaslighting
- Somatic Regulator: Nervous system state suggestions

---

### 6. Genesis Gate ↔ Google Drive

**Architecture:**
```
PHENIX_NAVIGATOR_ROOT/
├── ZONE_ALPHA_BACKBONE/      (Blue - Immutable)
│   ├── 00_MASTER_MANIFEST/
│   ├── 01_DOCTRINE_AND_SOPs/
│   └── ...
├── ZONE_BETA_CONTROL_CENTER/ (Red - Active)
│   ├── 10_ACTIVE_CAMPAIGNS/
│   ├── 11_LEGAL_WAR_ROOM/
│   └── ...
└── ZONE_GAMMA_FABRICATION/   (Purple - Creative)
    ├── 20_DEV_WORKSHOP/
    └── ...
```

---

### 7. Genesis Gate ↔ Gmail

**Cognitive Shield Scan:**
```javascript
// Runs every 15 minutes via trigger
function cognitiveShieldScan() {
  // Search for hostile senders
  const threads = GmailApp.search('from:hostile@example.com');
  // Label and intercept
}
```

---

## 🔄 DATA SYNC FLOW

```
User Action
    │
    ▼
Dashboard (React)
    │
    ├─────────────┬─────────────┬─────────────┐
    ▼             ▼             ▼             ▼
Genesis Gate  Backend API   Hardware     Local Storage
(Google)      (Python)      (ESP32)      (Browser)
    │             │             │             │
    ▼             ▼             ▼             ▼
Google Drive  PostgreSQL   BLE/Serial   IndexedDB
```

---

## 🚨 LIVE UPDATES

### Enable Real-Time Sync

**Dashboard side:**
```javascript
// In App.jsx or main component
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8000/ws/sovereign');
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Update local state
    updateFromServer(data);
  };
  return () => ws.close();
}, []);
```

**Backend side:**
```python
# In backend_core.py
@app.websocket("/ws/sovereign")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await get_latest_state()
        await websocket.send_json(data)
        await asyncio.sleep(1)
```

---

## 📊 MONITORING DASHBOARDS

### Grafana (http://localhost:3000)
- System health metrics
- Spoon budget graphs
- Medication countdown
- XP progress charts

### Prometheus (http://localhost:9090)
- Backend metrics
- Database stats
- API latency

---

## 🔐 AUTHENTICATION FLOW

```
1. User opens dashboard
2. Check localStorage for GENESIS_GATE_URL
3. If not set → Demo mode (offline capable)
4. If set → Fetch telemetry from Apps Script
5. Apps Script authenticates via Google OAuth
6. Data flows back to dashboard
```

---

## 🧪 TESTING CONNECTIONS

```bash
# Test backend
curl http://localhost:8000/api/health

# Test Genesis Gate
curl "YOUR_APPS_SCRIPT_URL?action=telemetry"

# Test database
psql -h localhost -U postgres -d phenix -c "SELECT 1"

# Test Redis
redis-cli ping
```

---

## 🆘 TROUBLESHOOTING

### Dashboard won't connect to Genesis Gate
1. Verify Apps Script is deployed as web app
2. Check "Anyone can access" is enabled
3. Try the URL directly in browser
4. Check browser console for CORS errors

### Backend won't start
1. Check PostgreSQL is running: `docker-compose ps`
2. Verify .env has correct DATABASE_URL
3. Run migrations: `python -m alembic upgrade head`

### Hardware not detected
1. Ensure Chrome browser (Web Serial API)
2. Check USB connection
3. Verify ESP32 firmware is flashed
4. Check `navigator.serial` is available

---

## 💜 THE MESH HOLDS

All systems connected. All data flowing. Sovereignty maintained.

🔺
