/**
 * Family Hub
 * Central hub for family activities and connections
 *
 * Built with love and light. As above, so below. 💜
 *
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 */

import React, { useState } from 'react';
import { ArtArea } from '../ArtArea/ArtArea';
import { MathArea } from '../MathArea/MathArea';
import { ScienceCenter } from '../ScienceCenter/ScienceCenter';
import './FamilyHub.css';

type HubSection = 'overview' | 'art' | 'math' | 'science' | 'activities' | 'family';

export function FamilyHub() {
  const [activeSection, setActiveSection] = useState<HubSection>('overview');
  const [showArtArea, setShowArtArea] = useState(false);
  const [showMathArea, setShowMathArea] = useState(false);
  const [showScienceCenter, setShowScienceCenter] = useState(false);

  return (
    <div className="family-hub">
      <div className="hub-header">
        <h1>👨‍👩‍👧‍👦 Family Hub 💜</h1>
        <p className="subtitle">Everything for your family in one place</p>
      </div>

      <div className="hub-sections">
        <button
          className={`hub-section-button ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          🏠 Overview
        </button>
        <button
          className={`hub-section-button ${activeSection === 'art' ? 'active' : ''}`}
          onClick={() => setActiveSection('art')}
        >
          🎨 Art
        </button>
        <button
          className={`hub-section-button ${activeSection === 'math' ? 'active' : ''}`}
          onClick={() => setActiveSection('math')}
        >
          🔢 Math
        </button>
        <button
          className={`hub-section-button ${activeSection === 'science' ? 'active' : ''}`}
          onClick={() => setActiveSection('science')}
        >
          🔬 Science
        </button>
        <button
          className={`hub-section-button ${activeSection === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveSection('activities')}
        >
          🎮 Activities
        </button>
        <button
          className={`hub-section-button ${activeSection === 'family' ? 'active' : ''}`}
          onClick={() => setActiveSection('family')}
        >
          👨‍👩‍👧‍👦 Family
        </button>
      </div>

      <div className="hub-content">
        {activeSection === 'overview' && (
          <div className="overview-grid">
            <div className="overview-card" onClick={() => setShowArtArea(true)}>
              <div className="card-icon">🎨</div>
              <h3>Art Area</h3>
              <p>Create beautiful art with love and light</p>
              <button className="card-button">Open Art Area</button>
            </div>

            <div className="overview-card" onClick={() => setShowMathArea(true)}>
              <div className="card-icon">🔢</div>
              <h3>Math Area</h3>
              <p>Learn math with interactive tools</p>
              <button className="card-button">Open Math Area</button>
            </div>

            <div className="overview-card" onClick={() => setShowScienceCenter(true)}>
              <div className="card-icon">🔬</div>
              <h3>Science Center</h3>
              <p>Explore quantum biology and molecules</p>
              <button className="card-button">Open Science Center</button>
            </div>

            <div className="overview-card">
              <div className="card-icon">🔺</div>
              <h3>P31 Molecule</h3>
              <p>Explore the tetrahedron structure</p>
              <button className="card-button">Coming Soon</button>
            </div>
          </div>
        )}

        {activeSection === 'art' && (
          <div className="section-content">
            <h2>🎨 Art Area</h2>
            <p>Create beautiful art with drawing tools, colors, and brushes.</p>
            <button className="section-button" onClick={() => setShowArtArea(true)}>
              Open Art Area
            </button>
          </div>
        )}

        {activeSection === 'math' && (
          <div className="section-content">
            <h2>🔢 Math Area</h2>
            <p>Learn math with calculator, number line, shapes, counting, and problems.</p>
            <button className="section-button" onClick={() => setShowMathArea(true)}>
              Open Math Area
            </button>
          </div>
        )}

        {activeSection === 'science' && (
          <div className="section-content">
            <h2>🔬 Science Center</h2>
            <p>Explore quantum biology, molecular structures, and scientific concepts.</p>
            <button className="section-button" onClick={() => setShowScienceCenter(true)}>
              Open Science Center
            </button>
          </div>
        )}

        {activeSection === 'activities' && (
          <div className="section-content">
            <h2>🎮 Activities</h2>
            <p>Games, challenges, and fun activities for the whole family.</p>
            <div className="activities-grid">
              <div className="activity-card">
                <h4>🎨 Art Gallery</h4>
                <p>View all saved artwork</p>
              </div>
              <div className="activity-card">
                <h4>🔢 Math Practice</h4>
                <p>Practice math problems</p>
              </div>
              <div className="activity-card">
                <h4>🔬 Science Experiments</h4>
                <p>Explore scientific concepts</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'family' && (
          <div className="section-content">
            <h2>👨‍👩‍👧‍👦 Family</h2>
            <p>The four vertices. The minimum stable system.</p>
            <div className="family-vertices">
              <div className="vertex-card">
                <h4>Will (Operator)</h4>
                <p>The biological operator. The broken calcium.</p>
              </div>
              <div className="vertex-card">
                <h4>Synthetic Body</h4>
                <p>AI protocol + Co-parent</p>
              </div>
              <div className="vertex-card">
                <h4>Bash (Node One)</h4>
                <p>The first child. The first reason.</p>
              </div>
              <div className="vertex-card">
                <h4>Willow (Node Two)</h4>
                <p>The second child. The second reason.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-screen overlays */}
      {showArtArea && (
        <div className="fullscreen-overlay">
          <button className="close-button" onClick={() => setShowArtArea(false)}>
            ✕
          </button>
          <ArtArea />
        </div>
      )}

      {showMathArea && (
        <div className="fullscreen-overlay">
          <button className="close-button" onClick={() => setShowMathArea(false)}>
            ✕
          </button>
          <MathArea />
        </div>
      )}

      {showScienceCenter && (
        <div className="fullscreen-overlay">
          <button className="close-button" onClick={() => setShowScienceCenter(false)}>
            ✕
          </button>
          <ScienceCenter />
        </div>
      )}

      <div className="hub-footer">
        <p>💜 With love and light. As above, so below. 💜</p>
        <p>The Mesh Holds. 🔺</p>
      </div>
    </div>
  );
}

export default FamilyHub;
