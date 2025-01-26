import { Card } from "@/components/ui/card";
import type { GameObject } from "@/types/game";

interface ObjectPanelProps {
  objects: GameObject[];
  placedObjects: Set<number>;
  onDragStart: (objectId: number) => void;
}

export default function ObjectPanel({ objects, placedObjects, onDragStart }: ObjectPanelProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, object: GameObject) => {
    console.log('Drag start from sidebar:', object.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("application/json", JSON.stringify({ id: object.id }));
    onDragStart(object.id);
  };

  return (
    <div className="w-64 h-full bg-background border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Available Objects</h2>
        <div className="space-y-2">
          {objects.map(obj => (
            <div
              key={obj.id}
              className="p-3 bg-card border rounded-lg select-none cursor-move hover:bg-accent/50"
              draggable
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