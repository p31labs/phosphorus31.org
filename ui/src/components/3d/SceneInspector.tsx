import React, { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';

interface SceneObject {
  name: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  visible: boolean;
}

const SceneInspector: React.FC = () => {
  const { scene } = useThree();
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);

  useEffect(() => {
    const updateObjects = () => {
      const newObjects: SceneObject[] = [];

      scene.traverse((object) => {
        if (object.type !== 'Scene' && object.type !== 'Camera') {
          newObjects.push({
            name: object.name || object.uuid,
            type: object.type,
            position: [object.position.x, object.position.y, object.position.z],
            rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
            scale: [object.scale.x, object.scale.y, object.scale.z],
            visible: object.visible,
          });
        }
      });

      setObjects(newObjects);
    };

    updateObjects();
    const interval = setInterval(updateObjects, 1000); // Update every second

    return () => clearInterval(interval);
  }, [scene]);

  const handleObjectSelect = (objectName: string) => {
    setSelectedObject(objectName);
  };

  const handleVisibilityToggle = (objectName: string) => {
    scene.traverse((object) => {
      if (object.name === objectName || object.uuid === objectName) {
        object.visible = !object.visible;
      }
    });
  };

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Html transform={false} style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }} center={false}>
      <div className="bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg max-w-sm max-h-96 overflow-auto">
        <h3 className="text-sm font-bold mb-2 border-b border-gray-600 pb-1">Scene Inspector</h3>

      <div className="space-y-2">
        {objects.map((obj) => (
          <div
            key={obj.name}
            className={`p-2 rounded cursor-pointer transition-colors ${
              selectedObject === obj.name ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => handleObjectSelect(obj.name)}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono">{obj.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVisibilityToggle(obj.name);
                }}
                className={`text-xs px-2 py-1 rounded ${
                  obj.visible ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {obj.visible ? 'Visible' : 'Hidden'}
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              <div>Type: {obj.type}</div>
              <div>
                Pos: ({obj.position[0].toFixed(2)}, {obj.position[1].toFixed(2)},{' '}
                {obj.position[2].toFixed(2)})
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedObject && (
        <div className="mt-4 pt-3 border-t border-gray-600">
          <h4 className="text-xs font-bold mb-2">Selected: {selectedObject}</h4>
          <div className="text-xs space-y-1 text-gray-300">
            <div>
              Position: {objects.find((o) => o.name === selectedObject)?.position.join(', ')}
            </div>
            <div>
              Rotation: {objects.find((o) => o.name === selectedObject)?.rotation.join(', ')}
            </div>
            <div>Scale: {objects.find((o) => o.name === selectedObject)?.scale.join(', ')}</div>
          </div>
        </div>
      )}
      </div>
    </Html>
  );
};

export default SceneInspector;
