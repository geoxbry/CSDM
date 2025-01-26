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
  };

  const handleDrop = (e: KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();
    const objectId = e.evt.dataTransfer?.getData("text/plain");
    if (objectId) {
      onDrop(parseInt(objectId, 10), zone.id);
    }
  };

  return (
    <Group>
      <Rect
        x={zone.x}
        y={zone.y}
        width={zone.width}
        height={zone.height}
        fill={isActive ? "rgba(0,0,0,0.05)" : "transparent"}
        stroke={isActive ? "#000" : "#ddd"}
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