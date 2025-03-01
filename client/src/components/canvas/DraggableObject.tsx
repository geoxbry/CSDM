import { useEffect, useRef } from "react";
import { Text, Group, Rect } from "react-konva";
import type { GameObject, Zone } from "@/types/game";

interface DraggableObjectProps {
  object: GameObject;
  onDragStart: () => void;
  onDragEnd: () => void;
  onRemove: (objectId: number) => void;
  placement?: number;
  zones: Zone[];
}

const OBJECT_WIDTH = 120;
const OBJECT_HEIGHT = 60;

export default function DraggableObject({ 
  object,
  onDragStart,
  onDragEnd,
  onRemove,
  placement,
  zones
}: DraggableObjectProps) {
  const groupRef = useRef<any>(null);

  const zone = placement !== undefined 
    ? zones.find(z => z.id === placement)
    : null;

  // Calculate position based on zone or default position
  let position = {
    x: 20,
    y: 20
  };

  if (zone) {
    position = {
      x: zone.x + (zone.width - OBJECT_WIDTH) / 2,
      y: zone.y + (zone.height - OBJECT_HEIGHT) / 2
    };
  }

  useEffect(() => {
    if (groupRef.current && zone) {
      groupRef.current.to({
        x: position.x,
        y: position.y,
        duration: 0.3,
        easing: (t: number) => t * (2 - t)
      });
    }
  }, [zone, position.x, position.y]);

  const handleDoubleClick = () => {
    onRemove(object.id);
  };

  return (
    <Group
      ref={groupRef}
      x={position.x}
      y={position.y}
      width={OBJECT_WIDTH}
      height={OBJECT_HEIGHT}
      draggable
      onDragStart={() => {
        onDragStart();
        document.body.style.cursor = 'grabbing';
      }}
      onDragEnd={() => {
        onDragEnd();
        document.body.style.cursor = 'default';
      }}
      onDblClick={handleDoubleClick}
      onMouseEnter={() => {
        document.body.style.cursor = 'grab';
      }}
      onMouseLeave={() => {
        document.body.style.cursor = 'default';
      }}
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