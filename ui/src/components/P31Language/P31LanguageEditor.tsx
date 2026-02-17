/**
 * P31 Language Editor
 * Code editor for the P31 domain-specific language
 */

import React, { useState } from 'react';
import { useGameEngineContext } from '../Game/GameEngineProvider';
import { SimpleButton } from '../Accessibility/SimpleButton';
import { compileP31 } from '../../lib/p31-compiler';

const EXAMPLE_CODE = `// P31 Language - "Oh the places we will go"
// With love and light. As above, so below. 💜

// Build a tetrahedron
let tetra = tetrahedron {
  vertex: 4
};

// Check cosmic timing
cosmic timing("build");

// Build structure
build tetra;

// Quantum coherence
quantum coherence(0.95);

// The Mesh Holds
mesh.holds();

// Print it
print tetra;

// Function example
function createStructure() {
  let structure = tetrahedron {};
  build structure;
  return structure;
}

// Loop example
for (let i = 0; i < 4; i = i + 1) {
  build tetrahedron {};
}

// Conditional
if (cosmic.timing("build").favorable) {
  build tetra;
} else {
  quantum coherence(0.5);
}
`;

export interface P31LanguageEditorProps {
  /** When provided, run compiler on code and pass vertices/edges to World Builder */
  onCompile?: (vertices: number[], edges: number[]) => void;
}

export const P31LanguageEditor: React.FC<P31LanguageEditorProps> = ({ onCompile }) => {
  const { engine } = useGameEngineContext();
  const [code, setCode] = useState(EXAMPLE_CODE);
  const [output, setOutput] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    if (!engine || isRunning) return;

    setIsRunning(true);
    setOutput('');
    setErrors([]);

    try {
      const result = (engine as { executeP31Code?: (code: string) => { value: unknown; sideEffects?: string[] } }).executeP31Code?.(code);
      if (!result) throw new Error('Engine does not support executeP31Code');

      // Display result
      let outputText = '✅ Execution successful!\n\n';

      if (result.value !== null && result.value !== undefined) {
        outputText += `Result: ${JSON.stringify(result.value, null, 2)}\n\n`;
      }

      if (result.sideEffects && result.sideEffects.length > 0) {
        outputText += 'Side Effects:\n';
        result.sideEffects.forEach((effect: string) => {
          outputText += `  ${effect}\n`;
        });
      }

      setOutput(outputText);
      if (onCompile) {
        const compiled = compileP31(code);
        if (compiled.vertices.length > 0 || compiled.edges.length > 0) {
          onCompile(compiled.vertices, compiled.edges);
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Execution error';
      setErrors([msg]);
      setOutput(`❌ Error: ${msg}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
    setErrors([]);
  };

  const handleLoadExample = () => {
    setCode(EXAMPLE_CODE);
  };

  return (
    <div className="p31-language-editor">
      <div className="editor-header">
        <h1>🔺 P31 Language</h1>
        <p className="subtitle">"Oh the places we will go"</p>
        <p className="subtitle">With love and light. As above, so below. 💜</p>
      </div>

      <div className="editor-container">
        <div className="editor-section">
          <div className="editor-toolbar">
            <SimpleButton
              label="▶️ Run"
              onClick={handleRun}
              variant="primary"
              size="small"
              disabled={isRunning}
            />
            <SimpleButton label="🗑️ Clear" onClick={handleClear} variant="secondary" size="small" />
            <SimpleButton
              label="📝 Example"
              onClick={handleLoadExample}
              variant="secondary"
              size="small"
            />
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="code-editor"
            placeholder="Write your P31 code here..."
            rows={20}
            spellCheck={false}
          />
        </div>

        <div className="output-section">
          <h3>Output</h3>
          {errors.length > 0 && (
            <div className="errors">
              {errors.map((error, i) => (
                <div key={i} className="error-message">
                  ❌ {error}
                </div>
              ))}
            </div>
          )}
          <pre className="output">{output || 'No output yet. Run your code to see results!'}</pre>
        </div>
      </div>

      <div className="documentation">
        <h3>📚 P31 Language Syntax</h3>
        <div className="doc-section">
          <h4>Keywords</h4>
          <ul>
            <li>
              <code>build</code> - Build a structure
            </li>
            <li>
              <code>print</code> - Print to 3D printer
            </li>
            <li>
              <code>quantum</code> - Quantum coherence operations
            </li>
            <li>
              <code>tetrahedron</code> - Create tetrahedron structure
            </li>
            <li>
              <code>cosmic</code> - Cosmic timing operations
            </li>
            <li>
              <code>mesh</code> - The Mesh Holds
            </li>
            <li>
              <code>let</code> / <code>const</code> - Variable declaration
            </li>
            <li>
              <code>function</code> - Function declaration
            </li>
            <li>
              <code>if</code> / <code>else</code> - Conditionals
            </li>
            <li>
              <code>for</code> / <code>while</code> - Loops
            </li>
            <li>
              <code>return</code> - Return value
            </li>
          </ul>
        </div>

        <div className="doc-section">
          <h4>Examples</h4>
          <pre className="example-code">
            {`// Build tetrahedron
let tetra = tetrahedron {};
build tetra;

// Cosmic timing
cosmic timing("build");

// Quantum coherence
quantum coherence(0.95);

// The Mesh Holds
mesh.holds();`}
          </pre>
        </div>
      </div>

      <style>{`
        .p31-language-editor {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.95);
          border-radius: 16px;
          color: white;
          max-width: 1400px;
          margin: 0 auto;
          max-height: 90vh;
          overflow-y: auto;
        }

        .editor-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 105, 180, 0.3);
        }

        .editor-header h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #FF69B4, #87CEEB);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
          margin: 0.25rem 0;
        }

        .editor-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .editor-section {
          display: flex;
          flex-direction: column;
        }

        .editor-toolbar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
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
          min-height: 400px;
        }

        .code-editor:focus {
          outline: none;
          border-color: #FF69B4;
        }

        .output-section {
          display: flex;
          flex-direction: column;
        }

        .output-section h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #87CEEB;
        }

        .errors {
          margin-bottom: 1rem;
        }

        .error-message {
          padding: 0.75rem;
          background: rgba(255, 0, 0, 0.2);
          border: 1px solid rgba(255, 0, 0, 0.5);
          border-radius: 8px;
          color: #FF6B6B;
          margin-bottom: 0.5rem;
        }

        .output {
          flex: 1;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 105, 180, 0.3);
          border-radius: 8px;
          color: #90EE90;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          white-space: pre-wrap;
          overflow-y: auto;
          min-height: 400px;
        }

        .documentation {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 105, 180, 0.2);
        }

        .documentation h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #87CEEB;
        }

        .doc-section {
          margin-bottom: 1.5rem;
        }

        .doc-section h4 {
          font-size: 1.125rem;
          margin-bottom: 0.75rem;
          color: #FF69B4;
        }

        .doc-section ul {
          list-style: none;
          padding: 0;
        }

        .doc-section li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .doc-section code {
          background: rgba(255, 105, 180, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          color: #FF69B4;
        }

        .example-code {
          padding: 1rem;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 105, 180, 0.3);
          border-radius: 8px;
          color: #90EE90;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          overflow-x: auto;
        }

        @media (max-width: 1024px) {
          .editor-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
