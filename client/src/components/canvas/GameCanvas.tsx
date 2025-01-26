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

  // Create a Set of placed object IDs for efficient lookup
  const placedObjectIds = useMemo(() => new Set(placements.keys()), [placements]);

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
      onDrop={(e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("text/plain");
        try {
          const obj = JSON.parse(data);
          // Find the closest zone to the drop point
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          let closestZone = zones[0];
          let minDistance = Number.MAX_VALUE;

          zones.forEach(zone => {
            const centerX = zone.x + zone.width / 2;
            const centerY = zone.y + zone.height / 2;
            const distance = Math.sqrt(
              Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              closestZone = zone;
            }
          });

          // Check if the closest zone already has an object
          const zoneHasObject = Array.from(placements.entries()).some(
            ([_, zone]) => zone === closestZone.id
          );

          if (!zoneHasObject) {
            handleDrop(obj.id, closestZone.id);
          }
        } catch (err) {
          console.error("Failed to parse dropped object data:", err);
        }
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