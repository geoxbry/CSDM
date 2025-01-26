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
  const [objectPlacements, setObjectPlacements] = useState<Map<number, number>>(new Map());

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

  const handleObjectPlace = (objectId: number, zoneId: number) => {
    // Check if there's already an object in this zone
    const existingObjectId = Array.from(objectPlacements.entries())
      .find(([_, placedZoneId]) => placedZoneId === zoneId)?.[0];

    // If there is, remove it from placements and placed objects
    if (existingObjectId !== undefined) {
      setPlacedObjects(prev => {
        const newPlaced = new Set(prev);
        newPlaced.delete(existingObjectId);
        return newPlaced;
      });
    }

    // Update placements with the new object
    setObjectPlacements(prev => {
      const newPlacements = new Map(prev);
      if (existingObjectId !== undefined) {
        newPlacements.delete(existingObjectId);
      }
      newPlacements.set(objectId, zoneId);
      return newPlacements;
    });

    setPlacedObjects(prev => {
      const newPlaced = new Set(prev);
      newPlaced.add(objectId);
      return newPlaced;
    });
  };

  const handleObjectRemove = (objectId: number) => {
    setObjectPlacements(prev => {
      const newPlacements = new Map(prev);
      newPlacements.delete(objectId);
      return newPlacements;
    });
    setPlacedObjects(prev => {
      const newPlaced = new Set(prev);
      newPlaced.delete(objectId);
      return newPlaced;
    });
  };

  const availableObjects = data.objects.filter(obj => !placedObjects.has(obj.id));

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-muted/50">
        <ObjectPanel 
          objects={availableObjects}
          onObjectPlace={handleObjectPlace}
          onObjectRemove={handleObjectRemove}
          placedObjects={placedObjects}
        />
      </aside>

      <main className="flex-1 p-6">
        <GameCanvas
          zones={data.zones}
          objects={data.objects}
          placements={objectPlacements}
          onObjectPlace={handleObjectPlace}
          onObjectRemove={handleObjectRemove}
          onValidate={(placements) => {
            validateMutation.mutate(placements);
          }}
        />
      </main>
    </div>
  );
}