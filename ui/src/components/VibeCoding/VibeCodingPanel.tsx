/**
 * Vibe Coding Panel
 * In-game coding environment with internal slicing and direct printer output
 *
 * "Vibe coding inside the game environment with internal slicing and push straight to printer"
 *
 * 💜 With love and light. As above, so below. 💜
 */

import React, { useState, useEffect, useRef } from 'react';
import { useGameEngineContext } from '../Game/GameEngineProvider';
import './VibeCodingPanel.css';

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

export const VibeCodingPanel: React.FC = () => {
  const { gameEngine } = useGameEngineContext();
  const [projects, setProjects] = useState<CodeProject[]>([]);
  const [activeProject, setActiveProject] = useState<CodeProject | null>(null);
  const [code, setCode] = useState('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSlicing, setShowSlicing] = useState(false);
  const [showPrinter, setShowPrinter] = useState(false);
  const [printers, setPrinters] = useState<any[]>([]);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);

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

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const vibeCoding = (gameEngine as any).vibeCoding;
      if (!vibeCoding) return;

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
            disabled={!activeProject || isExecuting}
          >
            {isExecuting ? '⏳ Executing...' : '▶️ Execute'}
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
                <span className="project-language-badge">{activeProject.language}</span>
              </div>
              <textarea
                ref={codeEditorRef}
                className="code-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here... 💜"
                spellCheck={false}
              />
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
