/**
 * Family Co-Op View
 * UI component for family tetrahedron co-op mode
 *
 * "Four vertices. Six edges. Four faces. The minimum stable system."
 */

import React, { useState, useEffect } from 'react';
import { useGameEngineContext } from './GameEngineProvider';
import { Users, Trophy, Heart, Book, Play, Pause, CheckCircle } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  role: 'foundation' | 'structure' | 'connection' | 'completion';
  color: string;
  piecesPlaced: number;
}

export const FamilyCoOpView: React.FC = () => {
  const { engine, gameState } = useGameEngineContext();

  // Get family co-op mode from engine
  const familyCoOp = engine?.getFamilyCoOp?.();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [storyVisible, setStoryVisible] = useState(true);
  const [rolesVisible, setRolesVisible] = useState(true);
  const [structureAnalysis, setStructureAnalysis] = useState<any>(null);
  const [bondingScore, setBondingScore] = useState<number>(0);
  const [bondingLevel, setBondingLevel] = useState<string>('New');
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [showPhysics, setShowPhysics] = useState(false);

  // Initialize family members (would come from engine in real implementation)
  useEffect(() => {
    // Example family setup
    const members: FamilyMember[] = [
      { id: 'will', name: 'Will', role: 'foundation', color: '#4ECDC4', piecesPlaced: 0 },
      { id: 'coparent', name: 'Co-parent', role: 'structure', color: '#FF6B6B', piecesPlaced: 0 },
      { id: 'bash', name: 'Bash', role: 'connection', color: '#FFE66D', piecesPlaced: 0 },
      { id: 'willow', name: 'Willow', role: 'completion', color: '#95E1D3', piecesPlaced: 0 },
    ];
    setFamilyMembers(members);

    // Load first challenge
    if (familyCoOp) {
      const challenges = familyCoOp.getAvailableChallenges();
      if (challenges.length > 0) {
        setCurrentChallenge(challenges[0]);
      }
    }
  }, [engine, familyCoOp]);

  // Subscribe to collaboration events
  useEffect(() => {
    if (!familyCoOp) return;

    const unsubscribe = familyCoOp.subscribeToCollaboration('all', (event) => {
      // Update recent actions
      setRecentActions((prev) => [...prev.slice(-9), event].slice(-10));

      // Update family member contributions
      if (event.type === 'piece_placed') {
        setFamilyMembers((prev) =>
          prev.map((m) =>
            m.id === event.playerId ? { ...m, piecesPlaced: m.piecesPlaced + 1 } : m
          )
        );
      }
    });

    return unsubscribe;
  }, [engine, familyCoOp]);

  // Update structure analysis periodically
  useEffect(() => {
    if (!familyCoOp || !showPhysics) return;

    const interval = setInterval(() => {
      const analysis = familyCoOp.getStructureAnalysis();
      if (analysis) {
        setStructureAnalysis(analysis);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [familyCoOp, showPhysics]);

  // Update bonding score
  useEffect(() => {
    if (!familyCoOp) return;

    const interval = setInterval(() => {
      const bonding = familyCoOp.getFamilyBonding();
      if (bonding) {
        setBondingScore(bonding.score);
        setBondingLevel(bonding.level);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [familyCoOp]);

  const getRoleDescription = (role: string): string => {
    const descriptions: Record<string, string> = {
      foundation: 'Build the foundation/base of the structure',
      structure: 'Build the main structure and connect pieces',
      connection: 'Connect different parts and create tetrahedron topology',
      completion: 'Finish the structure and test stability',
    };
    return descriptions[role] || '';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'foundation':
        return '🏗️';
      case 'structure':
        return '🧱';
      case 'connection':
        return '🔗';
      case 'completion':
        return '✨';
      default:
        return '👤';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-lg shadow-xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold">Family Co-Op Mode</h2>
            <p className="text-gray-400 text-sm">Four vertices. Six edges. Four faces.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <span className="text-lg font-semibold">Family Points: 0</span>
        </div>
      </div>

      {/* Story Section */}
      {storyVisible && currentChallenge && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6 border-l-4 border-purple-500">
          <div className="flex items-start space-x-3">
            <Book className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2 text-purple-300">The Story</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {currentChallenge.story || 'No story available for this challenge.'}
              </p>
            </div>
            <button
              onClick={() => setStoryVisible(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Hide story"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Family Members / Roles */}
      {rolesVisible && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-400" />
            Family Tetrahedron
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gray-800 p-4 rounded-lg border-2 hover:scale-105 transition-transform"
                style={{ borderColor: member.color }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getRoleIcon(member.role)}</span>
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-gray-400 capitalize">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: member.color }}>
                      {member.piecesPlaced}
                    </div>
                    <div className="text-xs text-gray-400">pieces</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{getRoleDescription(member.role)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenge Info */}
      {currentChallenge && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">{currentChallenge.name}</h3>
          <p className="text-gray-300 mb-4">{currentChallenge.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Objective:</span>
              <p className="text-white font-medium">{currentChallenge.objective}</p>
            </div>
            <div>
              <span className="text-gray-400">Estimated Time:</span>
              <p className="text-white font-medium">{currentChallenge.estimatedTime} minutes</p>
            </div>
          </div>

          {/* Requirements */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Requirements:</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>✓ 4 vertices (one per family member)</li>
              <li>✓ 6 edges (connections)</li>
              <li>✓ Stability: {currentChallenge.structureRequirements?.minStability || 50}+</li>
              <li>✓ Maxwell's Rule: Valid</li>
            </ul>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            onClick={() => {
              // Start challenge
              console.log('Starting family co-op challenge...');
            }}
          >
            <Play className="h-4 w-4" />
            <span>Start Challenge</span>
          </button>

          <button
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            onClick={() => setStoryVisible(!storyVisible)}
          >
            <Book className="h-4 w-4" />
            <span>{storyVisible ? 'Hide' : 'Show'} Story</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-gray-400">
          <Heart className="h-5 w-5 text-red-400" />
          <span>Family LOVE: 0</span>
        </div>
      </div>

      {/* Physics Analysis */}
      {showPhysics && structureAnalysis && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="mr-2">🔬</span>
            Structure Analysis
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Maxwell's Rule:</span>
              <span className={structureAnalysis.maxwellValid ? 'text-green-400' : 'text-red-400'}>
                {structureAnalysis.maxwellValid ? '✓ Valid' : '✗ Invalid'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stability:</span>
              <span className="text-white font-semibold">{structureAnalysis.stability}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Load Capacity:</span>
              <span className="text-white">{structureAnalysis.loadCapacity.toFixed(1)} kg</span>
            </div>
            {structureAnalysis.weakPoints.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <span className="text-yellow-400 text-xs">
                  ⚠️ Weak Points: {structureAnalysis.weakPoints.length}
                </span>
              </div>
            )}
            {structureAnalysis.recommendations.length > 0 && (
              <div className="mt-2 text-xs text-gray-300">
                {structureAnalysis.recommendations[0]}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Family Bonding */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-400" />
            <span className="text-gray-400">Family Bonding:</span>
            <span className="text-white font-semibold">{bondingLevel}</span>
          </div>
          <span className="text-white font-bold">{bondingScore}/100</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${bondingScore}%` }}
          />
        </div>
      </div>

      {/* Recent Actions */}
      {recentActions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Recent Actions</h4>
          <div className="space-y-1 text-xs">
            {recentActions
              .slice(-5)
              .reverse()
              .map((action, i) => (
                <div key={i} className="text-gray-300">
                  {action.playerId}{' '}
                  {action.type === 'piece_placed' ? 'placed a piece' : action.type}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        <button
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition-colors"
          onClick={() => setShowPhysics(!showPhysics)}
        >
          {showPhysics ? 'Hide' : 'Show'} Physics
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">Family Progress</span>
          <span className="text-white font-semibold">0% Complete</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: '0%' }}
          />
        </div>
      </div>
    </div>
  );
};
