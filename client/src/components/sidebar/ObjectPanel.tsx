import { Card } from "@/components/ui/card";
import { useDrag } from 'react-dnd';
import type { GameObject } from "@/types/game";

interface ObjectPanelProps {
  objects: GameObject[];
  placedObjects: Set<number>;
}

interface DraggableItemProps {
  object: GameObject;
  isPlaced: boolean;
}

const DraggableItem = ({ object, isPlaced }: DraggableItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'gameObject',
    item: { id: object.id, type: object.objectType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isPlaced
  }));

  return (
    <div
      ref={drag}
      className={`p-3 bg-card border rounded-lg select-none transition-opacity
        ${isPlaced ? 'opacity-50 cursor-not-allowed' : 'cursor-move hover:bg-accent/50'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <p className="font-medium">{object.name}</p>
      <p className="text-sm text-muted-foreground">{object.objectType}</p>
    </div>
  );
};

export default function ObjectPanel({ objects, placedObjects }: ObjectPanelProps) {
  return (
    <div className="w-64 h-full bg-background border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Available Objects</h2>
        <div className="space-y-2">
          {objects.map(obj => (
            <DraggableItem 
              key={obj.id}
              object={obj}
              isPlaced={placedObjects.has(obj.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}