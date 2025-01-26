import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { zones, objects, scenarios, users } from "@db/schema";
import { eq, inArray } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Existing routes
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

  // Admin API Routes
  app.get("/api/admin/zones", async (req, res) => {
    const allZones = await db.query.zones.findMany();
    res.json(allZones);
  });

  app.post("/api/admin/zones", async (req, res) => {
    const { name, x, y, width, height, description } = req.body;
    const newZone = await db.insert(zones).values({
      name,
      x,
      y,
      width,
      height,
      description
    }).returning();
    res.json(newZone[0]);
  });

  app.get("/api/admin/objects", async (req, res) => {
    const allObjects = await db.query.objects.findMany();
    res.json(allObjects);
  });

  app.post("/api/admin/objects", async (req, res) => {
    const { name, objectType, correctZoneId, errorMessage, successMessage, points } = req.body;
    const newObject = await db.insert(objects).values({
      name,
      objectType,
      correctZoneId,
      errorMessage,
      successMessage,
      points
    }).returning();
    res.json(newObject[0]);
  });

  app.get("/api/admin/scenarios", async (req, res) => {
    const allScenarios = await db.query.scenarios.findMany();
    res.json(allScenarios);
  });

  app.post("/api/admin/scenarios", async (req, res) => {
    const { name, customerName, description, zoneIds, objectIds } = req.body;
    const newScenario = await db.insert(scenarios).values({
      name,
      customerName,
      description,
      zoneIds,
      objectIds
    }).returning();
    res.json(newScenario[0]);
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