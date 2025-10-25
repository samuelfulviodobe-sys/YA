import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Notes schema
export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  isFavorite: boolean("is_favorite").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

// Pomodoro sessions schema
export const pomodoroSessions = pgTable("pomodoro_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  duration: integer("duration").notNull(), // in minutes
  type: text("type").notNull(), // 'work' | 'break'
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertPomodoroSessionSchema = createInsertSchema(pomodoroSessions).omit({
  id: true,
  completedAt: true,
});

export type InsertPomodoroSession = z.infer<typeof insertPomodoroSessionSchema>;
export type PomodoroSession = typeof pomodoroSessions.$inferSelect;

// Kaizen goals schema
export const kaizenGoals = pgTable("kaizen_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  goal: text("goal").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  completed: boolean("completed").notNull().default(false),
});

export const insertKaizenGoalSchema = createInsertSchema(kaizenGoals).omit({
  id: true,
});

export type InsertKaizenGoal = z.infer<typeof insertKaizenGoalSchema>;
export type KaizenGoal = typeof kaizenGoals.$inferSelect;

// Eisenhower tasks schema
export const eisenhowerTasks = pgTable("eisenhower_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  quadrant: text("quadrant").notNull(), // 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important'
  completed: boolean("completed").notNull().default(false),
  noteId: varchar("note_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEisenhowerTaskSchema = createInsertSchema(eisenhowerTasks).omit({
  id: true,
  createdAt: true,
});

export type InsertEisenhowerTask = z.infer<typeof insertEisenhowerTaskSchema>;
export type EisenhowerTask = typeof eisenhowerTasks.$inferSelect;
