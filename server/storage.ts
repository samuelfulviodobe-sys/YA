import {
  type Note,
  type InsertNote,
  type PomodoroSession,
  type InsertPomodoroSession,
  type KaizenGoal,
  type InsertKaizenGoal,
  type EisenhowerTask,
  type InsertEisenhowerTask,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Notes
  getNotes(): Promise<Note[]>;
  getNote(id: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;
  searchNotes(query: string): Promise<Note[]>;
  getNotesByTag(tag: string): Promise<Note[]>;
  getNotesByDate(date: string): Promise<Note[]>;

  // Pomodoro Sessions
  getPomodoroSessions(): Promise<PomodoroSession[]>;
  createPomodoroSession(session: InsertPomodoroSession): Promise<PomodoroSession>;

  // Kaizen Goals
  getKaizenGoals(): Promise<KaizenGoal[]>;
  getKaizenGoalsByDateRange(startDate: Date, endDate: Date): Promise<KaizenGoal[]>;
  createKaizenGoal(goal: InsertKaizenGoal): Promise<KaizenGoal>;
  updateKaizenGoal(id: string, goal: Partial<InsertKaizenGoal>): Promise<KaizenGoal | undefined>;
  deleteKaizenGoal(id: string): Promise<boolean>;

  // Eisenhower Tasks
  getEisenhowerTasks(): Promise<EisenhowerTask[]>;
  createEisenhowerTask(task: InsertEisenhowerTask): Promise<EisenhowerTask>;
  updateEisenhowerTask(id: string, task: Partial<InsertEisenhowerTask>): Promise<EisenhowerTask | undefined>;
  deleteEisenhowerTask(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private notes: Map<string, Note>;
  private pomodoroSessions: Map<string, PomodoroSession>;
  private kaizenGoals: Map<string, KaizenGoal>;
  private eisenhowerTasks: Map<string, EisenhowerTask>;

  constructor() {
    this.notes = new Map();
    this.pomodoroSessions = new Map();
    this.kaizenGoals = new Map();
    this.eisenhowerTasks = new Map();
  }

  // Notes methods
  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const now = new Date();
    const note: Note = {
      id,
      title: insertNote.title,
      content: insertNote.content ?? "",
      tags: insertNote.tags ?? [],
      isFavorite: insertNote.isFavorite ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updateData: Partial<InsertNote>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;

    const updatedNote: Note = {
      ...note,
      ...updateData,
      updatedAt: new Date(),
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }

  async searchNotes(query: string): Promise<Note[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.notes.values())
      .filter(
        (note) =>
          note.title.toLowerCase().includes(lowercaseQuery) ||
          note.content.toLowerCase().includes(lowercaseQuery) ||
          note.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getNotesByTag(tag: string): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter((note) => note.tags.includes(tag))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getNotesByDate(date: string): Promise<Note[]> {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    return Array.from(this.notes.values())
      .filter((note) => {
        const noteDate = new Date(note.createdAt);
        return noteDate >= startOfDay && noteDate <= endOfDay;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  // Pomodoro Sessions methods
  async getPomodoroSessions(): Promise<PomodoroSession[]> {
    return Array.from(this.pomodoroSessions.values()).sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  }

  async createPomodoroSession(insertSession: InsertPomodoroSession): Promise<PomodoroSession> {
    const id = randomUUID();
    const session: PomodoroSession = {
      ...insertSession,
      id,
      completedAt: new Date(),
    };
    this.pomodoroSessions.set(id, session);
    return session;
  }

  // Kaizen Goals methods
  async getKaizenGoals(): Promise<KaizenGoal[]> {
    return Array.from(this.kaizenGoals.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getKaizenGoalsByDateRange(startDate: Date, endDate: Date): Promise<KaizenGoal[]> {
    return Array.from(this.kaizenGoals.values())
      .filter((goal) => {
        const goalDate = new Date(goal.date);
        return goalDate >= startDate && goalDate <= endDate;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createKaizenGoal(insertGoal: InsertKaizenGoal): Promise<KaizenGoal> {
    const id = randomUUID();
    const goal: KaizenGoal = {
      id,
      goal: insertGoal.goal,
      date: insertGoal.date ?? new Date(),
      completed: insertGoal.completed ?? false,
    };
    this.kaizenGoals.set(id, goal);
    return goal;
  }

  async updateKaizenGoal(id: string, updateData: Partial<InsertKaizenGoal>): Promise<KaizenGoal | undefined> {
    const goal = this.kaizenGoals.get(id);
    if (!goal) return undefined;

    const updatedGoal: KaizenGoal = {
      ...goal,
      ...updateData,
    };
    this.kaizenGoals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteKaizenGoal(id: string): Promise<boolean> {
    return this.kaizenGoals.delete(id);
  }

  // Eisenhower Tasks methods
  async getEisenhowerTasks(): Promise<EisenhowerTask[]> {
    return Array.from(this.eisenhowerTasks.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createEisenhowerTask(insertTask: InsertEisenhowerTask): Promise<EisenhowerTask> {
    const id = randomUUID();
    const task: EisenhowerTask = {
      id,
      title: insertTask.title,
      quadrant: insertTask.quadrant,
      completed: insertTask.completed ?? false,
      noteId: insertTask.noteId ?? null,
      createdAt: new Date(),
    };
    this.eisenhowerTasks.set(id, task);
    return task;
  }

  async updateEisenhowerTask(id: string, updateData: Partial<InsertEisenhowerTask>): Promise<EisenhowerTask | undefined> {
    const task = this.eisenhowerTasks.get(id);
    if (!task) return undefined;

    const updatedTask: EisenhowerTask = {
      ...task,
      ...updateData,
    };
    this.eisenhowerTasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteEisenhowerTask(id: string): Promise<boolean> {
    return this.eisenhowerTasks.delete(id);
  }
}

export const storage = new MemStorage();
