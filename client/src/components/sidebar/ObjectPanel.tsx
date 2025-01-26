import { Card } from "@/components/ui/card";
import type { GameObject } from "@/types/game";
import { useCallback } from "react";

interface ObjectPanelProps {
  objects: GameObject[];
  placedObjects: Set<number>;
  onDragStart: (objectId: number) => void;
}

export default function ObjectPanel({ objects, placedObjects, onDragStart }: ObjectPanelProps) {
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, obj: GameObject) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("application/x-game-object", JSON.stringify(obj));
    onDragStart(obj.id);
  }, [onDragStart]);

  const availableObjects = objects.filter(obj => !placedObjects.has(obj.id));

  return (
    <div className="w-64 h-full bg-background border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Available Objects</h2>
        <div className="space-y-2">
          {availableObjects.map(obj => (
            <div
              key={obj.id}
              className="p-3 bg-card border rounded-lg cursor-move hover:bg-accent/50 select-none"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, obj)}
            >
              <p className="font-medium">{obj.name}</p>
              <p className="text-sm text-muted-foreground">{obj.objectType}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}