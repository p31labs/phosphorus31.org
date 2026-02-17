#!/usr/bin/env node

/**
 * Simple HTTP server for Sovereign Stack Standalone
 * Solves CORS issues with ES modules in browsers
 */

import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const PORT = 8080;
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

const server = createServer((req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  
  // Handle root path - remove query strings and hash
  let urlPath = req.url.split('?')[0].split('#')[0];
  let filePath = urlPath === '/' ? '/public/index.html' : urlPath;
  
  // Map URLs to files
  if (filePath.startsWith('/src/')) {
    filePath = join(__dirname, filePath);
  } else if (filePath.startsWith('/public/')) {
    filePath = join(__dirname, filePath);
  } else if (filePath.startsWith('/sovereign-stack/')) {
    // Handle imports from digital-self-core components
    // Keep the full path structure: sovereign-stack/digital-self-core/grounding-phase/...
    filePath = join(__dirname, '..', '..', 'sovereign-stack', filePath.replace('/sovereign-stack/', ''));
  } else if (filePath === '/favicon.ico') {
    filePath = join(__dirname, 'public', 'favicon.ico');
  } else {
    filePath = join(__dirname, 'public', filePath);
  }
  
  console.log(`DEBUG: req.url=${req.url} -> filePath=${filePath}`);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(join(__dirname, '..', '..'))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  // Check if file exists
  if (!existsSync(filePath)) {
    // Try with .html extension
    if (!extname(filePath)) {
      filePath += '.html';
    }
    
    if (!existsSync(filePath)) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
  }
  
  // Get file extension and MIME type
  const ext = extname(filePath);
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
  
  try {
    const content = readFileSync(filePath);
    
    // Set CORS headers for ES modules
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    res.end(content);
  } catch (error) {
    console.error(`Error serving ${filePath}:`, error);
    res.writeHead(500);
    res.end('Internal server error');
  }
});

// Handle OPTIONS requests for CORS preflight
server.on('request', (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`💜 Sovereign Stack Standalone Server`);
  console.log(`💜 Simple but fucking POWERFUL. Local. Sovereign.`);
  console.log(`💜 Serving on: http://localhost:${PORT}`);
  console.log(`💜 Open in browser: http://localhost:${PORT}/index.html`);
  console.log(`💜 With neurodivergent love and style.`);
  console.log(`\nPress Ctrl+C to stop the server`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n💜 Shutting down Sovereign Stack server...');
  server.close(() => {
    console.log('💜 Server stopped. Stay sovereign.');
    process.exit(0);
  });
});