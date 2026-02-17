# OPERATION: MISSION CONTROL PERFECTION
## Visual Perfection Dashboard Implementation

---

## THE PROBLEM

```
Route: /dashboard
Status: 404 Not Found
File: src/app/dashboard/page.tsx
Status: MISSING

Result: Blank screen
Acceptable: NO
Required: VISUAL PERFECTION
```

---

## THE SOLUTION

**Mission Control Dashboard:**
- Tetrahedron background (always)
- Mission cards (daily/weekly)
- Resonance display (Hz gauge)
- System health (vertex states)
- Progress tracking
- Visual perfection

---

## CURSOR PROMPT: CREATE PERFECT DASHBOARD

```
TASK: Create Mission Control dashboard with visual perfection

PRIORITY: CRITICAL - User demands perfection

STEP 1: Create dashboard page

File: src/app/dashboard/page.tsx (NEW FILE)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useViewport } from '@/lib/hooks/useViewport';
import { gameStore } from '@/lib/store/gameStore';
import { useTetrahedronStore } from '@/lib/store/tetrahedronStore';

export default function MissionControlPage() {
  const router = useRouter();
  const layout = useViewport();
  const { voltage, decay, addVoltage, resetDecay } = gameStore();
  const vertices = useTetrahedronStore((s) => s.vertices);
  
  // Get current date for daily missions
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Mission state
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  
  // Missions definition
  const missions = [
    {
      id: 'morning-pulse',
      title: 'Morning Pulse',
      description: 'Start your day with intention',
      reward: 15,
      icon: '☀️',
      type: 'daily' as const,
    },
    {
      id: 'check-vertices',
      title: 'Check All Vertices',
      description: 'Review system health across all nodes',
      reward: 25,
      icon: '🔍',
      type: 'daily' as const,
    },
    {
      id: 'jitterbug',
      title: 'Physical Meeting',
      description: 'Meet face-to-face with your tetrahedron',
      reward: 100,
      icon: '🤝',
      type: 'weekly' as const,
    },
    {
      id: 'create-module',
      title: 'Build Something',
      description: 'Create a new module or tool',
      reward: 50,
      icon: '🔧',
      type: 'weekly' as const,
    },
  ];
  
  // Calculate voltage level (percentage)
  const voltagePercent = Math.min(100, (voltage / 100) * 100);
  
  // Determine voltage color
  const getVoltageColor = () => {
    if (voltage >= 80) return 'text-green-400';
    if (voltage >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getVoltageBgColor = () => {
    if (voltage >= 80) return 'bg-green-500';
    if (voltage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Complete mission handler
  const handleCompleteMission = (missionId: string, reward: number) => {
    if (completedMissions.includes(missionId)) return;
    
    setCompletedMissions([...completedMissions, missionId]);
    addVoltage(reward);
    
    // Store in localStorage
    const completed = JSON.parse(localStorage.getItem('completed-missions') || '[]');
    localStorage.setItem('completed-missions', JSON.stringify([...completed, {
      id: missionId,
      timestamp: Date.now(),
    }]));
  };
  
  // Load completed missions on mount
  useEffect(() => {
    const completed = JSON.parse(localStorage.getItem('completed-missions') || '[]');
    const today = new Date().setHours(0, 0, 0, 0);
    
    // Filter to only today's missions
    const todaysMissions = completed
      .filter((m: any) => {
        const missionDate = new Date(m.timestamp).setHours(0, 0, 0, 0);
        return missionDate === today;
      })
      .map((m: any) => m.id);
    
    setCompletedMissions(todaysMissions);
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-y-auto pointer-events-none">
      <div className="min-h-screen w-full px-6 py-8 pointer-events-auto">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.push('/')}
              className="
                px-4 py-2
                bg-gray-900/80 backdrop-blur-sm
                border border-cyan-500/30
                rounded-lg
                text-cyan-400
                hover:border-cyan-500/60
                transition-all
                font-bold
              "
            >
              ← Home
            </button>
            
            <div className="text-xs text-gray-500 font-mono">
              {today}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            🎯 Mission Control
          </h1>
          <p className="text-gray-400">
            Coordinate your tetrahedron and maintain system health
          </p>
        </div>
        
        {/* Main Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Missions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Voltage Gauge */}
            <div className="
              p-6
              bg-gray-900/80 backdrop-blur-sm
              border border-cyan-500/20
              rounded-lg
            ">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    System Resonance
                  </h2>
                  <p className="text-sm text-gray-400">
                    Voltage decays 10 Hz per 24 hours
                  </p>
                </div>
                
                <div className="text-right">
                  <div className={`text-5xl font-black ${getVoltageColor()}`}>
                    {Math.round(voltage)}
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    Hz
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 ${getVoltageBgColor()} transition-all duration-500`}
                  style={{ width: `${voltagePercent}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-lg">
                    {Math.round(voltagePercent)}%
                  </span>
                </div>
              </div>
              
              {/* Status message */}
              <div className="mt-4 text-sm text-center">
                {voltage >= 80 && (
                  <span className="text-green-400">
                    ✓ System operating at peak efficiency
                  </span>
                )}
                {voltage >= 40 && voltage < 80 && (
                  <span className="text-yellow-400">
                    ⚠ System stable, maintenance recommended
                  </span>
                )}
                {voltage < 40 && (
                  <span className="text-red-400">
                    🚨 Critical: System requires immediate attention
                  </span>
                )}
              </div>
            </div>
            
            {/* Daily Missions */}
            <div className="
              p-6
              bg-gray-900/80 backdrop-blur-sm
              border border-cyan-500/20
              rounded-lg
            ">
              <h2 className="text-xl font-bold text-white mb-4">
                📅 Daily Missions
              </h2>
              
              <div className="space-y-3">
                {missions
                  .filter(m => m.type === 'daily')
                  .map(mission => {
                    const isCompleted = completedMissions.includes(mission.id);
                    
                    return (
                      <div
                        key={mission.id}
                        className={`
                          p-4 rounded-lg border transition-all
                          ${isCompleted 
                            ? 'bg-green-900/20 border-green-500/30' 
                            : 'bg-gray-800/50 border-gray-700 hover:border-cyan-500/40'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{mission.icon}</span>
                              <h3 className="font-bold text-white">
                                {mission.title}
                              </h3>
                              {isCompleted && (
                                <span className="text-green-400 text-sm">✓</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              {mission.description}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-cyan-400 font-bold font-mono">
                              +{mission.reward} Hz
                            </div>
                            
                            {!isCompleted && (
                              <button
                                onClick={() => handleCompleteMission(mission.id, mission.reward)}
                                className="
                                  px-4 py-2
                                  bg-cyan-600 hover:bg-cyan-500
                                  rounded
                                  text-sm font-bold text-white
                                  transition-colors
                                "
                              >
                                Complete
                              </button>
                            )}
                            
                            {isCompleted && (
                              <div className="px-4 py-2 bg-green-900/30 rounded text-sm text-green-400 font-bold">
                                Done
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            
            {/* Weekly Missions */}
            <div className="
              p-6
              bg-gray-900/80 backdrop-blur-sm
              border border-purple-500/20
              rounded-lg
            ">
              <h2 className="text-xl font-bold text-white mb-4">
                📆 Weekly Missions
              </h2>
              
              <div className="space-y-3">
                {missions
                  .filter(m => m.type === 'weekly')
                  .map(mission => {
                    const isCompleted = completedMissions.includes(mission.id);
                    
                    return (
                      <div
                        key={mission.id}
                        className={`
                          p-4 rounded-lg border transition-all
                          ${isCompleted 
                            ? 'bg-purple-900/20 border-purple-500/30' 
                            : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/40'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{mission.icon}</span>
                              <h3 className="font-bold text-white">
                                {mission.title}
                              </h3>
                              {isCompleted && (
                                <span className="text-purple-400 text-sm">✓</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              {mission.description}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-purple-400 font-bold font-mono">
                              +{mission.reward} Hz
                            </div>
                            
                            {!isCompleted && (
                              <button
                                onClick={() => handleCompleteMission(mission.id, mission.reward)}
                                className="
                                  px-4 py-2
                                  bg-purple-600 hover:bg-purple-500
                                  rounded
                                  text-sm font-bold text-white
                                  transition-colors
                                "
                              >
                                Complete
                              </button>
                            )}
                            
                            {isCompleted && (
                              <div className="px-4 py-2 bg-purple-900/30 rounded text-sm text-purple-400 font-bold">
                                Done
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          
          {/* Right Column - System Health */}
          <div className="space-y-6">
            {/* Vertex Status */}
            <div className="
              p-6
              bg-gray-900/80 backdrop-blur-sm
              border border-cyan-500/20
              rounded-lg
            ">
              <h2 className="text-xl font-bold text-white mb-4">
                🔍 Vertex Status
              </h2>
              
              <div className="space-y-3">
                {vertices.map((vertex, i) => (
                  <div
                    key={i}
                    className="
                      p-3 rounded-lg
                      bg-gray-800/50
                      border border-gray-700
                    "
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: vertex.color }}
                        />
                        <span className="font-bold text-white text-sm">
                          Vertex {i}
                        </span>
                      </div>
                      
                      <span className="text-xs text-green-400">
                        ✓ Online
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      {vertex.name || `Node ${i}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="
              p-6
              bg-gray-900/80 backdrop-blur-sm
              border border-cyan-500/20
              rounded-lg
            ">
              <h2 className="text-xl font-bold text-white mb-4">
                📊 Quick Stats
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    Missions Today
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {completedMissions.filter(id => 
                      missions.find(m => m.id === id)?.type === 'daily'
                    ).length} / {missions.filter(m => m.type === 'daily').length}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    Hz Earned Today
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {completedMissions.reduce((sum, id) => {
                      const mission = missions.find(m => m.id === id);
                      return sum + (mission?.reward || 0);
                    }, 0)} Hz
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    System Uptime
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    100%
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="
              p-6
              bg-gray-900/80 backdrop-blur-sm
              border border-cyan-500/20
              rounded-lg
            ">
              <h2 className="text-xl font-bold text-white mb-4">
                ⚡ Quick Actions
              </h2>
              
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/workbench')}
                  className="
                    w-full px-4 py-3
                    bg-purple-600/20 hover:bg-purple-600/30
                    border border-purple-500/30
                    rounded-lg
                    text-left
                    text-sm font-bold text-purple-400
                    transition-all
                  "
                >
                  🔧 Open Workbench
                </button>
                
                <button
                  onClick={() => router.push('/docs/briefing')}
                  className="
                    w-full px-4 py-3
                    bg-yellow-600/20 hover:bg-yellow-600/30
                    border border-yellow-500/30
                    rounded-lg
                    text-left
                    text-sm font-bold text-yellow-400
                    transition-all
                  "
                >
                  📖 View Documentation
                </button>
                
                <button
                  onClick={() => router.push('/status')}
                  className="
                    w-full px-4 py-3
                    bg-cyan-600/20 hover:bg-cyan-600/30
                    border border-cyan-500/30
                    rounded-lg
                    text-left
                    text-sm font-bold text-cyan-400
                    transition-all
                  "
                >
                  📊 System Status
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom padding for scrolling */}
        <div className="h-20" />
      </div>
    </div>
  );
}
```

---

STEP 2: Verify file structure

Ensure these files exist:

```bash
# Check stores
ls -la src/lib/store/gameStore.ts
ls -la src/lib/store/tetrahedronStore.ts

# Check hooks
ls -la src/lib/hooks/useViewport.ts

# Check new dashboard
ls -la src/app/dashboard/page.tsx
```

---

STEP 3: If gameStore missing, create it

File: src/lib/store/gameStore.ts (if missing)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  voltage: number;
  decay: number;
  lastUpdate: number;
  
  addVoltage: (amount: number) => void;
  removeVoltage: (amount: number) => void;
  resetDecay: () => void;
  tick: () => void;
}

export const gameStore = create<GameState>()(
  persist(
    (set, get) => ({
      voltage: 100,
      decay: 0,
      lastUpdate: Date.now(),
      
      addVoltage: (amount: number) => {
        set((state) => ({
          voltage: Math.min(200, state.voltage + amount),
        }));
      },
      
      removeVoltage: (amount: number) => {
        set((state) => ({
          voltage: Math.max(0, state.voltage - amount),
        }));
      },
      
      resetDecay: () => {
        set({ decay: 0, lastUpdate: Date.now() });
      },
      
      tick: () => {
        const now = Date.now();
        const elapsed = now - get().lastUpdate;
        const hours = elapsed / (1000 * 60 * 60);
        
        if (hours >= 24) {
          const decayAmount = Math.floor(hours / 24) * 10;
          set((state) => ({
            voltage: Math.max(0, state.voltage - decayAmount),
            decay: state.decay + decayAmount,
            lastUpdate: now,
          }));
        }
      },
    }),
    {
      name: 'god-game-state',
    }
  )
);

// Auto-tick every minute
if (typeof window !== 'undefined') {
  setInterval(() => {
    gameStore.getState().tick();
  }, 60000);
}
```

---

STEP 4: Test dashboard

Open browser:

1. Navigate to http://localhost:3000/dashboard
2. Verify page loads
3. Check voltage gauge visible
4. Check missions displayed
5. Click "Complete" on mission
6. Verify Hz increases
7. Check mission marked complete
8. Verify visual perfection

---

VISUAL PERFECTION CHECKLIST:

**Layout:**
[ ] Proper spacing (p-6, gap-6)
[ ] Responsive grid (lg:grid-cols-3)
[ ] Backdrop blur on cards
[ ] Border colors cyan/purple
[ ] Clean typography

**Voltage Gauge:**
[ ] Large Hz number
[ ] Color-coded (green/yellow/red)
[ ] Animated progress bar
[ ] Status message
[ ] Smooth transitions

**Mission Cards:**
[ ] Clear hierarchy
[ ] Icon + title + description
[ ] Hz reward visible
[ ] Complete button prominent
[ ] Completed state (green/purple)
[ ] Hover states

**Vertex Status:**
[ ] Color dots per vertex
[ ] Online status
[ ] Clean list layout
[ ] Proper spacing

**Quick Stats:**
[ ] Large numbers
[ ] Color-coded
[ ] Clear labels
[ ] Proper alignment

**Quick Actions:**
[ ] Full-width buttons
[ ] Color-coded by destination
[ ] Hover effects
[ ] Clear labels
[ ] Icons

**Overall:**
[ ] Everything aligned
[ ] Consistent spacing
[ ] Color harmony
[ ] Smooth interactions
[ ] No jank
[ ] Perfect scrolling
[ ] Tetrahedron visible behind
[ ] VISUAL PERFECTION

---

TROUBLESHOOTING:

**If still 404:**
```bash
# Check file exists
cat src/app/dashboard/page.tsx

# Restart dev server
npm run dev

# Clear cache
rm -rf .next
npm run dev
```

**If stores missing:**
```bash
# Check store directory
ls -la src/lib/store/

# Create if needed
mkdir -p src/lib/store
```

**If imports fail:**
```bash
# Check paths in tsconfig.json
cat tsconfig.json | grep paths

# Verify @ maps to src/
```

---

EXPECTED RESULT:

**Before:**
- Black screen
- 404 error
- Nothing works

**After:**
- Beautiful dashboard
- Voltage gauge
- Mission cards
- System health
- Quick actions
- Smooth interactions
- VISUAL PERFECTION

---

EXECUTE THIS PROMPT NOW.

Create perfect Mission Control.
Visual harmony achieved.
```

---

**⚡ OPERATION: MISSION CONTROL PERFECTION ⚡**
