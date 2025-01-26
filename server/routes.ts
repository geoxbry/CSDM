import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { zones, objects, scenarios, users } from "@db/schema";
import { eq, inArray } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  app.get("/api/scenarios/:customerId", async (req, res) => {
    const { customerId } = req.params;
    const customerScenarios = await db.query.scenarios.findMany({
      where: eq(scenarios.customerName, customerId)
    });
    res.json(customerScenarios);
  });

  app.get("/api/scenario/:scenarioId", async (req, res) => {
    const { scenarioId } = req.params;
    const scenario = await db.query.scenarios.findFirst({
      where: eq(scenarios.id, parseInt(scenarioId))
    });
    if (!scenario) return res.status(404).json({ message: "Scenario not found" });

    const scenarioZones = await db.query.zones.findMany({
      where: inArray(zones.id, scenario.zoneIds as number[])
    });

    const scenarioObjects = await db.query.objects.findMany({
      where: inArray(objects.id, scenario.objectIds as number[])
    });

    res.json({
      scenario,
      zones: scenarioZones,
      objects: scenarioObjects
    });
  });

  app.post("/api/validate", async (req, res) => {
    const { placements } = req.body;
    let score = 0;
    const results = [];

    for (const placement of placements) {
      const object = await db.query.objects.findFirst({
        where: eq(objects.id, placement.objectId)
      });

      if (!object) continue;

      const isCorrect = object.correctZoneId === placement.zoneId;
      results.push({
        objectId: object.id,
        correct: isCorrect,
        message: isCorrect ? object.successMessage : object.errorMessage
      });

      if (isCorrect) {
        score += object.points;
      }
    }

    res.json({ score, results });
  });

  const httpServer = createServer(app);
  return httpServer;
}