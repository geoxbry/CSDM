import { Stage, Layer } from "react-konva";
import { useState, useCallback, useMemo } from "react";
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
    // Check if the zone already has an object
    const zoneHasObject = Array.from(placements.entries()).some(([_, zone]) => zone === zoneId);
    if (zoneHasObject) {
      return; // Don't allow the drop if zone is occupied
    }

    setPlacements(prev => {
      const newPlacements = new Map(prev);
      newPlacements.set(objectId, zoneId);
      return newPlacements;
    });
  }, [placements]);

  const handleDragStart = useCallback((objectId: number) => {
    setDraggedObject(objectId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedObject(null);
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
    <div 
      className="relative w-full h-full bg-background/50" 
      style={{ touchAction: 'none' }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
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
              onRemove={handleRemoveObject}
              placement={placements.get(obj.id)}
              zones={zones}
            />
          ))}
        </Layer>
      </Stage>

      <button
        className={`absolute bottom-4 right-4 px-6 py-3 rounded-lg font-medium
          ${placedObjects.length === objects.length
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        disabled={placedObjects.length !== objects.length}
        onClick={handleValidate}
      >
        Check Answer
      </button>
    </div>
  );
}