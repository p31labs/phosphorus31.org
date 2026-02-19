import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  Cpu,
  Shield,
  Scale,
  Layers,
  Brain,
  Network,
  MousePointer,
  BookOpen,
  RotateCcw,
} from 'lucide-react';

// --- Data Structure ---
const DATA = {
  critical: [
    {
      id: '1',
      title: '1. Physics/Hardware Layer',
      icon: <Cpu className="w-5 h-5" />,
      subsections: [
        {
          title: 'A. TFLN/AlGaAs Migration',
          items: [
            'Refactor hardware abstraction layers to support TFLN (X-cut, MgO-doped) or AlGaAs PICs.',
            'Remove all BBO/SPDC references from code and documentation.',
            'Update supply chain documentation for PIC sourcing and integration.',
            'Validate new photonic hardware in lab and field; document results.',
          ],
        },
        {
          title: 'B. NXP SE050 Secure Element',
          items: [
            'Integrate SE050 support in firmware (I2C driver, crypto API).',
            'Physically isolate SE050 on a dedicated I2C bus.',
            'Implement and enforce SCP03 protocol for all SE050 communications.',
            'Remove ATECC608 code and documentation.',
            'Test and document key generation, storage, and cryptographic operations.',
          ],
        },
        {
          title: 'C. ESP32-S3 Security Hardening',
          items: [
            'Update build scripts to require ESP-IDF v5.4.4+ or v5.5.2+.',
            'Disable BluFi in firmware; document removal.',
            'Remap LoRa pins to avoid OPI PSRAM bank.',
            'Enforce Secure Boot V2 (RSA-3072, eFuse).',
            'Test and document all security features.',
          ],
        },
      ],
    },
    {
      id: '2',
      title: '2. Cryptography/Quantum Protocols',
      icon: <Shield className="w-5 h-5" />,
      subsections: [
        {
          title: 'A. SIC-POVM Security Proof',
          items: [
            'Commission a composable, finite-size security proof (EAT, post-selection).',
            'Integrate proof into protocol documentation and code.',
            'Update quantum protocol code to reference new proof.',
            'Flag all quantum protocol code as "not production-secure" until proof is delivered.',
          ],
        },
      ],
    },
    {
      id: '3',
      title: '3. Compliance & Legal',
      icon: <Scale className="w-5 h-5" />,
      subsections: [
        {
          title: 'A. CE RED, BIS Export, Abdication',
          items: [
            'Draft and maintain CE RED and BIS export compliance documentation.',
            'Implement cryptographic erasure/abdication scripts (secure release replacement).',
            'Add export control logic and documentation.',
            'Review and update all legal disclaimers and user agreements.',
          ],
        },
      ],
    },
  ],
  secondary: [
    {
      id: '4',
      title: '4. Software Architecture',
      icon: <Layers className="w-5 h-5" />,
      subsections: [
        {
          title: 'A. Monorepo Standardization',
          items: [
            'Standardize on Nx and Tauri v2 for all platforms.',
            'Remove Lerna and Capacitor configs and dependencies.',
            'Update and document build, test, and deployment processes.',
            'Validate cross-platform builds (desktop, mobile).',
          ],
        },
      ],
    },
    {
      id: '5',
      title: '5. AI/Local Language Model',
      icon: <Brain className="w-5 h-5" />,
      subsections: [
        {
          title: 'A. Local SLM Integration',
          items: [
            'Integrate a local SLM (e.g., Phi-3 Mini) for all AI features.',
            'Enforce output via JSON schema/grammar-based sampling.',
            'Remove all cloud LLM dependencies (Gemini, OpenAI).',
            'Test SLM performance and safety on target hardware.',
          ],
        },
      ],
    },
    {
      id: '6',
      title: '6. Network/Topology',
      icon: <Network className="w-5 h-5" />,
      subsections: [
        {
          title: 'A. Mesh Routing & Geometric Security',
          items: [
            'Implement mesh routing using Forman-Ricci Curvature (FRC).',
            'Add trust-void detection and autopoiesis logic.',
            'Optimize routing for embedded hardware (DSP/SIMD).',
            'Test mesh resilience and self-healing in simulation and field.',
          ],
        },
      ],
    },
    {
      id: '7',
      title: '7. UI/UX & Cognitive Ergonomics',
      icon: <MousePointer className="w-5 h-5" />,
      subsections: [
        {
          title: 'A. Spoon Theory, Override, Haptics',
          items: [
            'Implement deterministic keyword override (regex scanner, bypass logic).',
            'Integrate QBER-tied haptic feedback (vibration, magnetic detents).',
            'Ensure neurodivergent-first design principles (accessibility, latency).',
            'Document and test all features with user feedback.',
          ],
        },
      ],
    },
    {
      id: '8',
      title: '8. Documentation & Onboarding',
      icon: <BookOpen className="w-5 h-5" />,
      subsections: [
        {
          title: 'A. Technical Documentation',
          items: [
            'Update onboarding, migration, and subsystem-specific documentation.',
            'Document all new features, compliance requirements, and procedures.',
            'Provide quick-start guides and troubleshooting for all critical paths.',
          ],
        },
      ],
    },
  ],
};

// --- Helper Components ---

interface ProgressBarProps {
  current: number;
  total: number;
  colorClass?: string;
}

const ProgressBar = ({ current, total, colorClass = 'bg-blue-500' }: ProgressBarProps) => {
  const percentage = total === 0 ? 0 : Math.round((current / total) * 100);
  return (
    <div className="w-full bg-slate-700 h-2.5 rounded-full mt-2 overflow-hidden">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ease-out ${colorClass}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

interface SectionCardProps {
  section: any;
  checkedItems: Record<string, boolean>;
  toggleItem: (id: string) => void;
  accentColor: string;
}

const SectionCard = ({ section, checkedItems, toggleItem, accentColor }: SectionCardProps) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
        <div className={`p-2 rounded-md bg-slate-900 ${accentColor}`}>{section.icon}</div>
        <h3 className="text-lg font-semibold text-slate-100">{section.title}</h3>
      </div>

      <div className="space-y-6">
        {section.subsections.map((sub: any, sIdx: number) => (
          <div key={sIdx}>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
              {sub.title}
            </h4>
            <ul className="space-y-2">
              {sub.items.map((item: string, iIdx: number) => {
                const itemId = `${section.id}-${sIdx}-${iIdx}`;
                const isChecked = checkedItems[itemId] || false;

                return (
                  <li
                    key={itemId}
                    className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-colors ${isChecked ? 'bg-slate-700/30' : 'hover:bg-slate-700/50'}`}
                    onClick={() => toggleItem(itemId)}
                  >
                    <div
                      className={`mt-0.5 flex-shrink-0 transition-colors ${isChecked ? 'text-emerald-400' : 'text-slate-500'}`}
                    >
                      {isChecked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </div>
                    <span
                      className={`text-sm leading-relaxed ${isChecked ? 'text-slate-500 line-through' : 'text-slate-300'}`}
                    >
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Checklist Component ---

const MigrationChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('project_checklist_state');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved state');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('project_checklist_state', JSON.stringify(checkedItems));
    }
  }, [checkedItems, isLoaded]);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setCheckedItems({});
    }
  };

  // Metrics Calculation
  const calculateMetrics = (dataset: typeof DATA.critical | typeof DATA.secondary) => {
    let total = 0;
    let completed = 0;

    dataset.forEach((section) => {
      section.subsections.forEach((sub, sIdx) => {
        sub.items.forEach((_, iIdx) => {
          total++;
          if (checkedItems[`${section.id}-${sIdx}-${iIdx}`]) {
            completed++;
          }
        });
      });
    });

    return {
      total,
      completed,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  };

  const criticalMetrics = calculateMetrics(DATA.critical);
  const secondaryMetrics = calculateMetrics(DATA.secondary);
  const overallTotal = criticalMetrics.total + secondaryMetrics.total;
  const overallCompleted = criticalMetrics.completed + secondaryMetrics.completed;
  const overallPercentage = Math.round((overallCompleted / overallTotal) * 100) || 0;

  if (!isLoaded)
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Header / HUD */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-10 shadow-lg backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="text-cyan-400" />
                Project Migration & Hardening
              </h1>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                <span>V2.0 LIVE CHECKLIST</span>
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <span>LOCAL STORAGE ACTIVE</span>
              </div>
            </div>
            {/* Global Stats */}
            <div className="flex-1 max-w-xl">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Overall Progress</span>
                <span className="font-mono text-cyan-400">{overallPercentage}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-cyan-500 transition-all duration-700"
                  style={{ width: `${overallPercentage}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={resetProgress}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
              title="Reset Progress"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* CRITICAL PATH SECTION */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-amber-500 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Path
            </h2>
            <div className="text-sm font-mono text-amber-500/80">
              {criticalMetrics.completed}/{criticalMetrics.total} TASKS
            </div>
          </div>
          <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-amber-200 text-sm font-medium">Readiness for Deployment</span>
              <span className="text-amber-400 font-bold">{criticalMetrics.percentage}%</span>
            </div>
            <ProgressBar
              current={criticalMetrics.completed}
              total={criticalMetrics.total}
              colorClass="bg-amber-500"
            />
            <p className="text-xs text-amber-500/70 mt-2 uppercase tracking-wide">
              Mandatory for Release: Hardware Migration • SIC-POVM Proof • Compliance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DATA.critical.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                checkedItems={checkedItems}
                toggleItem={toggleItem}
                accentColor="text-amber-400"
              />
            ))}
          </div>
        </section>
        {/* DIVIDER */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-slate-900 text-slate-500 text-xs font-mono uppercase">
              Parallel Operations
            </span>
          </div>
        </div>
        {/* SECONDARY PATH SECTION */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Secondary Path
            </h2>
            <div className="text-sm font-mono text-cyan-400/80">
              {secondaryMetrics.completed}/{secondaryMetrics.total} TASKS
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {DATA.secondary.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                checkedItems={checkedItems}
                toggleItem={toggleItem}
                accentColor="text-cyan-400"
              />
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-800 py-8 mt-12 bg-slate-950 text-center">
        <p className="text-slate-500 text-sm mb-2">Secure Engineering Dashboard</p>
        <p className="text-xs text-slate-600 font-mono">
          ESP32-S3 • TFLN/AlGaAs • SE050 • Post-Quantum
        </p>
      </footer>
    </div>
  );
};

export default MigrationChecklist;
