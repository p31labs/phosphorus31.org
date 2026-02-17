/**
 * Art Area - Creative Space for Young Artists
 *
 * A beautiful, accessible drawing and painting canvas.
 * Built with love and light. As above, so below. 💜
 *
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 * Licensed under the AGPLv3 License
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ArtArea.css';

interface Artwork {
  id: string;
  name: string;
  data: string; // base64 image data
  createdAt: string;
}

interface BrushSettings {
  size: number;
  color: string;
  opacity: number;
}

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B739',
  '#52BE80',
  '#EC7063',
  '#5DADE2',
  '#F1948A',
  '#82E0AA',
  '#F9E79F',
  '#000000',
  '#FFFFFF',
  '#808080',
  '#FFD700',
  '#FF1493',
];

const BRUSH_SIZES = [2, 5, 10, 15, 20, 30, 40];

export function ArtArea() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brush, setBrush] = useState<BrushSettings>({
    size: 10,
    color: '#FF6B6B',
    opacity: 1.0,
  });
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [currentArtworkName, setCurrentArtworkName] = useState('My Artwork');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Load saved artworks
  useEffect(() => {
    const saved = localStorage.getItem('artArea_artworks');
    if (saved) {
      try {
        setArtworks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load artworks', e);
      }
    }
  }, []);

  // Save artworks
  useEffect(() => {
    if (artworks.length > 0) {
      localStorage.setItem('artArea_artworks', JSON.stringify(artworks));
    }
  }, [artworks]);

  // Show notification
  const showNotification = useCallback(
    (message: string, type: 'success' | 'info' | 'error' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    },
    []
  );

  // Save canvas state to history
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(dataURL);
      return newHistory.slice(-20); // Keep last 20 states
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 19));
  }, [historyIndex]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
    setShowClearConfirm(false);
    showNotification('Canvas cleared!', 'info');
  }, [saveToHistory, showNotification]);

  // Resize canvas on window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        const newWidth = rect.width - 40;
        const newHeight = rect.height - 200;

        // Save current content
        const currentData = canvas.toDataURL('image/png');

        // Resize canvas
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Restore content
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = currentData;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width - 40;
      canvas.height = rect.height - 200;
    } else {
      canvas.width = 800;
      canvas.height = 600;
    }

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Smooth drawing
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Save initial state
    const initialData = canvas.toDataURL('image/png');
    setHistory([initialData]);
    setHistoryIndex(0);
  }, []);

  // Save artwork
  const saveArtwork = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!currentArtworkName.trim()) {
      showNotification('Please enter an artwork name!', 'error');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const dataURL = canvas.toDataURL('image/png');
      const newArtwork: Artwork = {
        id: Date.now().toString(),
        name: currentArtworkName.trim(),
        data: dataURL,
        createdAt: new Date().toISOString(),
      };

      setArtworks((prev) => [...prev, newArtwork]);
      setIsSaving(false);
      showNotification(`Saved: ${currentArtworkName}! 💜`, 'success');
    }, 300);
  }, [currentArtworkName, showNotification]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (historyIndex > 0) {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          const newIndex = historyIndex - 1;
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            setHistoryIndex(newIndex);
          };
          img.src = history[newIndex];
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          const newIndex = historyIndex + 1;
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            setHistoryIndex(newIndex);
          };
          img.src = history[newIndex];
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveArtwork();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, historyIndex, saveArtwork]);

  // Drawing functions
  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      lastPointRef.current = { x, y };
      ctx.beginPath();
      ctx.moveTo(x, y);
    },
    []
  );

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const currentX = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const currentY = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      ctx.strokeStyle = brush.color;
      ctx.lineWidth = brush.size;
      ctx.globalAlpha = brush.opacity;

      // Smooth line drawing using quadratic curves
      if (lastPointRef.current) {
        const midX = (lastPointRef.current.x + currentX) / 2;
        const midY = (lastPointRef.current.y + currentY) / 2;

        ctx.beginPath();
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.quadraticCurveTo(lastPointRef.current.x, lastPointRef.current.y, midX, midY);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
      }

      lastPointRef.current = { x: currentX, y: currentY };
    },
    [isDrawing, brush]
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    setIsDrawing(false);
    lastPointRef.current = null;

    // Save to history after drawing
    setTimeout(() => saveToHistory(), 100);
  }, [isDrawing, saveToHistory]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndex - 1;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryIndex(newIndex);
    };
    img.src = history[newIndex];
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndex + 1;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryIndex(newIndex);
    };
    img.src = history[newIndex];
  }, [history, historyIndex]);

  // Load artwork
  const loadArtwork = useCallback(
    (artwork: Artwork) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setCurrentArtworkName(artwork.name);
        setShowGallery(false);
        showNotification(`Loaded: ${artwork.name}!`, 'success');

        // Update history
        const dataURL = canvas.toDataURL('image/png');
        setHistory([dataURL]);
        setHistoryIndex(0);
      };
      img.src = artwork.data;
    },
    [showNotification]
  );

  // Download artwork
  const downloadArtwork = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${currentArtworkName || 'artwork'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showNotification('Artwork downloaded! 💜', 'success');
  }, [currentArtworkName, showNotification]);

  return (
    <div className="art-area">
      <div className="art-area-header">
        <h1>🎨 Art Area 💜</h1>
        <p className="art-area-subtitle">Create beautiful art with love and light</p>
      </div>

      <div className="art-area-controls">
        {/* Color Palette */}
        <div className="color-palette">
          <label>Colors:</label>
          <div className="color-grid">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`color-button ${brush.color === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setBrush((prev) => ({ ...prev, color }))}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Brush Size */}
        <div className="brush-controls">
          <label>Brush Size:</label>
          <div className="brush-sizes">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                className={`brush-size-button ${brush.size === size ? 'active' : ''}`}
                onClick={() => setBrush((prev) => ({ ...prev, size }))}
                aria-label={`Brush size ${size}`}
              >
                <div
                  className="brush-preview"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: brush.color,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="art-actions">
          <button
            className="art-button undo-button"
            onClick={undo}
            disabled={historyIndex <= 0}
            aria-label="Undo"
          >
            ↶ Undo
          </button>
          <button
            className="art-button redo-button"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            aria-label="Redo"
          >
            ↷ Redo
          </button>
          <button
            className="art-button clear-button"
            onClick={() => setShowClearConfirm(true)}
            aria-label="Clear canvas"
          >
            🗑️ Clear
          </button>
          <button
            className="art-button save-button"
            onClick={saveArtwork}
            disabled={isSaving}
            aria-label="Save artwork"
          >
            {isSaving ? '⏳ Saving...' : '💾 Save'}
          </button>
          <button
            className="art-button gallery-button"
            onClick={() => setShowGallery(!showGallery)}
            aria-label="Toggle gallery"
          >
            🖼️ Gallery ({artworks.length})
          </button>
          <button
            className="art-button download-button"
            onClick={downloadArtwork}
            aria-label="Download artwork"
          >
            ⬇️ Download
          </button>
        </div>

        {/* Artwork Name */}
        <div className="artwork-name-input">
          <label>Artwork Name:</label>
          <input
            type="text"
            value={currentArtworkName}
            onChange={(e) => setCurrentArtworkName(e.target.value)}
            placeholder="My Artwork"
            className="name-input"
          />
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="art-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          aria-label="Drawing canvas"
        />
      </div>

      {/* Clear Confirmation */}
      {showClearConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h3>Clear Canvas?</h3>
            <p>This will erase everything on the canvas. This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="confirm-button cancel" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-button confirm" onClick={clearCanvas}>
                Clear Canvas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Gallery */}
      {showGallery && (
        <div className="art-gallery">
          <div className="gallery-header">
            <h2>Your Art Gallery 💜</h2>
            <button
              className="close-gallery"
              onClick={() => setShowGallery(false)}
              aria-label="Close gallery"
            >
              ✕
            </button>
          </div>
          <div className="gallery-grid">
            {artworks.length === 0 ? (
              <p className="no-artworks">No artworks yet. Start creating! 🎨</p>
            ) : (
              artworks.map((artwork) => (
                <div key={artwork.id} className="gallery-item">
                  <img
                    src={artwork.data}
                    alt={artwork.name}
                    onClick={() => loadArtwork(artwork)}
                    className="gallery-thumbnail"
                  />
                  <div className="gallery-item-info">
                    <p className="gallery-item-name">{artwork.name}</p>
                    <p className="gallery-item-date">
                      {new Date(artwork.createdAt).toLocaleDateString()}
                    </p>
                    <div className="gallery-item-actions">
                      <button onClick={() => loadArtwork(artwork)} className="gallery-button">
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${artwork.name}"?`)) {
                            setArtworks((prev) => prev.filter((a) => a.id !== artwork.id));
                            showNotification('Artwork deleted', 'info');
                          }
                        }}
                        className="gallery-button delete"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="art-area-footer">
        <p>💜 With love and light. As above, so below. 💜</p>
        <p>The Mesh Holds. 🔺</p>
      </div>
    </div>
  );
}

export default ArtArea;
