import React from 'react';
import ReactDOM from 'react-dom/client';
import { installP31Storage } from './lib/p31-storage';
import { P31Routes } from './routes/P31Routes';
import { WebErrorBoundary } from './components/ErrorBoundary';
import './styles.css';

installP31Storage();
import './styles/accessibility.css';
import './styles/p31-forms.css';
import './styles/molecule-builder.css';

// Import the event bus for cross-module communication
import { GenesisEventBus, EVENTS } from './core/events/bus';

// Browser-safe initialization - skip external modules with broken imports
async function bootstrap() {
  console.log('P31 bootstrapping...');
  console.log('Event bus initialized:', Object.keys(EVENTS).length, 'events');

  // Initialize axe-core for accessibility testing (dev only)
  if (import.meta.env.DEV) {
    try {
      const axe = await import('@axe-core/react');
      axe.default(React, ReactDOM, 1000);
      console.log('✅ Accessibility testing enabled (axe-core)');
    } catch (error) {
      console.warn('⚠️ Could not load axe-core:', error);
    }
  }

  // Mesh adapter: real hardware/bridge when VITE_MESH_WS_URL is set, else simulator in dev
  const meshWsUrl = import.meta.env.VITE_MESH_WS_URL as string | undefined;
  const { setMeshAdapter, createWhaleChannelSimulatorAdapter, createNodeOneWebSocketAdapter } =
    await import('./services/meshAdapter');
  if (meshWsUrl && meshWsUrl.trim() !== '') {
    setMeshAdapter(createNodeOneWebSocketAdapter(meshWsUrl.trim()));
    console.log('✅ Mesh adapter: WebSocket (hardware on board)', meshWsUrl);
  } else if (import.meta.env.DEV) {
    setMeshAdapter(createWhaleChannelSimulatorAdapter());
    console.log('✅ Whale Channel simulator active (Sprout → mesh signals)');
  }

  // Emit bootstrap event
  GenesisEventBus.emit('genesis:bootstrap:complete', { timestamp: Date.now() });

  // Render React app — phosphorus31.org: / = QuantumHelloWorld, /mesh etc. = MeshLayout + views
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <React.StrictMode>
      <WebErrorBoundary>
        <P31Routes />
      </WebErrorBoundary>
    </React.StrictMode>
  );

  console.log('P31 ready');
}

bootstrap();
