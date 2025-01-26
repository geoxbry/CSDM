import { Group, Rect, Text } from "react-konva";
import type { Zone } from "@/types/game";
import { KonvaEventObject } from "konva/lib/Node";

interface DropZoneProps {
  zone: Zone;
  isActive: boolean;
  onDrop: (objectId: number, zoneId: number) => void;
}

export default function DropZone({ zone, isActive, onDrop }: DropZoneProps) {
  const handleDragOver = (e: KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();
    if (e.evt.dataTransfer) {
      e.evt.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();
    console.log('Drop event in zone:', zone.id);

    try {
      if (e.evt.dataTransfer) {
        const data = e.evt.dataTransfer.getData("application/json");
        console.log('Drop data:', data);

        if (data) {
          const { id } = JSON.parse(data);
          console.log('Parsed object ID:', id);
          onDrop(id, zone.id);
        }
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  return (
    <Group>
      <Rect
        x={zone.x}
        y={zone.y}
        width={zone.width}
        height={zone.height}
        fill={isActive ? "rgba(0,0,0,0.1)" : "transparent"}
        stroke="#000"
        strokeWidth={2}
        cornerRadius={8}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <Text
        x={zone.x}
        y={zone.y - 24}
        width={zone.width}
        height={20}
        text={zone.name}
        align="center"
        fontSize={16}
        fontStyle="bold"
      />
    </Group>
  );
}