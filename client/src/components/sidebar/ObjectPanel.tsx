import { Card, CardContent } from "@/components/ui/card";
import type { GameObject } from "@/types/game";

interface ObjectPanelProps {
  objects: GameObject[];
}

export default function ObjectPanel({ objects }: ObjectPanelProps) {
  return (
    <Card className="w-64 h-full">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Objects</h2>
        <div className="space-y-2">
          {objects.map(obj => (
            <div
              key={obj.id}
              className="p-3 bg-card border rounded-lg cursor-move hover:bg-accent/50"
            >
              <p className="font-medium">{obj.name}</p>
              <p className="text-sm text-muted-foreground">{obj.objectType}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
