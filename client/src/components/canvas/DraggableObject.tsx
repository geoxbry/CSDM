import { useRef } from "react";
import { Text, Group, Rect } from "react-konva";
import type { GameObject, Zone } from "@/types/game";

interface DraggableObjectProps {
  object: GameObject;
  onDragStart: () => void;
  onDragEnd: () => void;
  placement?: number;
  zones: Zone[];
}

const OBJECT_WIDTH = 120;
const OBJECT_HEIGHT = 60;

export default function DraggableObject({ 
  object,
  onDragStart,
  onDragEnd,
  placement,
  zones
}: DraggableObjectProps) {
  const groupRef = useRef(null);

  const zone = placement !== undefined 
    ? zones.find(z => z.id === placement)
    : null;

  const x = zone ? zone.x + (zone.width - OBJECT_WIDTH) / 2 : 20;
  const y = zone ? zone.y + (zone.height - OBJECT_HEIGHT) / 2 : 20;

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      width={OBJECT_WIDTH}
      height={OBJECT_HEIGHT}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Rect
        width={OBJECT_WIDTH}
        height={OBJECT_HEIGHT}
        fill="#ffffff"
        stroke="#000000"
        strokeWidth={1}
        cornerRadius={4}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={10}
        shadowOffset={{ x: 2, y: 2 }}
      />
      <Text
        text={object.name}
        width={OBJECT_WIDTH}
        height={OBJECT_HEIGHT}
        align="center"
        verticalAlign="middle"
        fontSize={14}
      />
    </Group>
  );
}
