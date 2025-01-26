import { useState } from "react";
import { useDrop } from 'react-dnd';
import type { Zone, GameObject, Placement } from "@/types/game";

interface GameCanvasProps {
  zones: Zone[];
  objects: GameObject[];
  placements: Map<number, number>;
  onObjectPlace: (objectId: number, zoneId: number) => void;
  onObjectRemove: (objectId: number) => void;
  onValidate: (placements: Placement[]) => void;
}

interface DropZoneProps {
  zone: Zone;
  onDrop: (objectId: number, zoneId: number) => void;
  children?: React.ReactNode;
}

const DropZone = ({ zone, onDrop, children }: DropZoneProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'gameObject',
    drop: (item: { id: number }) => {
      onDrop(item.id, zone.id);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`absolute border-2 rounded-lg transition-colors ${
        isOver ? 'border-primary bg-primary/10' : 'border-gray-300'
      }`}
      style={{
        left: zone.x,
        top: zone.y,
        width: zone.width,
        height: zone.height,
      }}
    >
      <div className="absolute -top-8 left-0 w-full text-center font-semibold">
        {zone.name}
      </div>
      {children}
      <div className="absolute -bottom-8 left-0 w-full text-center text-xs text-muted-foreground">
        Double click to return to sidebar
      </div>
    </div>
  );
};

const PlacedObject = ({ object, onRemove }: { object: GameObject; onRemove: () => void }) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center bg-white rounded border shadow-sm cursor-pointer hover:bg-gray-50"
      onDoubleClick={onRemove}
    >
      <div className="text-center">
        <p className="font-medium">{object.name}</p>
        <p className="text-sm text-muted-foreground">{object.objectType}</p>
      </div>
    </div>
  );
};

export default function GameCanvas({ 
  zones, 
  objects, 
  placements,
  onObjectPlace,
  onObjectRemove,
  onValidate 
}: GameCanvasProps) {
  const handleValidate = () => {
    const placementArray = Array.from(placements.entries()).map(([objectId, zoneId]) => ({
      objectId,
      zoneId,
    }));
    onValidate(placementArray);
  };

  return (
    <div className="relative w-full h-full bg-background/50">
      {zones.map(zone => {
        const placedObjectId = Array.from(placements.entries())
          .find(([_, zoneId]) => zoneId === zone.id)?.[0];
        const placedObject = placedObjectId !== undefined
          ? objects.find(obj => obj.id === placedObjectId)
          : undefined;

        return (
          <DropZone key={zone.id} zone={zone} onDrop={onObjectPlace}>
            {placedObject && (
              <PlacedObject 
                object={placedObject} 
                onRemove={() => onObjectRemove(placedObject.id)}
              />
            )}
          </DropZone>
        );
      })}

      <button
        className="absolute bottom-4 right-4 px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90"
        onClick={handleValidate}
      >
        Check Answer
      </button>
    </div>
  );
}