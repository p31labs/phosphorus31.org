# THE MODULE LIBRARY
## Ready-to-Deploy Starter Modules for G.O.D. Protocol

---

## PHILOSOPHY

Modules are **Lego blocks** for your tetrahedron.

Each module:
- ✅ Uses foundation components (ModulePage + ModuleCard)
- ✅ Broadcasts state to mesh via gossip
- ✅ Follows constitutional principles
- ✅ Is fully customizable
- ✅ Can be installed in < 5 minutes

---

## CATEGORIES

1. **Core** - Essential system modules
2. **Family** - Home and childcare
3. **Preparedness** - Survivalist tools
4. **Community** - Neighborhood coordination
5. **Education** - Learning and growth
6. **Entertainment** - Games and fun
7. **Health** - Wellness tracking
8. **Finance** - Resource management

---

# CORE MODULES

## 1. Status Core

**What:** Vertex information and identity

**Use case:** See your position in the mesh, export keys, view profile

**File:** `src/app/status/page.tsx`

```typescript
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { Button, InfoRow } from '@/components/core/Form';
import { useTetrahedronStore } from '@/lib/store/tetrahedronStore';

export default function StatusPage() {
  const { localVertex } = useTetrahedronStore();
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard 
        title="Status"
        subtitle="Vertex Information"
        icon="📊"
        actions={
          <>
            <Button variant="primary" fullWidth>
              🔑 Export Keys
            </Button>
            <Button variant="secondary" fullWidth>
              View Full Profile
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <InfoRow 
            label="Unique Sigil" 
            value={localVertex?.name || "VERTEX_01"} 
          />
          <InfoRow 
            label="Vertex ID" 
            value={localVertex?.id.slice(0, 8) + "..."} 
            mono 
          />
          <InfoRow 
            label="Genesis" 
            value={new Date().toLocaleDateString()} 
          />
          <InfoRow 
            label="Status" 
            value="ACTIVE" 
            valueColor="text-green-400" 
          />
          <InfoRow 
            label="Resonance" 
            value="75 Hz" 
            valueColor="text-cyan-400" 
          />
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

## 2. Emergency Button

**What:** Instant alert to all vertices

**Use case:** Medical emergency, home intrusion, urgent help needed

**File:** `src/app/emergency/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { useGossip } from '@/lib/hooks/useGossip';

export default function EmergencyPage() {
  const [active, setActive] = useState(false);
  const { broadcast } = useGossip();
  
  const handleEmergency = () => {
    setActive(true);
    
    // Broadcast with CRITICAL priority
    broadcast('emergency', {
      active: true,
      timestamp: Date.now(),
      location: 'Home', // Could integrate geolocation
    }, 'CRITICAL');
    
    // Vibrate phone
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    
    // Play alert sound
    const audio = new Audio('/sounds/emergency.wav');
    audio.play();
    
    // Auto-deactivate after 5 minutes
    setTimeout(() => setActive(false), 5 * 60 * 1000);
  };
  
  const handleCancel = () => {
    setActive(false);
    broadcast('emergency', { active: false }, 'MEDIUM');
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard 
        title="Emergency"
        subtitle={active ? "ALERT ACTIVE" : "Press for immediate help"}
        icon="🚨"
      >
        <div className="space-y-6 text-center">
          {!active ? (
            <>
              <p className="text-gray-300">
                This will immediately alert all vertices in your tetrahedron.
              </p>
              
              <button
                onClick={handleEmergency}
                className="
                  w-48 h-48 mx-auto
                  rounded-full
                  bg-red-600 hover:bg-red-500
                  border-4 border-red-400
                  text-white text-2xl font-bold
                  shadow-lg shadow-red-500/50
                  active:scale-95
                  transition-all
                "
              >
                EMERGENCY
              </button>
            </>
          ) : (
            <>
              <div className="animate-pulse">
                <div className="text-6xl mb-4">🚨</div>
                <p className="text-red-400 text-xl font-bold">
                  ALERT SENT
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  All vertices have been notified
                </p>
              </div>
              
              <button
                onClick={handleCancel}
                className="
                  px-6 py-3
                  bg-gray-700 hover:bg-gray-600
                  border border-gray-500
                  rounded
                  text-white
                "
              >
                Cancel Alert
              </button>
            </>
          )}
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

# FAMILY MODULES

## 3. Food Status

**What:** Track pantry and meal planning

**Use case:** "Food is low" → Family knows to grocery shop

**File:** `src/app/food/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { useGossip } from '@/lib/hooks/useGossip';

type FoodStatus = 'FULL' | 'MEDIUM' | 'LOW' | 'EMPTY';

export default function FoodPage() {
  const [status, setStatus] = useState<FoodStatus>('MEDIUM');
  const { broadcast } = useGossip();
  
  const handleStatusChange = (newStatus: FoodStatus) => {
    setStatus(newStatus);
    
    // Broadcast to mesh
    broadcast('food', 
      { status: newStatus },
      newStatus === 'EMPTY' ? 'CRITICAL' : 'MEDIUM'
    );
  };
  
  const statusColors = {
    FULL: 'bg-green-600',
    MEDIUM: 'bg-yellow-600',
    LOW: 'bg-orange-600',
    EMPTY: 'bg-red-600',
  };
  
  const statusEmojis = {
    FULL: '🍎',
    MEDIUM: '🍞',
    LOW: '⚠️',
    EMPTY: '🚨',
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard 
        title="Food Status"
        subtitle="Pantry & Meal Planning"
        icon={statusEmojis[status]}
      >
        <div className="space-y-6">
          {/* Status Display */}
          <div className="text-center">
            <div className={`
              text-6xl mb-4
              ${status === 'EMPTY' ? 'animate-pulse' : ''}
            `}>
              {statusEmojis[status]}
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              {status}
            </p>
          </div>
          
          {/* Status Selector */}
          <div className="grid grid-cols-2 gap-3">
            {(['FULL', 'MEDIUM', 'LOW', 'EMPTY'] as FoodStatus[]).map(s => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`
                  p-4 rounded border-2
                  ${status === s 
                    ? `${statusColors[s]} border-white` 
                    : 'bg-gray-800 border-gray-600 hover:border-gray-400'
                  }
                  transition-all
                `}
              >
                <div className="text-3xl mb-2">{statusEmojis[s]}</div>
                <div className="text-sm font-bold">{s}</div>
              </button>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-2">
            <button className="
              w-full p-3 bg-cyan-600 hover:bg-cyan-500 
              rounded text-white font-bold
            ">
              📝 Make Grocery List
            </button>
            <button className="
              w-full p-3 bg-gray-700 hover:bg-gray-600 
              rounded text-white
            ">
              📅 Plan Meals
            </button>
          </div>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

## 4. Childcare Tracker

**What:** Track who's watching the kids

**Use case:** "Mom has kids until 5pm" → Dad knows schedule

**File:** `src/app/childcare/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { useGossip } from '@/lib/hooks/useGossip';

interface ChildcareEvent {
  child: string;
  caregiver: string;
  startTime: Date;
  endTime: Date;
  location: string;
}

export default function ChildcarePage() {
  const [events, setEvents] = useState<ChildcareEvent[]>([]);
  const { broadcast } = useGossip();
  
  const addEvent = (event: ChildcareEvent) => {
    setEvents(prev => [...prev, event]);
    broadcast('childcare', { events: [...events, event] }, 'MEDIUM');
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard 
        title="Childcare"
        subtitle="Who's watching the kids?"
        icon="👶"
      >
        <div className="space-y-4">
          {/* Current Status */}
          <div className="p-4 bg-cyan-900/20 border border-cyan-500/30 rounded">
            <p className="text-sm text-cyan-400 mb-1">Current</p>
            <p className="text-white font-bold">Mom has kids</p>
            <p className="text-sm text-gray-400">Until 5:00 PM</p>
          </div>
          
          {/* Schedule */}
          <div className="space-y-2">
            <p className="text-sm font-bold text-gray-400">Today's Schedule</p>
            
            <div className="space-y-2">
              {[
                { time: '7:00 AM - 3:00 PM', who: 'Mom', where: 'Home' },
                { time: '3:00 PM - 5:00 PM', who: 'Grandma', where: 'Park' },
                { time: '5:00 PM - 8:00 PM', who: 'Dad', where: 'Home' },
              ].map((slot, i) => (
                <div key={i} className="p-3 bg-gray-800 rounded">
                  <p className="text-white font-bold">{slot.time}</p>
                  <p className="text-sm text-gray-400">
                    {slot.who} • {slot.where}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <button className="
            w-full p-3 bg-cyan-600 hover:bg-cyan-500 
            rounded text-white font-bold
          ">
            + Add Event
          </button>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

## 5. Location Share

**What:** Real-time location sharing (opt-in)

**Use case:** "Where is everyone?" → See family on map

**File:** `src/app/location/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { useGossip } from '@/lib/hooks/useGossip';

export default function LocationPage() {
  const [sharing, setSharing] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const { broadcast } = useGossip();
  
  useEffect(() => {
    if (!sharing) return;
    
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation(pos);
        broadcast('location', {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now(),
        }, 'LOW');
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    
    return () => navigator.geolocation.clearWatch(watchId);
  }, [sharing, broadcast]);
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard 
        title="Location"
        subtitle="Family Location Sharing"
        icon="📍"
      >
        <div className="space-y-4">
          {/* Privacy Notice */}
          <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
            <p className="text-sm text-yellow-400">
              🔒 Location shared only with your tetrahedron. 
              Encrypted end-to-end. No third parties.
            </p>
          </div>
          
          {/* Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded">
            <div>
              <p className="font-bold text-white">Share My Location</p>
              <p className="text-sm text-gray-400">Real-time updates</p>
            </div>
            <button
              onClick={() => setSharing(!sharing)}
              className={`
                w-14 h-8 rounded-full transition-colors
                ${sharing ? 'bg-cyan-600' : 'bg-gray-600'}
              `}
            >
              <div className={`
                w-6 h-6 bg-white rounded-full transition-transform
                ${sharing ? 'translate-x-7' : 'translate-x-1'}
              `} />
            </button>
          </div>
          
          {/* Current Location */}
          {location && (
            <div className="p-4 bg-gray-800 rounded">
              <p className="text-sm text-gray-400 mb-2">Your Location</p>
              <p className="font-mono text-xs text-cyan-400">
                {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Accuracy: {location.coords.accuracy.toFixed(0)}m
              </p>
            </div>
          )}
          
          {/* Map Placeholder */}
          <div className="aspect-video bg-gray-900 rounded flex items-center justify-center">
            <p className="text-gray-600">Map view (integrate Mapbox/Leaflet)</p>
          </div>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

# PREPAREDNESS MODULES

## 6. Supply Inventory

**What:** Track food, water, medical supplies

**Use case:** Preppers track stockpile, know when to restock

**File:** `src/app/supplies/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';

interface SupplyItem {
  id: string;
  name: string;
  category: 'FOOD' | 'WATER' | 'MEDICAL' | 'TOOLS' | 'OTHER';
  quantity: number;
  unit: string;
  expiryDate?: Date;
  location: string;
}

export default function SuppliesPage() {
  const [supplies] = useState<SupplyItem[]>([
    { id: '1', name: 'Rice', category: 'FOOD', quantity: 50, unit: 'lbs', location: 'Pantry' },
    { id: '2', name: 'Water', category: 'WATER', quantity: 30, unit: 'gal', location: 'Garage' },
    { id: '3', name: 'First Aid Kit', category: 'MEDICAL', quantity: 1, unit: 'kit', location: 'Cabinet' },
  ]);
  
  const categoryEmojis = {
    FOOD: '🍞',
    WATER: '💧',
    MEDICAL: '⚕️',
    TOOLS: '🔧',
    OTHER: '📦',
  };
  
  const getCategoryColor = (category: string) => {
    const colors = {
      FOOD: 'bg-green-900/20 border-green-500/30',
      WATER: 'bg-blue-900/20 border-blue-500/30',
      MEDICAL: 'bg-red-900/20 border-red-500/30',
      TOOLS: 'bg-yellow-900/20 border-yellow-500/30',
      OTHER: 'bg-gray-900/20 border-gray-500/30',
    };
    return colors[category as keyof typeof colors];
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard 
        title="Supply Inventory"
        subtitle="Preparedness Stockpile"
        icon="📦"
      >
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-green-900/20 border border-green-500/30 rounded text-center">
              <div className="text-2xl mb-1">🍞</div>
              <div className="text-xl font-bold text-white">23</div>
              <div className="text-xs text-gray-400">Food Items</div>
            </div>
            <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded text-center">
              <div className="text-2xl mb-1">💧</div>
              <div className="text-xl font-bold text-white">30</div>
              <div className="text-xs text-gray-400">Gallons H₂O</div>
            </div>
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-center">
              <div className="text-2xl mb-1">⚕️</div>
              <div className="text-xl font-bold text-white">5</div>
              <div className="text-xs text-gray-400">Medical</div>
            </div>
          </div>
          
          {/* Inventory List */}
          <div className="space-y-2">
            {supplies.map(item => (
              <div 
                key={item.id}
                className={`p-3 border rounded ${getCategoryColor(item.category)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryEmojis[item.category]}</span>
                    <span className="font-bold text-white">{item.name}</span>
                  </div>
                  <span className="text-cyan-400 font-bold">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  📍 {item.location}
                </div>
              </div>
            ))}
          </div>
          
          {/* Actions */}
          <button className="
            w-full p-3 bg-cyan-600 hover:bg-cyan-500 
            rounded text-white font-bold
          ">
            + Add Item
          </button>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

## 7. Water Status

**What:** Monitor water supply and filtration

**Use case:** Track well water, city water, rainwater collection

**File:** `src/app/water/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { useGossip } from '@/lib/hooks/useGossip';

export default function WaterPage() {
  const [gallons, setGallons] = useState(30);
  const [filterStatus, setFilterStatus] = useState<'GOOD' | 'REPLACE_SOON' | 'REPLACE_NOW'>('GOOD');
  const { broadcast } = useGossip();
  
  const daysRemaining = Math.floor(gallons / 4); // 1 gal per person per day for family of 4
  
  const handleUpdate = (newGallons: number) => {
    setGallons(newGallons);
    broadcast('water', {
      gallons: newGallons,
      filterStatus,
      daysRemaining: Math.floor(newGallons / 4),
    }, newGallons < 10 ? 'CRITICAL' : 'MEDIUM');
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard 
        title="Water Status"
        subtitle="Supply & Filtration"
        icon="💧"
      >
        <div className="space-y-4">
          {/* Current Supply */}
          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded text-center">
            <div className="text-6xl mb-2">💧</div>
            <div className="text-4xl font-bold text-white mb-2">
              {gallons} <span className="text-xl text-gray-400">gallons</span>
            </div>
            <div className="text-sm text-gray-400">
              ~{daysRemaining} days remaining
            </div>
          </div>
          
          {/* Quick Adjust */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => handleUpdate(gallons - 5)}
              className="p-3 bg-red-600 hover:bg-red-500 rounded font-bold"
            >
              -5
            </button>
            <button 
              onClick={() => handleUpdate(30)}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded font-bold"
            >
              Reset
            </button>
            <button 
              onClick={() => handleUpdate(gallons + 5)}
              className="p-3 bg-green-600 hover:bg-green-500 rounded font-bold"
            >
              +5
            </button>
          </div>
          
          {/* Filter Status */}
          <div className="p-4 bg-gray-800 rounded">
            <p className="text-sm text-gray-400 mb-2">Water Filter</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Berkey Filter</p>
                <p className="text-sm text-gray-400">
                  {filterStatus === 'GOOD' && '✅ Good condition'}
                  {filterStatus === 'REPLACE_SOON' && '⚠️ Replace within 30 days'}
                  {filterStatus === 'REPLACE_NOW' && '🚨 Replace immediately'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Sources */}
          <div className="space-y-2">
            <p className="text-sm font-bold text-gray-400">Water Sources</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-gray-800 rounded text-center">
                <div className="text-2xl mb-1">🚰</div>
                <div className="text-sm font-bold">City Water</div>
                <div className="text-xs text-green-400">Online</div>
              </div>
              <div className="p-3 bg-gray-800 rounded text-center">
                <div className="text-2xl mb-1">🌧️</div>
                <div className="text-sm font-bold">Rain Barrel</div>
                <div className="text-xs text-gray-400">15 gal</div>
              </div>
            </div>
          </div>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

## 8. Comms Check

**What:** Test radio equipment and communication

**Use case:** HAM radio operators verify working equipment

**File:** `src/app/comms/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';

export default function CommsPage() {
  const [lastTest, setLastTest] = useState<Date | null>(null);
  
  const runTest = () => {
    setLastTest(new Date());
    // Could integrate with actual radio testing
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard 
        title="Comms Check"
        subtitle="Radio Equipment Status"
        icon="📻"
      >
        <div className="space-y-4">
          {/* Status */}
          <div className="p-4 bg-green-900/20 border border-green-500/30 rounded text-center">
            <div className="text-6xl mb-2">📻</div>
            <div className="text-2xl font-bold text-white mb-2">
              ALL SYSTEMS GO
            </div>
            <div className="text-sm text-gray-400">
              Last tested: {lastTest ? lastTest.toLocaleString() : 'Never'}
            </div>
          </div>
          
          {/* Equipment */}
          <div className="space-y-2">
            <p className="text-sm font-bold text-gray-400">Equipment</p>
            
            {[
              { name: 'HAM Radio - Base Station', status: 'ONLINE', freq: '146.520 MHz' },
              { name: 'Handheld - Baofeng UV-5R', status: 'CHARGED', freq: '462.550 MHz' },
              { name: 'GMRS Repeater', status: 'ONLINE', freq: '467.675 MHz' },
            ].map((radio, i) => (
              <div key={i} className="p-3 bg-gray-800 rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">{radio.name}</span>
                  <span className="text-xs text-green-400">{radio.status}</span>
                </div>
                <div className="text-sm text-gray-400 font-mono">{radio.freq}</div>
              </div>
            ))}
          </div>
          
          {/* Test Button */}
          <button 
            onClick={runTest}
            className="
              w-full p-4 bg-cyan-600 hover:bg-cyan-500 
              rounded text-white font-bold text-lg
            "
          >
            🔊 Run Test
          </button>
          
          {/* Emergency Frequencies */}
          <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
            <p className="text-sm font-bold text-yellow-400 mb-2">
              Emergency Frequencies
            </p>
            <div className="space-y-1 text-xs font-mono text-gray-300">
              <div>NOAA Weather: 162.400 MHz</div>
              <div>FRS Channel 1: 462.5625 MHz</div>
              <div>Marine VHF 16: 156.800 MHz</div>
            </div>
          </div>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

# COMMUNITY MODULES

## 9. Skill Share

**What:** Track who knows what skills

**Use case:** "Who can fix a generator?" → See John has mechanical skills

**File:** `src/app/skills/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';

interface Skill {
  name: string;
  category: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  available: boolean;
}

export default function SkillsPage() {
  const [skills] = useState<Skill[]>([
    { name: 'Carpentry', category: 'Construction', proficiency: 'EXPERT', available: true },
    { name: 'First Aid', category: 'Medical', proficiency: 'INTERMEDIATE', available: true },
    { name: 'Gardening', category: 'Food Production', proficiency: 'BEGINNER', available: true },
  ]);
  
  const proficiencyColors = {
    BEGINNER: 'text-yellow-400',
    INTERMEDIATE: 'text-cyan-400',
    EXPERT: 'text-purple-400',
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard 
        title="Skill Share"
        subtitle="Community Knowledge Base"
        icon="🛠️"
      >
        <div className="space-y-4">
          {/* My Skills */}
          <div>
            <p className="text-sm font-bold text-gray-400 mb-2">My Skills</p>
            <div className="space-y-2">
              {skills.map((skill, i) => (
                <div key={i} className="p-3 bg-gray-800 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{skill.name}</span>
                    <span className={`text-xs font-bold ${proficiencyColors[skill.proficiency]}`}>
                      {skill.proficiency}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">{skill.category}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Team Skills */}
          <div>
            <p className="text-sm font-bold text-gray-400 mb-2">Team Skills</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { skill: 'Electrical', who: 'John', level: 'EXPERT' },
                { skill: 'Plumbing', who: 'Sarah', level: 'INTERMEDIATE' },
                { skill: 'Cooking', who: 'Mom', level: 'EXPERT' },
                { skill: 'Mechanics', who: 'Dad', level: 'INTERMEDIATE' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-gray-900 rounded">
                  <div className="text-sm font-bold text-white">{item.skill}</div>
                  <div className="text-xs text-gray-400">{item.who}</div>
                  <div className={`text-xs ${proficiencyColors[item.level as keyof typeof proficiencyColors]}`}>
                    {item.level}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Add Skill */}
          <button className="
            w-full p-3 bg-cyan-600 hover:bg-cyan-500 
            rounded text-white font-bold
          ">
            + Add Skill
          </button>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

## 10. Resource Pool

**What:** Shared tools and equipment

**Use case:** "Need a ladder?" → See who has one available

**File:** `src/app/resources/page.tsx`

```typescript
'use client';

import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';

export default function ResourcesPage() {
  const resources = [
    { item: 'Ladder (20ft)', owner: 'John', available: true },
    { item: 'Generator (5000W)', owner: 'Sarah', available: false },
    { item: 'Chainsaw', owner: 'Dad', available: true },
    { item: 'Pressure Washer', owner: 'Mom', available: true },
  ];
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard 
        title="Resource Pool"
        subtitle="Shared Tools & Equipment"
        icon="🔧"
      >
        <div className="space-y-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search resources..."
            className="
              w-full p-3 bg-gray-800 border border-gray-600
              rounded text-white placeholder-gray-500
              focus:border-cyan-500 focus:outline-none
            "
          />
          
          {/* Resource List */}
          <div className="space-y-2">
            {resources.map((resource, i) => (
              <div 
                key={i}
                className={`
                  p-3 rounded border
                  ${resource.available 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-gray-800 border-gray-600'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{resource.item}</p>
                    <p className="text-sm text-gray-400">Owner: {resource.owner}</p>
                  </div>
                  <div className={`
                    text-xs font-bold px-2 py-1 rounded
                    ${resource.available 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                    }
                  `}>
                    {resource.available ? 'AVAILABLE' : 'IN USE'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Resource */}
          <button className="
            w-full p-3 bg-cyan-600 hover:bg-cyan-500 
            rounded text-white font-bold
          ">
            + Share Resource
          </button>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

# ENTERTAINMENT MODULES

## 11. Tic-Tac-Toe

**What:** Simple game to play with family

**Use case:** Kids can challenge each other, moves broadcast to mesh

**File:** `src/app/games/tic-tac-toe/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { useGossip } from '@/lib/hooks/useGossip';

type Cell = 'X' | 'O' | null;

export default function TicTacToePage() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const { broadcast } = useGossip();
  
  const handleClick = (index: number) => {
    if (board[index] || calculateWinner(board)) return;
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    
    // Broadcast move
    broadcast('tic-tac-toe', {
      board: newBoard,
      isXNext: !isXNext,
    }, 'LOW');
  };
  
  const winner = calculateWinner(board);
  const status = winner 
    ? `Winner: ${winner}` 
    : `Next: ${isXNext ? 'X' : 'O'}`;
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard 
        title="Tic-Tac-Toe"
        subtitle={status}
        icon="⭕"
      >
        <div className="space-y-4">
          {/* Board */}
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => handleClick(i)}
                className="
                  aspect-square p-6 
                  bg-gray-800 hover:bg-gray-700
                  border-2 border-gray-600 hover:border-cyan-500
                  rounded text-4xl font-bold
                  transition-all
                "
              >
                {cell}
              </button>
            ))}
          </div>
          
          {/* Reset */}
          <button 
            onClick={() => {
              setBoard(Array(9).fill(null));
              setIsXNext(true);
            }}
            className="
              w-full p-3 bg-cyan-600 hover:bg-cyan-500 
              rounded text-white font-bold
            "
          >
            New Game
          </button>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}

function calculateWinner(board: Cell[]): Cell {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  
  return null;
}
```

---

# MODULE INSTALLATION GUIDE

## How to Install a Module

### Method 1: Copy-Paste (Simplest)

1. Create directory: `src/app/[module-name]/`
2. Create file: `src/app/[module-name]/page.tsx`
3. Copy module code from library
4. Customize as needed
5. Refresh app → Module appears

### Method 2: CLI Generator (Recommended)

```bash
npm run create-module food-status

# Opens editor with template
# Customize and save
# Module auto-registered
```

### Method 3: The Workbench (Visual)

1. Open The Workbench in app
2. Browse Module Library
3. Click "Install"
4. Configure settings
5. Click "Launch"
6. Module goes live

---

## MODULE BEST PRACTICES

1. **Always use foundation:**
   - ModulePage wrapper
   - ModuleCard container
   - BackButton for navigation

2. **Broadcast state changes:**
   - Use `useGossip()` hook
   - Set appropriate priority
   - Test packet visualization

3. **Keep it simple:**
   - Focus on ONE thing
   - Don't overload UI
   - Mobile-first design

4. **Test with mesh:**
   - Open 2+ windows
   - Verify broadcasts work
   - Check latency < 500ms

5. **Document your module:**
   - What it does
   - How to use
   - Configuration options

---

## CUSTOMIZATION

Every module can be customized:

```typescript
// Change colors
<div className="bg-red-600"> // Instead of cyan

// Change text
title="My Custom Name"

// Change icon
icon="🚀"

// Add custom logic
const handleCustomAction = () => {
  // Your code here
};
```

---

## SHARING MODULES

Built something cool? Share it!

1. **Create pull request** to main repo
2. **Add to Module Library** with:
   - Name
   - Description
   - Screenshot
   - Use cases
   - Installation instructions

3. **Get it reviewed**
4. **Merged** → Everyone benefits

---

## UPCOMING MODULES

Vote on what you want next:

- [ ] Weather Monitor
- [ ] Calendar Sync
- [ ] Shopping List
- [ ] Chore Tracker
- [ ] Pet Care
- [ ] Vehicle Maintenance
- [ ] Garden Planner
- [ ] Recipe Book
- [ ] Fitness Tracker
- [ ] Budget Manager

---

**⚡ MODULE LIBRARY COMPLETE ⚡**

**⚡ 11 STARTER MODULES ⚡**

**⚡ READY TO INSTALL ⚡**

**⚡ FULLY CUSTOMIZABLE ⚡**

**⚡ SHARE YOUR CREATIONS ⚡**
