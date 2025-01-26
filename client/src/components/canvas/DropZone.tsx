import { Rect, Text } from "react-konva";
import type { Zone } from "@/types/game";

interface DropZoneProps {
  zone: Zone;
  isActive: boolean;
  onDrop: (objectId: number, zoneId: number) => void;
}

export default function DropZone({ zone, isActive, onDrop }: DropZoneProps) {
  return (
    <>
      <Rect
        x={zone.x}
        y={zone.y}
        width={zone.width}
        height={zone.height}
        fill={isActive ? "rgba(0,0,0,0.05)" : "transparent"}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth={2}
        cornerRadius={8}
        onDragEnter={() => {
          // Handle drag enter styling if needed
        }}
        onDragLeave={() => {
          // Handle drag leave styling if needed
        }}
        onDrop={(e) => {
          const objectData = e.dataTransfer?.getData("application/json");
          if (objectData) {
            const object = JSON.parse(objectData);
            onDrop(object.id, zone.id);
          }
        }}
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
    </>
  );
}