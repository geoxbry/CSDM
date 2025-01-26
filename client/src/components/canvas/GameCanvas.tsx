import { Stage, Layer } from "react-konva";
import { useState, useCallback } from "react";
import type { Zone, GameObject, Placement } from "@/types/game";
import DropZone from "./DropZone";
import DraggableObject from "./DraggableObject";

interface GameCanvasProps {
  zones: Zone[];
  objects: GameObject[];
  onValidate: (placements: Placement[]) => void;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

export default function GameCanvas({ zones, objects, onValidate }: GameCanvasProps) {
  const [placements, setPlacements] = useState<Map<number, number>>(new Map());
  const [draggedObject, setDraggedObject] = useState<number | null>(null);

  const handleDrop = useCallback((objectId: number, zoneId: number) => {
    setPlacements(prev => {
      const newPlacements = new Map(prev);

      // Check if another object is in this zone
      for (const [existingObjId, existingZoneId] of Array.from(newPlacements.entries())) {
        if (existingZoneId === zoneId) {
          // If so, remove it first
          newPlacements.delete(existingObjId);
        }
      }

      // Place the new object
      newPlacements.set(objectId, zoneId);
      return newPlacements;
    });
  }, []);

  const handleRemoveObject = useCallback((objectId: number) => {
    setPlacements(prev => {
      const newPlacements = new Map(prev);
      newPlacements.delete(objectId);
      return newPlacements;
    });
  }, []);

  const handleValidate = () => {
    const placementArray = Array.from(placements.entries()).map(([objectId, zoneId]) => ({
      objectId,
      zoneId
    }));
    onValidate(placementArray);
  };

  // Only render objects that have been placed on the canvas
  const placedObjects = objects.filter(obj => placements.has(obj.id));

  return (
    <div className="relative w-full h-full bg-background/50">
      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {zones.map(zone => (
            <DropZone
              key={zone.id}
              zone={zone}
              isActive={draggedObject !== null}
              onDrop={handleDrop}
            />
          ))}

          {placedObjects.map(obj => (
            <DraggableObject
              key={obj.id}
              object={obj}
              onDragStart={() => setDraggedObject(obj.id)}
              onDragEnd={() => setDraggedObject(null)}
              onRemove={handleRemoveObject}
              placement={placements.get(obj.id)}
              zones={zones}
            />
          ))}
        </Layer>
      </Stage>

      <button
        className={`absolute bottom-4 right-4 px-6 py-3 rounded-lg font-medium
          ${placedObjects.length > 0
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        disabled={placedObjects.length === 0}
        onClick={handleValidate}
      >
        Check Answer
      </button>
    </div>
  );
}