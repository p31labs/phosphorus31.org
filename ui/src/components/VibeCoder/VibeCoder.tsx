/**
 * VibeCoder
 * Code editor inside the game environment
 * Internal slicing and push straight to printer
 *
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import React, { useState, useRef, useEffect } from 'react';
import { SaturnToAries } from './SaturnToAries';
import './VibeCoder.css';

interface CodeSlice {
  startLine: number;
  endLine: number;
  content: string;
  context: string;
}

interface PrinterJob {
  id: string;
  code: string;
  timestamp: number;
  status: 'queued' | 'printing' | 'complete' | 'error';
}

export const VibeCoder: React.FC = () => {
  const [code, setCode] = useState(`// Vibe coding inside the game
// Internal slicing and push straight to printer

function vibeCode() {
  const mesh = "holds";
  const tetrahedron = "connects";
  return { mesh, tetrahedron };
}

// Push to printer when ready
vibeCode();`);

  const [slices, setSlices] = useState<CodeSlice[]>([]);
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const [printerQueue, setPrinterQueue] = useState<PrinterJob[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showSaturnToAries, setShowSaturnToAries] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<string>('');

  // Update line numbers
  useEffect(() => {
    const lines = code.split('\n');
    const numbers = lines.map((_, i) => `${i + 1}`).join('\n');
    setLineNumbers(numbers);
  }, [code]);

  // Auto-slice on code change
  useEffect(() => {
    const newSlices = generateSlices(code);
    setSlices(newSlices);
  }, [code]);

  /**
   * Generate code slices (internal slicing)
   */
  const generateSlices = (sourceCode: string): CodeSlice[] => {
    const lines = sourceCode.split('\n');
    const slices: CodeSlice[] = [];

    // Slice by function blocks
    let currentSlice: CodeSlice | null = null;

    lines.forEach((line, index) => {
      // Detect function start
      if (line.match(/^\s*(function|const|let|var|class|interface|export)\s+\w+/)) {
        if (currentSlice) {
          currentSlice.endLine = index - 1;
          slices.push(currentSlice);
        }
        currentSlice = {
          startLine: index,
          endLine: index,
          content: line,
          context: `Function at line ${index + 1}`,
        };
      } else if (currentSlice) {
        currentSlice.content += '\n' + line;
        currentSlice.endLine = index;

        // Close slice on closing brace
        if (
          line.trim() === '}' &&
          currentSlice.content.split('{').length === currentSlice.content.split('}').length
        ) {
          slices.push(currentSlice);
          currentSlice = null;
        }
      }
    });

    if (currentSlice) {
      slices.push(currentSlice);
    }

    return slices;
  };

  /**
   * Select a slice
   */
  const selectSlice = (index: number) => {
    setSelectedSlice(index);
    const slice = slices[index];
    if (editorRef.current && slice) {
      // Highlight the slice in editor
      const lines = code.split('\n');
      const startPos = lines.slice(0, slice.startLine).join('\n').length + 1;
      const endPos = lines.slice(0, slice.endLine + 1).join('\n').length;
      editorRef.current.setSelectionRange(startPos, endPos);
      editorRef.current.focus();
    }
  };

  /**
   * Push to printer
   */
  const pushToPrinter = async () => {
    const codeToPrint =
      selectedSlice !== null && slices[selectedSlice] ? slices[selectedSlice].content : code;

    const job: PrinterJob = {
      id: `job_${Date.now()}`,
      code: codeToPrint,
      timestamp: Date.now(),
      status: 'queued',
    };

    setPrinterQueue((prev) => [...prev, job]);
    setIsPrinting(true);

    // Simulate printing process
    setTimeout(() => {
      setPrinterQueue((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: 'printing' } : j))
      );

      setTimeout(() => {
        setPrinterQueue((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: 'complete' } : j))
        );
        setIsPrinting(false);

        // Actually print (or compile/deploy)
        handlePrint(job.code);
      }, 2000);
    }, 500);
  };

  /**
   * Handle actual print/compile/deploy
   */
  const handlePrint = (codeToPrint: string) => {
    // Option 1: Print to console
    console.log('=== PRINTER OUTPUT ===');
    console.log(codeToPrint);
    console.log('=====================');

    // Option 2: Compile and deploy (if valid code)
    try {
      // Validate syntax (basic check)
      if (
        codeToPrint.includes('function') ||
        codeToPrint.includes('const') ||
        codeToPrint.includes('class')
      ) {
        // Could compile TypeScript/JavaScript here
        // Or send to build system
        console.log('✅ Code validated - ready for deployment');
      }
    } catch (error) {
      console.error('❌ Print error:', error);
      setPrinterQueue((prev) =>
        prev.map((j) => (j.code === codeToPrint ? { ...j, status: 'error' } : j))
      );
    }
  };

  /**
   * Clear printer queue
   */
  const clearQueue = () => {
    setPrinterQueue([]);
    setIsPrinting(false);
  };

  return (
    <div className="vibe-coder">
      <div className="vibe-coder-header">
        <h2>🔺 VibeCoder</h2>
        <div className="vibe-coder-controls">
          <button
            onClick={() => setShowSaturnToAries(!showSaturnToAries)}
            className="saturn-aries-button"
          >
            {showSaturnToAries ? '💻 Code Editor' : '♄→♈ Saturn to Aries'}
          </button>
          <button onClick={pushToPrinter} disabled={isPrinting} className="printer-button">
            {isPrinting ? '🖨️ Printing...' : '🖨️ Push to Printer'}
          </button>
          {printerQueue.length > 0 && (
            <button onClick={clearQueue} className="clear-button">
              Clear Queue
            </button>
          )}
        </div>
      </div>

      {showSaturnToAries ? (
        <SaturnToAries />
      ) : (
        <>
          <div className="vibe-coder-body">
            {/* Code Editor */}
            <div className="code-editor-container">
              <div className="line-numbers">
                <pre>{lineNumbers}</pre>
              </div>
              <textarea
                ref={editorRef}
                className="code-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                placeholder="// Vibe coding inside the game..."
              />
            </div>

            {/* Slice Panel */}
            <div className="slice-panel">
              <h3>🔪 Internal Slices</h3>
              <div className="slices-list">
                {slices.length === 0 ? (
                  <div className="no-slices">No slices detected. Write some functions!</div>
                ) : (
                  slices.map((slice, index) => (
                    <div
                      key={index}
                      className={`slice-item ${selectedSlice === index ? 'selected' : ''}`}
                      onClick={() => selectSlice(index)}
                    >
                      <div className="slice-header">
                        <span className="slice-lines">
                          Lines {slice.startLine + 1}-{slice.endLine + 1}
                        </span>
                        <span className="slice-context">{slice.context}</span>
                      </div>
                      <pre className="slice-preview">
                        {slice.content.split('\n').slice(0, 3).join('\n')}
                        {slice.content.split('\n').length > 3 ? '...' : ''}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Printer Queue */}
          {printerQueue.length > 0 && (
            <div className="printer-queue">
              <h3>🖨️ Printer Queue</h3>
              <div className="queue-items">
                {printerQueue.map((job) => (
                  <div key={job.id} className={`queue-item ${job.status}`}>
                    <div className="queue-header">
                      <span className="queue-id">{job.id}</span>
                      <span className={`queue-status ${job.status}`}>
                        {job.status === 'queued' && '⏳ Queued'}
                        {job.status === 'printing' && '🖨️ Printing...'}
                        {job.status === 'complete' && '✅ Complete'}
                        {job.status === 'error' && '❌ Error'}
                      </span>
                    </div>
                    <div className="queue-preview">
                      <pre>{job.code.substring(0, 100)}...</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
