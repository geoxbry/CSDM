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
    e.evt.stopPropagation();
    // Change the cursor to indicate droppable
    document.body.style.cursor = 'copy';
  };

  const handleDragLeave = (e: KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();
    e.evt.stopPropagation();
    document.body.style.cursor = 'default';
  };

  const handleDrop = (e: KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();
    e.evt.stopPropagation();
    document.body.style.cursor = 'default';

    const data = e.evt.dataTransfer?.getData("text/plain");
    if (data) {
      try {
        const object = JSON.parse(data);
        onDrop(object.id, zone.id);
      } catch (err) {
        console.error("Failed to parse dropped object data:", err);
      }
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
        stroke="rgba(0,0,0,0.2)"
        strokeWidth={2}
        cornerRadius={8}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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