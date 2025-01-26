import { Stage, Layer } from "react-konva";
import { useState } from "react";
import type { Zone, GameObject, Placement } from "@/types/game";
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

  const handleDrop = (e: React.DragEvent, zoneId: number) => {
    e.preventDefault();
    console.log('Drop event on HTML zone:', zoneId);

    try {
      const data = e.dataTransfer.getData("application/json");
      console.log('Received drop data:', data);

      if (data) {
        const { id } = JSON.parse(data);
        console.log('Parsed object ID:', id);
        setPlacements(prev => {
          const newPlacements = new Map(prev);
          newPlacements.set(id, zoneId);
          return newPlacements;
        });
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
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
      {/* HTML Drop Zones overlaying the canvas */}
      {zones.map(zone => (
        <div
          key={zone.id}
          className={`absolute border-2 rounded-lg transition-colors ${
            draggedObject ? 'border-primary bg-primary/10' : 'border-gray-300'
          }`}
          style={{
            left: zone.x,
            top: zone.y,
            width: zone.width,
            height: zone.height,
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(e) => handleDrop(e, zone.id)}
        >
          <div className="absolute -top-8 left-0 w-full text-center font-semibold">
            {zone.name}
          </div>
        </div>
      ))}

      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
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