/**
 * Family Vibe Coding Panel
 * UI for family collaborative coding, slicing, and printing
 */

import React, { useState, useEffect } from 'react';
import { useGameEngineContext } from '../Game/GameEngineProvider';
import { SimpleButton } from '../Accessibility/SimpleButton';

export const FamilyVibeCodingPanel: React.FC = () => {
  const { gameEngine } = useGameEngineContext();
  const [session, setSession] = useState<any>(null);
  const [code, setCode] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [sliceJobs, setSliceJobs] = useState<any[]>([]);
  const [printJobs, setPrintJobs] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

  useEffect(() => {
    if (!gameEngine) return;

    const familyVibeCoding = gameEngine.getFamilyVibeCoding();
    const currentSession = familyVibeCoding.getCurrentSession();

    if (currentSession) {
      setSession(currentSession);
      setMembers(currentSession.members);

      // Load code
      const project = gameEngine.getVibeCodingManager().getProject(currentSession.projectId);
      if (project) {
        setCode(project.code);
      }

      // Load slice and print jobs
      setSliceJobs(familyVibeCoding.getSliceJobs(currentSession.id));
      setPrintJobs(familyVibeCoding.getPrintJobs(currentSession.id));
    }

    // Listen for events
    const handleCodeUpdate = (e: CustomEvent) => {
      if (e.detail.sessionId === currentSession?.id) {
        setCode(e.detail.code);
      }
    };

    const handleSliceRequested = (e: CustomEvent) => {
      setPendingApprovals((prev) => [...prev, { type: 'slice', ...e.detail }]);
    };

    const handlePrintRequested = (e: CustomEvent) => {
      setPendingApprovals((prev) => [...prev, { type: 'print', ...e.detail }]);
    };

    window.addEventListener('familyvibecoding:codeUpdated', handleCodeUpdate as EventListener);
    window.addEventListener(
      'familyvibecoding:sliceRequested',
      handleSliceRequested as EventListener
    );
    window.addEventListener(
      'familyvibecoding:printRequested',
      handlePrintRequested as EventListener
    );

    return () => {
      window.removeEventListener('familyvibecoding:codeUpdated', handleCodeUpdate as EventListener);
      window.removeEventListener(
        'familyvibecoding:sliceRequested',
        handleSliceRequested as EventListener
      );
      window.removeEventListener(
        'familyvibecoding:printRequested',
        handlePrintRequested as EventListener
      );
    };
  }, [gameEngine]);

  const handleCreateSession = () => {
    if (!gameEngine) return;

    const familyVibeCoding = gameEngine.getFamilyVibeCoding();
    const host: any = {
      id: 'host_1',
      name: 'The Operator',
      role: 'parent',
      permissions: {
        canEdit: true,
        canExecute: true,
        canSlice: true,
        canPrint: true,
      },
    };

    const newSession = familyVibeCoding.createSession('Family Coding Session', host);
    setSession(newSession);
    setMembers(newSession.members);
  };

  const handleUpdateCode = () => {
    if (!gameEngine || !session) return;

    const familyVibeCoding = gameEngine.getFamilyVibeCoding();
    try {
      familyVibeCoding.updateCode(session.id, 'host_1', code);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleExecuteCode = async () => {
    if (!gameEngine || !session) return;

    const familyVibeCoding = gameEngine.getFamilyVibeCoding();
    try {
      await familyVibeCoding.executeCode(session.id, 'host_1');
      alert('Code executed successfully!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSlice = async () => {
    if (!gameEngine || !session) return;

    const familyVibeCoding = gameEngine.getFamilyVibeCoding();
    const structure = gameEngine.getCurrentStructure();

    if (!structure) {
      alert('No structure to slice. Build something first!');
      return;
    }

    try {
      // Export structure to geometry
      const geometry = await (gameEngine as any).exportStructureToGeometry(structure);

      // Request slice
      await familyVibeCoding.requestSlice(session.id, 'host_1', geometry, {
        layerHeight: 0.2,
        infillDensity: 0.2,
      });

      alert('Slice requested!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handlePrint = async (sliceJobId: string) => {
    if (!gameEngine || !session) return;

    const familyVibeCoding = gameEngine.getFamilyVibeCoding();
    try {
      await familyVibeCoding.requestPrint(session.id, 'host_1', sliceJobId);
      alert('Print requested!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleApprove = async (approval: any) => {
    if (!gameEngine || !session) return;

    const familyVibeCoding = gameEngine.getFamilyVibeCoding();
    try {
      if (approval.type === 'slice') {
        await familyVibeCoding.approveSlice(approval.sliceJob.id, 'host_1');
      } else if (approval.type === 'print') {
        await familyVibeCoding.approvePrint(approval.printJob.id, 'host_1');
      }

      setPendingApprovals((prev) => prev.filter((a) => a !== approval));
      alert('Approved!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleCodeToPrint = async () => {
    if (!gameEngine || !session) return;

    const familyVibeCoding = gameEngine.getFamilyVibeCoding();
    const structure = gameEngine.getCurrentStructure();

    if (!structure) {
      alert('No structure to print. Build something first!');
      return;
    }

    try {
      const geometry = await (gameEngine as any).exportStructureToGeometry(structure);

      const result = await familyVibeCoding.codeToPrint(
        session.id,
        'host_1',
        code,
        geometry,
        { layerHeight: 0.2 },
        undefined
      );

      alert(`Code → Print complete!\nSlice: ${result.sliceJob.id}\nPrint: ${result.printJob.id}`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  if (!session) {
    return (
      <div className="family-vibe-coding-panel">
        <h2>👨‍👩‍👧‍👦 Family Vibe Coding</h2>
        <p>Start a family coding session to code, slice, and print together!</p>
        <SimpleButton
          label="Create Family Session"
          onClick={handleCreateSession}
          variant="primary"
          size="large"
        />
      </div>
    );
  }

  return (
    <div className="family-vibe-coding-panel">
      <div className="panel-header">
        <h2>👨‍👩‍👧‍👦 {session.name}</h2>
        <p className="session-id">Session: {session.id}</p>
      </div>

      {/* Members */}
      <section className="section">
        <h3>Family Members ({members.length})</h3>
        <div className="members-list">
          {members.map((member) => (
            <div key={member.id} className="member-card">
              <span className="member-name">{member.name}</span>
              <span className="member-role">{member.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Code Editor */}
      <section className="section">
        <h3>💻 Code Editor</h3>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-editor"
          placeholder="Write your code here..."
          rows={15}
        />
        <div className="button-group">
          <SimpleButton
            label="Update Code"
            onClick={handleUpdateCode}
            variant="secondary"
            size="small"
          />
          <SimpleButton
            label="▶️ Run"
            onClick={handleExecuteCode}
            variant="primary"
            size="small"
          />
        </div>
      </section>

      {/* Slice Jobs */}
      <section className="section">
        <h3>🔪 Slice Jobs ({sliceJobs.length})</h3>
        {sliceJobs.length === 0 ? (
          <p>No slice jobs yet. Build something and slice it!</p>
        ) : (
          <div className="jobs-list">
            {sliceJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-info">
                  <span className="job-id">{job.id}</span>
                  <span className="job-status">{job.status}</span>
                </div>
                {job.status === 'ready' && (
                  <SimpleButton
                    label="🖨️ Print"
                    onClick={() => handlePrint(job.id)}
                    variant="primary"
                    size="small"
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <SimpleButton
          label="🔪 Slice Current Structure"
          onClick={handleSlice}
          variant="info"
          size="medium"
        />
      </section>

      {/* Print Jobs */}
      <section className="section">
        <h3>🖨️ Print Jobs ({printJobs.length})</h3>
        {printJobs.length === 0 ? (
          <p>No print jobs yet.</p>
        ) : (
          <div className="jobs-list">
            {printJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-info">
                  <span className="job-id">{job.id}</span>
                  <span className="job-status">{job.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <section className="section approvals">
          <h3>⏳ Pending Approvals ({pendingApprovals.length})</h3>
          {pendingApprovals.map((approval, index) => (
            <div key={index} className="approval-card">
              <p>
                {approval.type === 'slice' ? '🔪' : '🖨️'}
                {approval.member?.name} requested {approval.type}
              </p>
              <div className="button-group">
                <SimpleButton
                  label="✅ Approve"
                  onClick={() => handleApprove(approval)}
                  variant="success"
                  size="small"
                />
                <SimpleButton
                  label="❌ Deny"
                  onClick={() => setPendingApprovals((prev) => prev.filter((a) => a !== approval))}
                  variant="danger"
                  size="small"
                />
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Quick Actions */}
      <section className="section">
        <h3>⚡ Quick Actions</h3>
        <SimpleButton
          label="💻 Code → 🔪 Slice → 🖨️ Print"
          onClick={handleCodeToPrint}
          variant="primary"
          size="large"
          className="full-width"
        />
      </section>

      <style>{`
        .family-vibe-coding-panel {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.9);
          border-radius: 16px;
          color: white;
          max-width: 1000px;
          margin: 0 auto;
          max-height: 90vh;
          overflow-y: auto;
        }

        .panel-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 105, 180, 0.3);
        }

        .panel-header h2 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #FF69B4, #87CEEB);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .session-id {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 105, 180, 0.2);
        }

        .section h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #87CEEB;
        }

        .members-list {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .member-card {
          padding: 0.75rem 1rem;
          background: rgba(255, 105, 180, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 105, 180, 0.3);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .member-name {
          font-weight: 700;
          color: #FF69B4;
        }

        .member-role {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .code-editor {
          width: 100%;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 105, 180, 0.3);
          border-radius: 8px;
          color: white;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          resize: vertical;
        }

        .code-editor:focus {
          outline: none;
          border-color: #FF69B4;
        }

        .button-group {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .job-card {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 105, 180, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .job-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .job-id {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .job-status {
          font-weight: 700;
          color: #87CEEB;
        }

        .approvals {
          background: rgba(255, 193, 7, 0.1);
          border-color: rgba(255, 193, 7, 0.3);
        }

        .approval-card {
          padding: 1rem;
          background: rgba(255, 193, 7, 0.1);
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .approval-card p {
          margin-bottom: 0.75rem;
        }

        .full-width {
          width: 100%;
        }
      `}</style>
    </div>
  );
};
