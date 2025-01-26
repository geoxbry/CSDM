import { Stage, Layer } from "react-konva";
import { useState } from "react";
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

  const handleDrop = (objectId: number, zoneId: number) => {
    console.log(`Dropping object ${objectId} into zone ${zoneId}`);
    setPlacements(prev => {
      const newPlacements = new Map(prev);
      newPlacements.set(objectId, zoneId);
      return newPlacements;
    });
  };

  const handleValidate = () => {
    const placementArray = Array.from(placements.entries()).map(([objectId, zoneId]) => ({
      objectId,
      zoneId
    }));
    onValidate(placementArray);
  };

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
              onDragStart={() => {
                console.log('Drag started:', obj.id);
                setDraggedObject(obj.id);
              }}
              onDragEnd={() => {
                console.log('Drag ended:', obj.id);
                setDraggedObject(null);
              }}
              onRemove={(id) => {
                console.log('Removing object:', id);
                setPlacements(prev => {
                  const newPlacements = new Map(prev);
                  newPlacements.delete(id);
                  return newPlacements;
                });
              }}
              placement={placements.get(obj.id)}
              zones={zones}
            />
          ))}
        </Layer>
      </Stage>

      <button
        className="absolute bottom-4 right-4 px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90"
        onClick={handleValidate}
      >
        Check Answer
      </button>
    </div>
  );
}