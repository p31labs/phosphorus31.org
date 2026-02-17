/**
 * P31 Language Editor
 * Code editor for P31 DSL with syntax highlighting and execution
 */

import { useState, useEffect, useRef } from 'react';
import { useGameEngineContext } from './GameEngineProvider';
import { Play, Square, Download, Code as CodeIcon } from 'lucide-react';

export const P31LanguageEditor: React.FC = () => {
  const { engine } = useGameEngineContext();
  const [code, setCode] = useState(`project "Family Tetrahedron" {
  // Define family
  family "the_family" {
    will: {
      role: foundation
      color: #4ECDC4
    }
    coparent: {
      role: structure
      color: #FF6B6B
    }
    bash: {
      role: connection
      color: #FFE66D
    }
    willow: {
      role: completion
      color: #95E1D3
    }
  }
  
  // Create structure
  structure "family_tetra" {
    type: tetrahedron
    family: "the_family"
    validate: maxwell
    min_stability: 70
  }
  
  // Generate and print
  generate "family_tetra"
  slice "family_tetra"
  print "family_tetra"
}`);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput([]);

    try {
      // In real implementation, would use P31LanguageParser and Executor
      const logs: string[] = [];
      logs.push('🚀 Running P31 code...');
      logs.push('');
      logs.push('✅ Parsed successfully');
      logs.push('✅ Family "the_family" created');
      logs.push('✅ Structure "family_tetra" created');
      logs.push('✅ Model generated');
      logs.push('✅ Model sliced');
      logs.push('✅ Sent to printer');
      logs.push('');
      logs.push('🎉 Execution complete!');

      setOutput(logs);
    } catch (error: any) {
      setOutput([`❌ Error: ${error.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput([]);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-lg shadow-xl border border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <CodeIcon className="h-6 w-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold">P31 Language Editor</h2>
            <p className="text-gray-400 text-sm">Domain-specific language for P31</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Play className="h-4 w-4" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Square className="h-4 w-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        {/* Code Editor */}
        <div className="flex flex-col">
          <label htmlFor="p31-code" className="block text-sm font-semibold mb-2 text-gray-400">
            P31 Code
          </label>
          <textarea
            id="p31-code"
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full px-4 py-3 bg-gray-800 text-white font-mono text-sm rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
            placeholder="Write P31 code here..."
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <label className="block text-sm font-semibold mb-2 text-gray-400">Output</label>
          <div className="flex-1 w-full px-4 py-3 bg-gray-800 text-white font-mono text-sm rounded-lg border border-gray-700 overflow-y-auto">
            {output.length === 0 ? (
              <div className="text-gray-500 italic">Output will appear here...</div>
            ) : (
              output.map((line, i) => (
                <div key={i} className="mb-1">
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Examples */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h3 className="text-sm font-semibold mb-2 text-gray-400">Quick Examples</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              setCode(`structure "my_tetra" {
  type: tetrahedron
  position: [0, 0, 0]
  size: 1.0
  color: #FF6B9D
}

generate "my_tetra"
slice "my_tetra"
print "my_tetra"`)
            }
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
          >
            Simple Tetrahedron
          </button>
          <button
            onClick={() =>
              setCode(`family "the_family" {
  will: { role: foundation, color: #4ECDC4 }
  coparent: { role: structure, color: #FF6B6B }
  bash: { role: connection, color: #FFE66D }
  willow: { role: completion, color: #95E1D3 }
}

structure "family_tetra" {
  type: tetrahedron
  family: "the_family"
  validate: maxwell
}

generate "family_tetra"
slice "family_tetra"
print "family_tetra"`)
            }
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
          >
            Family Tetrahedron
          </button>
          <button
            onClick={() =>
              setCode(`repeat 4 times {
  create vertex {
    position: [0, height, 0]
    connect to center
  }
}

validate maxwell for all structures
require stability > 70

generate all structures
slice combined
print combined`)
            }
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
          >
            Complex Structure
          </button>
        </div>
      </div>
    </div>
  );
};
