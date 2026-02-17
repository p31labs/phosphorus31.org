import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera, Float } from '@react-three/drei';
import useAudioFeedback from './useAudioFeedback.jsx';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import IVMGrid from './components/IVMGrid';

const GOOGLE_CLIENT_ID = '1036541899634-3toas1dve2qqusjt63oqm7m5cb63sd44.apps.googleusercontent.com';
const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwoS5o_PXa-PgZdJBC7Bzh5FN2xZCVhQ4HNaFPnqiJuJvqYYhRpqRwKfOEHBNZxrBo/exec';

// Utility for making authenticated calls to Google Apps Script
const appsScriptApi = (accessToken) => {
  return {
    listGameFiles: async () => {
      const response = await fetch(`${APPS_SCRIPT_WEB_APP_URL}?action=listGameFiles`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error('Failed to list game files');
      return response.json();
    },
    loadGameFile: async (fileId) => {
      const response = await fetch(`${APPS_SCRIPT_WEB_APP_URL}?action=loadGameFile&fileId=${fileId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error('Failed to load game file');
      return response.json();
    },
    saveGameFile: async (fileName, content, fileId = null) => {
      const params = new URLSearchParams({
        action: 'saveGameFile',
        fileName: fileName,
      });
      if (fileId) params.append('fileId', fileId);

      const response = await fetch(`${APPS_SCRIPT_WEB_APP_URL}?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'text/plain', // Apps Script expects text/plain for raw POST data
        },
        body: JSON.stringify(content),
      });
      if (!response.ok) throw new Error('Failed to save game file');
      return response.json();
    },
  };
};

export default function Dashboard() {
  const [coherence, setCoherence] = useState(1.0);
  const [valence, setValence] = useState(0.0);
  const [summary, setSummary] = useState("Awaiting first telemetry batch...");
  const [status, setStatus] = useState("DISCONNECTED");
  const [log, setLog] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showTribute, setShowTribute] = useState(true);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // Google OAuth Access Token
  const [ivmState, setIvmState] = useState([]); // State to hold the IVM tetrahedron data
  const [savedFiles, setSavedFiles] = useState([]); // State to hold list of saved files
  const [selectedFileId, setSelectedFileId] = useState(null); // State for selected file to load
  const [urgencyScore, setUrgencyScore] = useState(0); // Cognitive Payload: Urgency Score
  const [cognitiveCost, setCognitiveCost] = useState(0); // Cognitive Payload: Cognitive Cost
  const [showWorkbench, setShowWorkbench] = useState(false); // State to toggle workbench visibility

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setAccessToken(codeResponse.access_token);
      fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${codeResponse.access_token}`)
        .then((res) => res.json())
        .then((data) => setUser(data));
      addLog("Logged in with Google");
    },
    onError: (error) => addLog(`Google Login Failed: ${error}`),
    scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file", // Request Drive access
  });

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setSavedFiles([]); // Clear saved files on logout
    setSelectedFileId(null); // Clear selected file on logout
    addLog("Logged out");
  }, [addLog]);

  const saveIVMState = useCallback(async () => {
    if (!accessToken) {
      addLog("Login to Google Drive to save.");
      return;
    }
    const fileName = prompt("Enter a filename for your IVM state:");
    if (!fileName) {
      addLog("Save cancelled.");
      return;
    }
    try {
      addLog(`Saving "${fileName}.json"...`);
      await appsScriptApi(accessToken).saveGameFile(fileName, ivmState);
      addLog(`"${fileName}.json" saved successfully.`);
      // Refresh the list of saved files after saving
      listAndLoadGameFiles();
    } catch (error) {
      addLog(`Failed to save IVM state: ${error.message}`);
      console.error("Save IVM State Error:", error);
    }
  }, [accessToken, ivmState, addLog, listAndLoadGameFiles]);

  const listAndLoadGameFiles = useCallback(async () => {
    if (!accessToken) {
      setSavedFiles([]); // Clear files if not logged in
      return;
    }
    try {
      addLog("Fetching saved IVM states...");
      const files = await appsScriptApi(accessToken).listGameFiles();
      setSavedFiles(files);
      addLog(`Found ${files.length} saved IVM states.`);
    } catch (error) {
      addLog(`Failed to list game files: ${error.message}`);
      console.error("List Game Files Error:", error);
    }
  }, [accessToken, addLog]);

  const loadSelectedIVMState = useCallback(async () => {
    if (!accessToken || !selectedFileId) {
      addLog("Please login and select a file to load.");
      return;
    }
    try {
      addLog(`Loading file ID: ${selectedFileId}...`);
      const content = await appsScriptApi(accessToken).loadGameFile(selectedFileId);
      setIvmState(content); // Update the IVM state with loaded data
      addLog(`IVM state loaded from file ID: ${selectedFileId}.`);
    } catch (error) {
      addLog(`Failed to load IVM state: ${error.message}`);
      console.error("Load IVM State Error:", error);
    }
  }, [accessToken, selectedFileId, addLog, setIvmState]);

  // Functions to trigger Apps Script Protocols
  const runAppsScriptProtocol = useCallback(async (actionName, successMessage, errorMessage) => {
    if (!accessToken) {
      addLog("Login to Google Drive to run protocols.");
      return;
    }
    try {
      addLog(`Initiating Apps Script action: ${actionName}...`);
      const response = await fetch(`${APPS_SCRIPT_WEB_APP_URL}?action=${actionName}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Unknown error from Apps Script');
      }
      addLog(successMessage);
    } catch (error) {
      addLog(`${errorMessage}: ${error.message}`);
      console.error(`${actionName} Error:`, error);
    }
  }, [accessToken, addLog]);

  const runGenesisProtocol = useCallback(() => {
    runAppsScriptProtocol(
      "genesisProtocol",
      "Genesis Protocol initiated successfully!",
      "Failed to initiate Genesis Protocol"
    );
  }, [runAppsScriptProtocol]);

  const runDailyHeartbeat = useCallback(() => {
    runAppsScriptProtocol(
      "dailyHeartbeat",
      "Daily Heartbeat executed.",
      "Failed to run Daily Heartbeat"
    );
  }, [runAppsScriptProtocol]);

  const runCheckMedications = useCallback(() => {
    runAppsScriptProtocol(
      "checkMedications",
      "Medication check initiated.",
      "Failed to initiate medication check"
    );
  }, [runAppsScriptProtocol]);

  const runCognitiveShieldScan = useCallback(() => {
    runAppsScriptProtocol(
      "cognitiveShieldScan",
      "Cognitive Shield scan initiated.",
      "Failed to initiate Cognitive Shield scan"
    );
  }, [runAppsScriptProtocol]);

  useEffect(() => {
    if (accessToken) {
      listAndLoadGameFiles();
    } else {
      setSavedFiles([]);
    }
  }, [accessToken, listAndLoadGameFiles]);
  
  const {
    playConnectionTone,
    playDisconnectionTone,
    playUpdateTone,
    playCoherenceTone,
  } = useAudioFeedback();

  const audioEnabledRef = useRef(audioEnabled);
  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
  }, [audioEnabled]);

  const addLog = useCallback((message) => {
    const time = new Date().toLocaleTimeString();
    setLog(prev => [...prev.slice(-9), { time, message }]);
  }, []);

  useEffect(() => {
    const connect = () => {
      const socket = new WebSocket('ws://localhost:8000/ws/mesh');

      socket.onopen = () => {
        setStatus("COHERENT");
        addLog("WebSocket connection established");
        if (audioEnabledRef.current) {
          playConnectionTone();
        }
      };
      socket.onclose = () => {
        setStatus("RECONNECTING");
        addLog("WebSocket connection lost, reconnecting...");
        if (audioEnabledRef.current) {
          playDisconnectionTone();
        }
        setTimeout(connect, 2000);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'BATCH_UPDATE') {
          setCoherence(data.coherence);
          setValence(data.valence);
          setSummary(data.summary);
          setUrgencyScore(data.urgency_score);
          setCognitiveCost(data.cognitive_cost);
          addLog(`Batch update: coherence ${data.coherence.toFixed(3)}, valence ${data.valence.toFixed(3)}, urgency ${data.urgency_score}, cost ${data.cognitive_cost}`);
          if (audioEnabledRef.current) {
            playUpdateTone();
            playCoherenceTone(data.coherence);
          }
        }
      };

      return socket;
    };

    const ws = connect();
    return () => ws.close();
  }, [addLog, playConnectionTone, playDisconnectionTone, playUpdateTone, playCoherenceTone]);

  return (
    <div className="w-full h-screen bg-[#050505] text-white font-mono overflow-hidden relative">
      {showTribute && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(10,10,30,0.97)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFD580', fontFamily: 'Orbitron, sans-serif', letterSpacing: 1.5
        }}>
          <div style={{fontSize: 48, marginBottom: 16, textShadow: '0 0 16px #FFA500'}}>💜 In Loving Honor 💜</div>
          <div style={{fontSize: 28, marginBottom: 12, textAlign: 'center', maxWidth: 600}}>
            This dashboard and game are inspired by the cosmic vision and design brilliance of my nephew.<br/>
            His art, clarity, and heart guide every pixel and every step.<br/>
            <span style={{color:'#FFB347', fontWeight:'bold'}}>Thank you for lighting the way.</span>
          </div>
          <div style={{fontSize: 20, opacity: 0.8, marginBottom: 16}}>
            <span style={{color:'#FFD580'}}>Visual system &amp; cosmic UI by: <b>My Nephew</b></span>
          </div>
          <a
            href="https://music.youtube.com/channel/UCwFqLRsgNmW4S9ES8e5woQA?si=ZI7ht2Q3AiBXIc19"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24,
              padding: '10px 28px', fontSize: 17, borderRadius: 8, border: 'none', background: '#1e1e2f', color: '#FFD580', fontWeight: 'bold', boxShadow: '0 0 8px #FFA500', textDecoration: 'none', transition: 'background 0.2s',
            }}
          >
            <span role="img" aria-label="music">🎵</span> Listen to his music on YouTube
          </a>
          <button onClick={()=>setShowTribute(false)} style={{padding:'12px 32px', fontSize:18, borderRadius:8, border:'none', background:'#FFA500', color:'#222', fontWeight:'bold', boxShadow:'0 0 12px #FFD580', cursor:'pointer'}}>Enter the Cosmos</button>
        </div>
      )}
      {/* 3D Background */}
      <Canvas className="absolute inset-0">
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00f2ff" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <IVMGrid 
            coherence={coherence} 
            ivmState={ivmState} 
            setIvmState={setIvmState} 
            addLog={addLog}
            audioEnabled={audioEnabled}
            playPowerUpTone={playPowerUpTone}
          />
        </Float>
      </Canvas>

      {/* Cognitive Workbench Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-96 bg-black/70 backdrop-blur-md border-l border-cyan-700
          transform transition-transform duration-300 ease-in-out
          ${showWorkbench ? 'translate-x-0' : 'translate-x-full'}
          z-20 p-6 text-white font-mono`}
      >
        <h2 className="text-xl tracking-[0.3em] text-cyan-400 uppercase font-bold mb-4">Cognitive Workbench</h2>
        
        <div className="flex flex-col gap-4">
          <button 
            className="bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            onClick={runGenesisProtocol}
            disabled={!accessToken}
          >
            Initiate Genesis Protocol
          </button>
          <button 
            className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            onClick={runDailyHeartbeat}
            disabled={!accessToken}
          >
            Run Daily Heartbeat
          </button>
          <button 
            className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            onClick={runCheckMedications}
            disabled={!accessToken}
          >
            Check Medications
          </button>
          <button 
            className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            onClick={runCognitiveShieldScan}
            disabled={!accessToken}
          >
            Initiate Cognitive Shield Scan
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-6">More operational controls and AI agent configurations will appear here.</p>
      </div>

      {/* HUD Overlays */}
      <div className="absolute top-10 left-10 z-10 p-6 border-l-4 border-cyan-500 bg-black/40 backdrop-blur-xl">
        <h1 className="text-2xl tracking-[0.4em] text-cyan-400 uppercase font-black">Phenix Viewport</h1>
        <button
          className="text-[8px] text-gray-500 hover:text-gray-300 mt-2 p-1 border border-gray-700 rounded"
          onClick={() => setShowWorkbench(!showWorkbench)}
          title={showWorkbench ? "Close Cognitive Workbench" : "Open Cognitive Workbench"}
        >
          {showWorkbench ? "Close Workbench ✕" : "Open Workbench ⚙️"}
        </button>
        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
          Cognitive Prosthesis // SIC-POVM Mode
        </p>
        <div className="mt-4 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'COHERENT' ? 'bg-cyan-500' : 'bg-red-500'} animate-pulse`} />
          <span className="text-[9px] uppercase">{status}</span>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[9px] text-gray-400 uppercase">Event Log</div>
            <div className="flex items-center gap-2">
              <button 
                className="text-[8px] text-gray-500 hover:text-gray-300"
                onClick={() => setAudioEnabled(!audioEnabled)}
                title={audioEnabled ? "Mute audio feedback" : "Unmute audio feedback"}
              >
                {audioEnabled ? "🔊" : "🔇"}
              </button>
              <button 
                className="text-[8px] text-gray-500 hover:text-gray-300"
                onClick={() => setLog([])}
                title="Clear event log"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="h-24 overflow-y-auto text-[8px] font-mono">
            {log.map((entry, idx) => (
              <div key={idx} className="truncate">
                <span className="text-cyan-400">[{entry.time}]</span> {entry.message}
              </div>
            ))}
          </div>
        </div>

        {/* Google Drive Integration UI */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[9px] text-gray-400 uppercase">Google Drive</div>
            {user ? (
              <button 
                className="text-[8px] text-gray-500 hover:text-gray-300"
                onClick={logout}
                title="Logout from Google Drive"
              >
                Logout ({user.name})
              </button>
            ) : (
              <button 
                className="text-[8px] text-gray-500 hover:text-gray-300"
                onClick={() => login()}
                title="Login with Google Drive"
              >
                Login with Google
              </button>
            )}
          </div>
          {accessToken && (
            <div className="flex flex-col gap-2 mt-2">
              <button 
                className="text-[8px] text-cyan-400 border border-cyan-400 py-1 px-2 rounded hover:bg-cyan-900/50"
                onClick={saveIVMState}
              >
                Save Cognitive Map
              </button>
              <select
                className="text-[8px] text-cyan-400 bg-black/50 border border-cyan-400 py-1 px-2 rounded cursor-pointer"
                value={selectedFileId || ''}
                onChange={(e) => setSelectedFileId(e.target.value)}
              >
                <option value="" disabled>Load Cognitive Map</option>
                {savedFiles.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.name} ({new Date(file.lastUpdated).toLocaleDateString()})
                  </option>
                ))}
              </select>
              <button 
                className="text-[8px] text-cyan-400 border border-cyan-400 py-1 px-2 rounded hover:bg-cyan-900/50"
                onClick={loadSelectedIVMState}
                disabled={!selectedFileId}
              >
                Load Selected Map
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-12 left-10 right-10 z-10 flex justify-between items-end">
        <div className="max-w-xl bg-black/60 p-4 border border-white/10 backdrop-blur-md">
          <div className="text-[9px] text-cyan-500 mb-2 uppercase tracking-tighter">Current Narrative (VPI Protocol)</div>
          <div className="text-sm italic text-gray-200">"{summary}"</div>
        </div>

        <div className="flex gap-12 text-right">
          <div>
            <div className="text-[9px] text-gray-500 uppercase">Coherence ($C$)</div>
            <div className="text-3xl font-black text-cyan-400">{(coherence * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-[9px] text-gray-500 uppercase">Emotional Voltage</div>
            <div className="text-3xl font-black text-red-500">{(valence * 100).toFixed(1)}</div>
          </div>
          <div>
            <div className="text-[9px] text-gray-500 uppercase">Urgency Score</div>
            <div className="text-3xl font-black text-orange-400">{urgencyScore}</div>
          </div>
          <div>
            <div className="text-[9px] text-gray-500 uppercase">Cognitive Cost</div>
            <div className="text-3xl font-black text-blue-400">{cognitiveCost}</div>
          </div>
        </div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="w-full h-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
    </div>
  );
}