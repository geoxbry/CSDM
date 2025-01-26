import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { users, zones, objects, scenarios } from "@db/schema";
import { eq, inArray } from "drizzle-orm";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const sessionStore = MemoryStore(session);

export function registerRoutes(app: Express): Server {
  // Session setup
  app.use(
    session({
      store: new sessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      secret: "your-secret-key", // In production, use an environment variable
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production" },
    })
  );

  // Passport setup
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await db.query.users.findFirst({
          where: eq(users.username, username),
        });

        if (!user || !user.isAdmin || !bcrypt.compareSync(password, user.password)) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth middleware
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !(req.user as any)?.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Auth routes
  app.post("/api/admin/login", passport.authenticate("local"), (req, res) => {
    res.json({ message: "Logged in successfully" });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  // Protected admin routes
  app.get("/api/admin/zones", requireAdmin, async (req, res) => {
    const allZones = await db.query.zones.findMany();
    res.json(allZones);
  });

  app.post("/api/admin/zones", requireAdmin, async (req, res) => {
    const { name, x, y, width, height, description } = req.body;
    const newZone = await db.insert(zones)
      .values({
        name,
        x,
        y,
        width,
        height,
        description,
      })
      .returning();

    // Update the default scenario (id: 1) to include the new zone
    const scenario = await db.query.scenarios.findFirst({
      where: eq(scenarios.id, 1),
    });

    if (scenario) {
      const updatedZoneIds = [...(scenario.zoneIds as number[]), newZone[0].id];
      await db
        .update(scenarios)
        .set({ zoneIds: updatedZoneIds })
        .where(eq(scenarios.id, 1));
    }

    res.json(newZone[0]);
  });

  app.put("/api/admin/zones/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, x, y, width, height, description } = req.body;

    const updatedZone = await db
      .update(zones)
      .set({
        name,
        x,
        y,
        width,
        height,
        description,
      })
      .where(eq(zones.id, parseInt(id)))
      .returning();

    if (!updatedZone.length) {
      return res.status(404).json({ message: "Zone not found" });
    }

    res.json(updatedZone[0]);
  });

  app.get("/api/admin/objects", requireAdmin, async (req, res) => {
    const allObjects = await db.query.objects.findMany();
    res.json(allObjects);
  });

  app.post("/api/admin/objects", requireAdmin, async (req, res) => {
    const { name, objectType, correctZoneId, errorMessage, successMessage, points } =
      req.body;
    const newObject = await db.insert(objects)
      .values({
        name,
        objectType,
        correctZoneId,
        errorMessage,
        successMessage,
        points,
      })
      .returning();
    res.json(newObject[0]);
  });

  app.get("/api/admin/scenarios", requireAdmin, async (req, res) => {
    const allScenarios = await db.query.scenarios.findMany();
    res.json(allScenarios);
  });

  app.post("/api/admin/scenarios", requireAdmin, async (req, res) => {
    const { name, customerName, description, zoneIds, objectIds } = req.body;
    const newScenario = await db.insert(scenarios)
      .values({
        name,
        customerName,
        description,
        zoneIds,
        objectIds,
      })
      .returning();
    res.json(newScenario[0]);
  });

  // Non-admin routes
  app.get("/api/scenarios/:customerId", async (req, res) => {
    const { customerId } = req.params;
    const customerScenarios = await db.query.scenarios.findMany({
      where: eq(scenarios.customerName, customerId),
    });
    res.json(customerScenarios);
  });

  app.get("/api/scenario/:scenarioId", async (req, res) => {
    const { scenarioId } = req.params;
    const scenario = await db.query.scenarios.findFirst({
      where: eq(scenarios.id, parseInt(scenarioId)),
    });
    if (!scenario)
      return res.status(404).json({ message: "Scenario not found" });

    const scenarioZones = await db.query.zones.findMany({
      where: inArray(zones.id, scenario.zoneIds as number[]),
    });

    const scenarioObjects = await db.query.objects.findMany({
      where: inArray(objects.id, scenario.objectIds as number[]),
    });

    res.json({
      scenario,
      zones: scenarioZones,
      objects: scenarioObjects,
    });
  });

  app.post("/api/validate", async (req, res) => {
    const { placements } = req.body;
    let score = 0;
    const results = [];

    for (const placement of placements) {
      const object = await db.query.objects.findFirst({
        where: eq(objects.id, placement.objectId),
      });

      if (!object) continue;

      const isCorrect = object.correctZoneId === placement.zoneId;
      results.push({
        objectId: object.id,
        correct: isCorrect,
        message: isCorrect ? object.successMessage : object.errorMessage,
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