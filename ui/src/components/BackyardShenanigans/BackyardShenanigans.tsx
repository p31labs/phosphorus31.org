/**
 * Bash's Backyard Shenanigans
 * Interactive backyard play area
 *
 * Built with love and light. As above, so below. 💜
 *
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 */

import React, { useState, useRef, useEffect } from 'react';
import './BackyardShenanigans.css';

type Activity = 'explore' | 'garden' | 'bugs' | 'weather' | 'games' | 'adventure';

interface Bug {
  id: string;
  type: 'ladybug' | 'butterfly' | 'bee' | 'dragonfly' | 'caterpillar';
  x: number;
  y: number;
  direction: number;
  speed: number;
}

export function BackyardShenanigans() {
  const [activeActivity, setActiveActivity] = useState<Activity>('explore');
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [weather, setWeather] = useState<'sunny' | 'rainy' | 'cloudy' | 'windy'>('sunny');
  const [gardenItems, setGardenItems] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // Initialize bugs
  useEffect(() => {
    const initialBugs: Bug[] = [];
    const bugTypes: Bug['type'][] = ['ladybug', 'butterfly', 'bee', 'dragonfly', 'caterpillar'];

    for (let i = 0; i < 8; i++) {
      initialBugs.push({
        id: `bug_${i}`,
        type: bugTypes[Math.floor(Math.random() * bugTypes.length)],
        x: Math.random() * 800,
        y: Math.random() * 600,
        direction: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      });
    }

    setBugs(initialBugs);
  }, []);

  // Animate bugs
  useEffect(() => {
    if (activeActivity !== 'bugs') return;

    const interval = setInterval(() => {
      setBugs((prevBugs) =>
        prevBugs.map((bug) => ({
          ...bug,
          x: (bug.x + Math.cos(bug.direction) * bug.speed + 800) % 800,
          y: (bug.y + Math.sin(bug.direction) * bug.speed + 600) % 600,
          direction: bug.direction + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [activeActivity]);

  const addGardenItem = (item: string) => {
    setGardenItems((prev) => [...prev, item]);
    setScore((prev) => prev + 10);
  };

  const catchBug = (bugId: string) => {
    setBugs((prev) => prev.filter((bug) => bug.id !== bugId));
    setScore((prev) => prev + 5);

    // Add new bug after a delay
    setTimeout(() => {
      const bugTypes: Bug['type'][] = ['ladybug', 'butterfly', 'bee', 'dragonfly', 'caterpillar'];
      setBugs((prev) => [
        ...prev,
        {
          id: `bug_${Date.now()}`,
          type: bugTypes[Math.floor(Math.random() * bugTypes.length)],
          x: Math.random() * 800,
          y: Math.random() * 600,
          direction: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.5,
        },
      ]);
    }, 2000);
  };

  const changeWeather = () => {
    const weathers: (typeof weather)[] = ['sunny', 'rainy', 'cloudy', 'windy'];
    const currentIndex = weathers.indexOf(weather);
    setWeather(weathers[(currentIndex + 1) % weathers.length]);
  };

  const bugEmoji = (type: Bug['type']): string => {
    switch (type) {
      case 'ladybug':
        return '🐞';
      case 'butterfly':
        return '🦋';
      case 'bee':
        return '🐝';
      case 'dragonfly':
        return '🪲';
      case 'caterpillar':
        return '🐛';
      default:
        return '🐛';
    }
  };

  return (
    <div className={`backyard-shenanigans weather-${weather}`}>
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-content">
            <h1>🌳 Bash's Backyard Shenanigans 💜</h1>
            <p className="welcome-subtitle">Explore, play, and discover in the backyard!</p>
            <div className="welcome-message">
              <p>Welcome to the backyard! There's so much to explore:</p>
              <ul>
                <li>🌱 Plant a garden</li>
                <li>🐛 Catch bugs</li>
                <li>🌤️ Change the weather</li>
                <li>🎮 Play games</li>
                <li>🗺️ Go on adventures</li>
              </ul>
            </div>
            <button className="welcome-button" onClick={() => setShowWelcome(false)}>
              Let's Play! 🚀
            </button>
          </div>
        </div>
      )}

      <div className="backyard-header">
        <h1>🌳 Bash's Backyard Shenanigans 💜</h1>
        <div className="score-display">
          <span className="score-label">Score:</span>
          <span className="score-value">{score}</span>
        </div>
      </div>

      <div className="activity-selector">
        <button
          className={`activity-button ${activeActivity === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveActivity('explore')}
        >
          🗺️ Explore
        </button>
        <button
          className={`activity-button ${activeActivity === 'garden' ? 'active' : ''}`}
          onClick={() => setActiveActivity('garden')}
        >
          🌱 Garden
        </button>
        <button
          className={`activity-button ${activeActivity === 'bugs' ? 'active' : ''}`}
          onClick={() => setActiveActivity('bugs')}
        >
          🐛 Bugs
        </button>
        <button
          className={`activity-button ${activeActivity === 'weather' ? 'active' : ''}`}
          onClick={() => setActiveActivity('weather')}
        >
          🌤️ Weather
        </button>
        <button
          className={`activity-button ${activeActivity === 'games' ? 'active' : ''}`}
          onClick={() => setActiveActivity('games')}
        >
          🎮 Games
        </button>
        <button
          className={`activity-button ${activeActivity === 'adventure' ? 'active' : ''}`}
          onClick={() => setActiveActivity('adventure')}
        >
          ⚔️ Adventure
        </button>
      </div>

      <div className="activity-content">
        {activeActivity === 'explore' && (
          <div className="explore-area">
            <h2>🗺️ Explore the Backyard</h2>
            <div className="explore-grid">
              <div className="explore-card" onClick={() => setActiveActivity('garden')}>
                <div className="card-icon">🌱</div>
                <h3>Garden</h3>
                <p>Plant flowers and vegetables</p>
              </div>
              <div className="explore-card" onClick={() => setActiveActivity('bugs')}>
                <div className="card-icon">🐛</div>
                <h3>Bug Collection</h3>
                <p>Catch and learn about bugs</p>
              </div>
              <div className="explore-card" onClick={() => setActiveActivity('weather')}>
                <div className="card-icon">🌤️</div>
                <h3>Weather Station</h3>
                <p>Change the weather</p>
              </div>
              <div className="explore-card" onClick={() => setActiveActivity('games')}>
                <div className="card-icon">🎮</div>
                <h3>Games</h3>
                <p>Play fun backyard games</p>
              </div>
              <div className="explore-card" onClick={() => setActiveActivity('adventure')}>
                <div className="card-icon">⚔️</div>
                <h3>Adventure</h3>
                <p>Go on backyard adventures</p>
              </div>
            </div>
          </div>
        )}

        {activeActivity === 'garden' && (
          <div className="garden-area">
            <h2>🌱 Garden</h2>
            <div className="garden-tools">
              <button className="garden-button" onClick={() => addGardenItem('🌻 Sunflower')}>
                Plant 🌻 Sunflower
              </button>
              <button className="garden-button" onClick={() => addGardenItem('🌷 Tulip')}>
                Plant 🌷 Tulip
              </button>
              <button className="garden-button" onClick={() => addGardenItem('🌹 Rose')}>
                Plant 🌹 Rose
              </button>
              <button className="garden-button" onClick={() => addGardenItem('🥕 Carrot')}>
                Plant 🥕 Carrot
              </button>
              <button className="garden-button" onClick={() => addGardenItem('🍅 Tomato')}>
                Plant 🍅 Tomato
              </button>
              <button className="garden-button" onClick={() => addGardenItem('🌿 Herb')}>
                Plant 🌿 Herb
              </button>
            </div>
            <div className="garden-display">
              <h3>Your Garden ({gardenItems.length} items)</h3>
              <div className="garden-items">
                {gardenItems.length === 0 ? (
                  <p className="empty-garden">Your garden is empty. Plant something!</p>
                ) : (
                  gardenItems.map((item, index) => (
                    <div key={index} className="garden-item">
                      {item}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeActivity === 'bugs' && (
          <div className="bugs-area">
            <h2>🐛 Bug Collection</h2>
            <p>Click on bugs to catch them! They'll come back after a moment.</p>
            <div className="bug-canvas-container">
              <div className="bug-field">
                {bugs.map((bug) => (
                  <button
                    key={bug.id}
                    className="bug-button"
                    style={{
                      left: `${bug.x}px`,
                      top: `${bug.y}px`,
                    }}
                    onClick={() => catchBug(bug.id)}
                    aria-label={`Catch ${bug.type}`}
                  >
                    {bugEmoji(bug.type)}
                  </button>
                ))}
              </div>
            </div>
            <div className="bug-stats">
              <p>Bugs in the yard: {bugs.length}</p>
              <p>Bugs caught: {Math.floor(score / 5)}</p>
            </div>
          </div>
        )}

        {activeActivity === 'weather' && (
          <div className="weather-area">
            <h2>🌤️ Weather Station</h2>
            <div className="weather-display">
              <div className={`weather-icon weather-${weather}`}>
                {weather === 'sunny' && '☀️'}
                {weather === 'rainy' && '🌧️'}
                {weather === 'cloudy' && '☁️'}
                {weather === 'windy' && '💨'}
              </div>
              <h3 className="weather-name">
                {weather === 'sunny' && 'Sunny Day'}
                {weather === 'rainy' && 'Rainy Day'}
                {weather === 'cloudy' && 'Cloudy Day'}
                {weather === 'windy' && 'Windy Day'}
              </h3>
              <button className="weather-button" onClick={changeWeather}>
                Change Weather
              </button>
            </div>
            <div className="weather-info">
              <p>
                {weather === 'sunny' &&
                  'Perfect day for playing outside! The sun is shining bright.'}
                {weather === 'rainy' &&
                  'Time to splash in puddles! The rain makes everything grow.'}
                {weather === 'cloudy' && 'Nice and cool! Great weather for exploring.'}
                {weather === 'windy' && 'Feel the breeze! Perfect for flying kites.'}
              </p>
            </div>
          </div>
        )}

        {activeActivity === 'games' && (
          <div className="games-area">
            <h2>🎮 Backyard Games</h2>
            <div className="games-grid">
              <div className="game-card">
                <h3>🏃 Tag</h3>
                <p>Run around and play tag!</p>
                <button className="game-button">Play Tag</button>
              </div>
              <div className="game-card">
                <h3>🎯 Target Practice</h3>
                <p>Throw balls at targets</p>
                <button className="game-button">Start Game</button>
              </div>
              <div className="game-card">
                <h3>🔍 Scavenger Hunt</h3>
                <p>Find hidden items in the backyard</p>
                <button className="game-button">Start Hunt</button>
              </div>
              <div className="game-card">
                <h3>🏃‍♂️ Obstacle Course</h3>
                <p>Navigate through obstacles</p>
                <button className="game-button">Start Course</button>
              </div>
            </div>
          </div>
        )}

        {activeActivity === 'adventure' && (
          <div className="adventure-area">
            <h2>⚔️ Backyard Adventure</h2>
            <div className="adventure-story">
              <p>You're exploring the backyard when you discover...</p>
              <div className="adventure-choices">
                <button className="adventure-button">🌳 A mysterious tree</button>
                <button className="adventure-button">🕳️ A secret tunnel</button>
                <button className="adventure-button">🏰 A hidden fort</button>
                <button className="adventure-button">🗝️ A treasure chest</button>
              </div>
            </div>
            <div className="adventure-progress">
              <h3>Adventure Progress</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '45%' }}></div>
              </div>
              <p>Keep exploring to unlock new adventures!</p>
            </div>
          </div>
        )}
      </div>

      <div className="backyard-footer">
        <p>💜 With love and light. As above, so below. 💜</p>
        <p>Built for Bash with love. The Mesh Holds. 🔺</p>
      </div>
    </div>
  );
}

export default BackyardShenanigans;
