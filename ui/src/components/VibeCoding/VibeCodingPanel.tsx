/**
 * Vibe Coding Panel
 * In-game coding environment with internal slicing and direct printer output
 *
 * "Vibe coding inside the game environment with internal slicing and push straight to printer"
 *
 * 💜 With love and light. As above, so below. 💜
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameEngineContext } from '../Game/GameEngineProvider';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { prefersReducedMotion } from '../../utils/accessibility';
import { playCompletionFanfare } from '../../lib/audio';
import { BlockPalette } from './BlockPalette';
import { BlockCanvas } from './BlockCanvas';
import { blocksToCode, type KidBlock } from '../../lib/vibeCodingBlocks';
import './VibeCodingPanel.css';
import './KidBlocks.css';

interface CodeProject {
  id: string;
  name: string;
  language: 'javascript' | 'typescript' | 'python' | 'glsl' | 'hlsl';
  code: string;
  createdAt: number;
  updatedAt: number;
}

interface ExecutionResult {
  id: string;
  result?: any;
  error?: string;
  executionTime: number;
  slicedModel?: any;
  printJob?: any;
}

const PRINT_COMPLETE_MESSAGE = '🎉 Your Super Star Molecule is ready! Happy MAR10 Day!';

export const VibeCodingPanel: React.FC = () => {
  const { gameEngine } = useGameEngineContext();
  const audioFeedback = useAccessibilityStore((s) => s.audioFeedback);
  const animationReduced = useAccessibilityStore((s) => s.animationReduced);
  const [projects, setProjects] = useState<CodeProject[]>([]);
  const [activeProject, setActiveProject] = useState<CodeProject | null>(null);
  const [code, setCode] = useState('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSlicing, setShowSlicing] = useState(false);
  const [printers, setPrinters] = useState<any[]>([]);
  const [showPrintCelebration, setShowPrintCelebration] = useState(false);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);

  /** Kid Blocks mode: 'code' = text editor, 'blocks' = drag-and-drop blocks */
  const [editorMode, setEditorMode] = useState<'code' | 'blocks'>('code');
  const [kidBlocks, setKidBlocks] = useState<KidBlock[]>([]);
  const [showGeneratedCode, setShowGeneratedCode] = useState(false);

  useEffect(() => {
    if (!gameEngine) return;

    // Get vibe coding manager
    const vibeCoding = (gameEngine as any).vibeCoding;
    if (!vibeCoding) return;

    // Load projects
    const loadedProjects = vibeCoding.getProjects();
    setProjects(loadedProjects);

    if (loadedProjects.length > 0 && !activeProject) {
      const firstProject = loadedProjects[0];
      setActiveProject(firstProject);
      setCode(firstProject.code);
    }

    // Listen for code updates
    const handleCodeUpdate = (e: CustomEvent) => {
      if (e.detail.projectId === activeProject?.id) {
        setCode(e.detail.code);
      }
    };

    window.addEventListener('vibecoding:codeUpdated', handleCodeUpdate as EventListener);

    return () => {
      window.removeEventListener('vibecoding:codeUpdated', handleCodeUpdate as EventListener);
    };
  }, [gameEngine, activeProject]);

  useEffect(() => {
    if (!gameEngine) return;

    // Get printer integration
    const printerIntegration = (gameEngine as any).printerIntegration;
    if (printerIntegration) {
      printerIntegration.scanPrinters().then((foundPrinters: any[]) => {
        setPrinters(foundPrinters);
      });
    }
  }, [gameEngine]);

  const celebrationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Print completion surprise: sound + celebration (respects accessibility)
  useEffect(() => {
    const handlePrintCompleted = (_e: Event) => {
      const e = _e as CustomEvent<{ job: { id: string } }>;
      if (!e.detail?.job) return;
      if (audioFeedback) playCompletionFanfare();
      setShowPrintCelebration(true);
      if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current);
      celebrationTimeoutRef.current = setTimeout(() => setShowPrintCelebration(false), 6000);
    };
    window.addEventListener('printjob:completed', handlePrintCompleted);
    return () => {
      window.removeEventListener('printjob:completed', handlePrintCompleted);
      if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current);
    };
  }, [audioFeedback]);

  const [valentinesTemplates, setValentinesTemplates] = useState<any[]>([]);
  const [showValentinesMenu, setShowValentinesMenu] = useState(false);

  useEffect(() => {
    if (!gameEngine) return;

    const vibeCoding = (gameEngine as any).vibeCoding;
    if (!vibeCoding) return;

    // Check if it's Valentine's season and load templates
    if (vibeCoding.isValentinesSeason && vibeCoding.isValentinesSeason()) {
      const templates = vibeCoding.getValentinesTemplates
        ? vibeCoding.getValentinesTemplates()
        : [];
      setValentinesTemplates(templates);
    }
  }, [gameEngine]);

  const handleCreateProject = () => {
    if (!gameEngine) return;

    const vibeCoding = (gameEngine as any).vibeCoding;
    if (!vibeCoding) return;

    const name = prompt('Project name:');
    if (!name) return;

    const project = vibeCoding.createProject(name, 'javascript');
    setProjects([...projects, project]);
    setActiveProject(project);
    setCode(project.code);
  };

  const handleCreateValentinesProject = (templateName: string) => {
    if (!gameEngine) return;

    const vibeCoding = (gameEngine as any).vibeCoding;
    if (!vibeCoding) return;

    try {
      const project = vibeCoding.createValentinesProject(templateName);
      setProjects([...projects, project]);
      setActiveProject(project);
      setCode(project.code);
      setShowValentinesMenu(false);
    } catch (error: any) {
      alert(`Failed to create Valentine's project: ${error.message}`);
    }
  };

  const handleSaveCode = () => {
    if (!gameEngine || !activeProject) return;

    const vibeCoding = (gameEngine as any).vibeCoding;
    if (!vibeCoding) return;

    vibeCoding.updateProject(activeProject.id, code);
    setActiveProject({ ...activeProject, code, updatedAt: Date.now() });
  };

  const handleExecute = async () => {
    if (!gameEngine || !activeProject || isExecuting) return;

    const vibeCoding = (gameEngine as any).vibeCoding;
    if (!vibeCoding) return;

    // In Blocks mode, sync generated code to project before running
    if (editorMode === 'blocks') {
      const generated = blocksToCode(kidBlocks);
      vibeCoding.updateProject(activeProject.id, generated);
      setCode(generated);
    }

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const execution = await vibeCoding.executeCode(activeProject.id);
      setExecutionResult(execution);

      // If result has geometry, show slicing options
      if (execution.result?.geometry) {
        setShowSlicing(true);
      }
    } catch (error: any) {
      setExecutionResult({
        id: 'error',
        error: error.message,
        executionTime: 0,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSliceAndPrint = async () => {
    if (!gameEngine || !activeProject || !executionResult?.result?.geometry) return;

    setIsExecuting(true);

    try {
      const vibeCoding = (gameEngine as any).vibeCoding;
      const slicingEngine = (gameEngine as any).slicingEngine;
      const printerIntegration = (gameEngine as any).printerIntegration;

      if (!vibeCoding || !slicingEngine || !printerIntegration) {
        throw new Error('Required systems not available');
      }

      // Slice the model
      const geometry = executionResult.result.geometry;
      const slicedModel = await slicingEngine.sliceModel(geometry);

      // Export to G-code
      const gcode = slicingEngine.exportToGCode(slicedModel);

      // Print to selected printer
      const selectedPrinter =
        printers.find((p) => p.id === printerIntegration.getActiveConnection()) || printers[0];
      if (!selectedPrinter) {
        throw new Error('No printer available');
      }

      if (!printerIntegration.getActiveConnection()) {
        await printerIntegration.connect(selectedPrinter.id);
      }

      const printJob = await printerIntegration.printGCode(gcode, selectedPrinter.id);

      setExecutionResult({
        ...executionResult,
        slicedModel,
        printJob,
      });

      console.log('🖨️ Print job started:', printJob.id);
    } catch (error: any) {
      setExecutionResult({
        id: 'error',
        error: error.message,
        executionTime: 0,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="vibe-coding-panel">
      <div className="vibe-coding-header">
        <h2>💻 Vibe Coding</h2>
        <div className="vibe-coding-actions">
          {valentinesTemplates.length > 0 && (
            <div className="valentines-menu-container">
              <button
                onClick={() => setShowValentinesMenu(!showValentinesMenu)}
                className="btn-valentines"
              >
                💜 Valentine's Templates
              </button>
              {showValentinesMenu && (
                <div className="valentines-menu">
                  {valentinesTemplates.map((template) => (
                    <button
                      key={template.name}
                      onClick={() => handleCreateValentinesProject(template.name)}
                      className="valentines-menu-item"
                    >
                      {template.name}
                      <span className="valentines-menu-desc">{template.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button onClick={handleCreateProject} className="btn-primary">
            + New Project
          </button>
          <button onClick={handleSaveCode} className="btn-secondary" disabled={!activeProject}>
            💾 Save
          </button>
          <button
            onClick={handleExecute}
            className="btn-primary"
            disabled={
              !activeProject ||
              isExecuting ||
              (editorMode === 'blocks' && kidBlocks.length === 0)
            }
          >
            {isExecuting ? '⏳ Executing...' : editorMode === 'blocks' ? '▶️ Run' : '▶️ Execute'}
          </button>
        </div>
      </div>

      <div className="vibe-coding-content">
        <div className="vibe-coding-sidebar">
          <h3>Projects</h3>
          <div className="project-list">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`project-item ${activeProject?.id === project.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveProject(project);
                  setCode(project.code);
                }}
              >
                <div className="project-name">{project.name}</div>
                <div className="project-language">{project.language}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="vibe-coding-editor">
          {activeProject ? (
            <>
              <div className="editor-header">
                <span className="project-title">{activeProject.name}</span>
                <div className="editor-header-right">
                  <div className="editor-mode-tabs" role="tablist" aria-label="Editor mode">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={editorMode === 'code' ? 'true' : 'false'}
                      aria-controls="vibe-code-panel"
                      id="tab-code"
                      className={editorMode === 'code' ? 'active' : ''}
                      onClick={() => {
                        if (editorMode === 'blocks' && kidBlocks.length > 0) {
                          setCode(blocksToCode(kidBlocks));
                        }
                        setEditorMode('code');
                      }}
                    >
                      Code
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={editorMode === 'blocks' ? 'true' : 'false'}
                      aria-controls="vibe-blocks-panel"
                      id="tab-blocks"
                      className={editorMode === 'blocks' ? 'active' : ''}
                      onClick={() => setEditorMode('blocks')}
                    >
                      🧩 Kid Blocks
                    </button>
                  </div>
                  <span className="project-language-badge">{activeProject.language}</span>
                </div>
              </div>
              {editorMode === 'code' ? (
                <div id="vibe-code-panel" role="tabpanel" aria-labelledby="tab-code">
                  <textarea
                    ref={codeEditorRef}
                    className="code-editor"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Write your code here... 💜"
                    spellCheck={false}
                  />
                </div>
              ) : (
                <div
                  id="vibe-blocks-panel"
                  role="tabpanel"
                  aria-labelledby="tab-blocks"
                  className="vibe-coding-blocks-mode"
                >
                  <BlockPalette
                    onAddBlock={(block) => setKidBlocks((prev) => [...prev, block])}
                    disabled={!activeProject}
                  />
                  <BlockCanvas
                    blocks={kidBlocks}
                    onBlocksChange={setKidBlocks}
                    onRun={handleExecute}
                    isRunning={isExecuting}
                    showGeneratedCode={showGeneratedCode}
                    onShowCodeChange={setShowGeneratedCode}
                    disabled={!activeProject}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="no-project">
              <p>No project selected</p>
              <button onClick={handleCreateProject} className="btn-primary">
                Create New Project
              </button>
            </div>
          )}
        </div>

        <div className="vibe-coding-output">
          <h3>Output</h3>

          {showPrintCelebration && (
            <div
              className="print-completion-celebration"
              role="status"
              aria-live="polite"
              aria-label="Print complete. Your Super Star Molecule is ready. Happy MAR10 Day."
            >
              {!animationReduced && !prefersReducedMotion() && (
                <div className="print-confetti" aria-hidden="true">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className={`print-confetti-piece print-confetti-piece-${i}`} />
                  ))}
                </div>
              )}
              <div className="print-completion-message">{PRINT_COMPLETE_MESSAGE}</div>
            </div>
          )}

          {executionResult && (
            <div className="execution-result">
              {executionResult.error ? (
                <div className="error-output">
                  <strong>❌ Error:</strong>
                  <pre>{executionResult.error}</pre>
                </div>
              ) : (
                <div className="success-output">
                  <strong>✅ Execution Time:</strong> {executionResult.executionTime.toFixed(2)}ms
                  {executionResult.result?.atoms && (
                    <div className="molecule-result-summary" aria-label="Molecule built from blocks">
                      <strong>🧪 Molecule:</strong> {executionResult.result.atoms.length} atom
                      {executionResult.result.atoms.length !== 1 ? 's' : ''} (Run built your
                      blocks!)
                    </div>
                  )}
                  {executionResult.result && (
                    <pre>{JSON.stringify(executionResult.result, null, 2)}</pre>
                  )}
                </div>
              )}

              {executionResult.slicedModel && (
                <div className="slicing-info">
                  <strong>🔪 Sliced Model:</strong>
                  <ul>
                    <li>Layers: {executionResult.slicedModel.layers.length}</li>
                    <li>
                      Estimated Time: {executionResult.slicedModel.estimatedTime.toFixed(1)} min
                    </li>
                    <li>
                      Estimated Material: {executionResult.slicedModel.estimatedMaterial.toFixed(1)}
                      g
                    </li>
                  </ul>
                  <button
                    onClick={handleSliceAndPrint}
                    className="btn-primary"
                    disabled={isExecuting || printers.length === 0}
                  >
                    🖨️ Slice & Print
                  </button>
                </div>
              )}

              {executionResult.printJob && (
                <div className="print-job-info">
                  <strong>🖨️ Print Job:</strong>
                  <ul>
                    <li>Status: {executionResult.printJob.status}</li>
                    <li>Progress: {(executionResult.printJob.progress * 100).toFixed(1)}%</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {printers.length > 0 && (
            <div className="printer-list">
              <h4>Available Printers</h4>
              {printers.map((printer) => (
                <div key={printer.id} className="printer-item">
                  <span>{printer.name}</span>
                  <span className={`printer-status ${printer.status}`}>{printer.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
