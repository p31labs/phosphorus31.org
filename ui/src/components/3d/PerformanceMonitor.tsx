import React, { useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import Stats from 'three/examples/jsm/libs/stats.module.js';

interface PerformanceStats {
  fps: number;
  memory: {
    used: number;
    total: number;
    limit: number;
  };
  render: {
    calls: number;
    triangles: number;
    points: number;
    lines: number;
  };
}

const PerformanceMonitor: React.FC = () => {
  const { gl, scene, camera } = useThree();
  const [stats, setStats] = useState<Stats | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceStats>({
    fps: 0,
    memory: { used: 0, total: 0, limit: 0 },
    render: { calls: 0, triangles: 0, points: 0, lines: 0 },
  });

  useEffect(() => {
    const statsInstance = new Stats();
    statsInstance.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(statsInstance.dom);
    setStats(statsInstance);

    return () => {
      document.body.removeChild(statsInstance.dom);
    };
  }, []);

  useFrame(() => {
    if (stats) {
      stats.begin();

      // Update performance data
      const rendererInfo = gl.info;
      setPerformanceData({
        fps: Math.round(stats.domElement.children[0].textContent?.replace('FPS', '') || 0),
        memory: {
          used: rendererInfo.memory.geometries,
          total: rendererInfo.memory.textures,
          limit: 0, // Would need to be calculated based on device
        },
        render: {
          calls: rendererInfo.render.calls,
          triangles: rendererInfo.render.triangles,
          points: rendererInfo.render.points,
          lines: rendererInfo.render.lines,
        },
      });

      stats.end();
    }
  });

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Html transform={false} style={{ position: 'fixed', top: 16, left: 16, zIndex: 1000 }} center={false}>
      <div className="bg-black bg-opacity-50 text-white p-2 rounded text-xs font-mono">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div>FPS: {performanceData.fps}</div>
            <div>Memory: {performanceData.memory.used}M</div>
          </div>
          <div>
            <div>Calls: {performanceData.render.calls}</div>
            <div>Tris: {performanceData.render.triangles}</div>
          </div>
        </div>
      </div>
    </Html>
  );
};

export default PerformanceMonitor;
