/**
 * Spoon Check-In - Energy level and activities log
 * Sends data to P31 Sync (GAS) via p31.sync.pulse
 */

import { useState } from 'react';
import { p31, P31 } from '@p31/shared';

const ACTIVITIES = ['coding', 'email', 'meetings', 'family_time', 'rest'] as const;

export function SpoonCheckin() {
  const [spoonLevel, setSpoonLevel] = useState(5);
  const [activities, setActivities] = useState<string[]>([]);

  const handleCheckin = async () => {
    await p31.sync.pulse('spoon_checkin', {
      level: spoonLevel,
      activities,
      timestamp: new Date().toISOString(),
    });
    p31.log('s', `Spoon check-in: ${spoonLevel}/10`);
    alert(`Check-in logged: ${spoonLevel} spoons`);
  };

  const toggleActivity = (activity: string) => {
    if (activities.includes(activity)) {
      setActivities(activities.filter((a) => a !== activity));
    } else {
      setActivities([...activities, activity]);
    }
  };

  return (
    <div
      style={{
        background: P31.tokens.void,
        padding: '20px',
        borderRadius: '8px',
        border: `2px solid ${P31.tokens.phosphorus}`,
      }}
    >
      <h3 style={{ color: P31.tokens.phosphorus, marginTop: 0 }}>Energy Level Check-In</h3>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: P31.tokens.slate, display: 'block', marginBottom: 4 }}>
          Spoons remaining (1–10):
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={spoonLevel}
          onChange={(e) => setSpoonLevel(Number(e.target.value))}
          style={{ width: '100%' }}
          aria-label="Spoons remaining 1 to 10"
        />
        <span style={{ color: P31.tokens.calcium, marginLeft: 8 }}>{spoonLevel}/10</span>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: P31.tokens.slate, display: 'block', marginBottom: 8 }}>
          Activities planned:
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ACTIVITIES.map((activity) => (
            <label
              key={activity}
              style={{ color: P31.tokens.slate, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <input
                type="checkbox"
                checked={activities.includes(activity)}
                onChange={() => toggleActivity(activity)}
              />
              {activity}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheckin}
        style={{
          marginTop: 8,
          background: P31.tokens.phosphorus,
          color: P31.tokens.void,
          padding: '10px 20px',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Log Check-In
      </button>
    </div>
  );
}
