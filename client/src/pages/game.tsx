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
    // First clear any existing object in this zone
    const currentObjectInZone = Array.from(objectPlacements).find(([_, zone]) => zone === zoneId);
    if (currentObjectInZone) {
      const [existingObjectId] = currentObjectInZone;
      // Return the existing object to the panel
      setPlacedObjects(prev => {
        const newPlaced = new Set(prev);
        newPlaced.delete(existingObjectId);
        return newPlaced;
      });
    }

    // Clear any previous placement of the new object
    const previousZone = objectPlacements.get(objectId);
    if (previousZone !== undefined) {
      setObjectPlacements(prev => {
        const newPlacements = new Map(prev);
        newPlacements.delete(objectId);
        return newPlacements;
      });
    }

    // Set the new placement
    setObjectPlacements(prev => {
      const newPlacements = new Map(prev);
      // First remove any object that was in this zone
      Array.from(newPlacements.entries()).forEach(([objId, zId]) => {
        if (zId === zoneId) {
          newPlacements.delete(objId);
        }
      });
      // Then set the new object
      newPlacements.set(objectId, zoneId);
      return newPlacements;
    });

    // Mark the object as placed
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