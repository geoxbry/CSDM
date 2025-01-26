import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import GameCanvas from "@/components/canvas/GameCanvas";
import ObjectPanel from "@/components/sidebar/ObjectPanel";
import type { Placement, ValidationResult, Zone, GameObject, Scenario } from "@/types/game";
import { useState } from "react";

interface ScenarioResponse {
  scenario: Scenario;
  zones: Zone[];
  objects: GameObject[];
}

export default function Game() {
  const { toast } = useToast();
  const [placedObjects, setPlacedObjects] = useState<Set<number>>(new Set());

  const { data, isLoading } = useQuery<ScenarioResponse>({
    queryKey: ["/api/scenario/1"], // TODO: Make dynamic
  });

  const validateMutation = useMutation({
    mutationFn: async (placements: Placement[]) => {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placements }),
      });
      return res.json();
    },
    onSuccess: (data: { score: number; results: ValidationResult[] }) => {
      const allCorrect = data.results.every((r) => r.correct);

      toast({
        title: allCorrect ? "Perfect!" : "Not quite right",
        description: `Score: ${data.score} points`,
        variant: allCorrect ? "default" : "destructive",
      });
    },
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  const handlePlacementsChange = (placements: Placement[]) => {
    setPlacedObjects(new Set(placements.map(p => p.objectId)));
  };

  const handleDragStart = (objectId: number) => {
    setPlacedObjects(prev => new Set([...prev, objectId]));
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-muted/50">
        <ObjectPanel 
          objects={data.objects}
          placedObjects={placedObjects}
          onDragStart={handleDragStart}
        />
      </aside>

      <main className="flex-1 p-6">
        <GameCanvas
          zones={data.zones}
          objects={data.objects}
          onValidate={(placements) => {
            validateMutation.mutate(placements);
            handlePlacementsChange(placements);
          }}
        />
      </main>
    </div>
  );
}