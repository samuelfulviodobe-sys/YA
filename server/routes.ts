import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertNoteSchema,
  insertPomodoroSessionSchema,
  insertKaizenGoalSchema,
  insertEisenhowerTaskSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Notes endpoints
  app.get("/api/notes", async (_req, res) => {
    try {
      const notes = await storage.getNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.get("/api/notes/:id", async (req, res) => {
    try {
      const note = await storage.getNote(req.params.id);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch note" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const validatedData = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid note data" });
      }
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  app.patch("/api/notes/:id", async (req, res) => {
    try {
      const partialSchema = insertNoteSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const note = await storage.updateNote(req.params.id, validatedData);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid note data" });
      }
      res.status(500).json({ error: "Failed to update note" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteNote(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  app.get("/api/notes/search/:query", async (req, res) => {
    try {
      const notes = await storage.searchNotes(req.params.query);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to search notes" });
    }
  });

  app.get("/api/notes/tag/:tag", async (req, res) => {
    try {
      const notes = await storage.getNotesByTag(req.params.tag);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes by tag" });
    }
  });

  app.get("/api/notes/date/:date", async (req, res) => {
    try {
      const notes = await storage.getNotesByDate(req.params.date);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes by date" });
    }
  });

  // Pomodoro sessions endpoints
  app.get("/api/pomodoro-sessions", async (_req, res) => {
    try {
      const sessions = await storage.getPomodoroSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pomodoro sessions" });
    }
  });

  app.post("/api/pomodoro-sessions", async (req, res) => {
    try {
      const validatedData = insertPomodoroSessionSchema.parse(req.body);
      const session = await storage.createPomodoroSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid session data" });
      }
      res.status(500).json({ error: "Failed to create pomodoro session" });
    }
  });

  // Kaizen goals endpoints
  app.get("/api/kaizen-goals", async (_req, res) => {
    try {
      const goals = await storage.getKaizenGoals();
      res.json(goals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch kaizen goals" });
    }
  });

  app.post("/api/kaizen-goals", async (req, res) => {
    try {
      const validatedData = insertKaizenGoalSchema.parse(req.body);
      const goal = await storage.createKaizenGoal(validatedData);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid goal data" });
      }
      res.status(500).json({ error: "Failed to create kaizen goal" });
    }
  });

  app.patch("/api/kaizen-goals/:id", async (req, res) => {
    try {
      const partialSchema = insertKaizenGoalSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const goal = await storage.updateKaizenGoal(req.params.id, validatedData);
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }
      res.json(goal);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid goal data" });
      }
      res.status(500).json({ error: "Failed to update kaizen goal" });
    }
  });

  app.delete("/api/kaizen-goals/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteKaizenGoal(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Goal not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete kaizen goal" });
    }
  });

  // Eisenhower tasks endpoints
  app.get("/api/eisenhower-tasks", async (_req, res) => {
    try {
      const tasks = await storage.getEisenhowerTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch eisenhower tasks" });
    }
  });

  app.post("/api/eisenhower-tasks", async (req, res) => {
    try {
      const validatedData = insertEisenhowerTaskSchema.parse(req.body);
      const task = await storage.createEisenhowerTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid task data" });
      }
      res.status(500).json({ error: "Failed to create eisenhower task" });
    }
  });

  app.patch("/api/eisenhower-tasks/:id", async (req, res) => {
    try {
      const partialSchema = insertEisenhowerTaskSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const task = await storage.updateEisenhowerTask(req.params.id, validatedData);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid task data" });
      }
      res.status(500).json({ error: "Failed to update eisenhower task" });
    }
  });

  app.delete("/api/eisenhower-tasks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEisenhowerTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete eisenhower task" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
