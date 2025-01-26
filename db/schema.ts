import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  description: text("description"),
});

export const objects = pgTable("objects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  objectType: text("object_type").notNull(),
  correctZoneId: integer("correct_zone_id").notNull(),
  errorMessage: text("error_message").notNull(),
  successMessage: text("success_message").notNull(),
  points: integer("points").notNull(),
});

export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  customerName: text("customer_name").notNull(),
  description: text("description"),
  zoneIds: jsonb("zone_ids").notNull(),
  objectIds: jsonb("object_ids").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type Zone = typeof zones.$inferSelect;
export type Object = typeof objects.$inferSelect;
export type Scenario = typeof scenarios.$inferSelect;
export type User = typeof users.$inferSelect;