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
    setPlacements(prev => new Map(prev).set(objectId, zoneId));
  }, []);

  const handleDragStart = useCallback((objectId: number) => {
    setDraggedObject(objectId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedObject(null);
  }, []);

  const handleValidate = () => {
    const placementArray = Array.from(placements.entries()).map(([objectId, zoneId]) => ({
      objectId,
      zoneId
    }));
    onValidate(placementArray);
  };

  const isComplete = placements.size === objects.length;

  // Only render objects that have been placed on the canvas
  const placedObjects = objects.filter(obj => placements.has(obj.id));

  return (
    <div className="relative">
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
              onDragStart={() => handleDragStart(obj.id)}
              onDragEnd={handleDragEnd}
              placement={placements.get(obj.id)}
              zones={zones}
            />
          ))}
        </Layer>
      </Stage>

      <button
        className={`absolute bottom-4 right-4 px-6 py-3 rounded-lg font-medium
          ${isComplete 
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        disabled={!isComplete}
        onClick={handleValidate}
      >
        Check Answer
      </button>
    </div>
  );
}