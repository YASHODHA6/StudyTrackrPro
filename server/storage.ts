import {
  type StudySession,
  type InsertStudySession,
  type Todo,
  type InsertTodo,
  type Feedback,
  type InsertFeedback,
  type StudyStats,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const TODOS_FILE = path.join(DATA_DIR, "todos.json");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");

export interface IStorage {
  // Study Sessions
  getAllStudySessions(): Promise<StudySession[]>;
  addStudySession(session: InsertStudySession): Promise<StudySession>;
  getStudyStats(): Promise<StudyStats>;

  // Todos
  getAllTodos(): Promise<Todo[]>;
  addTodo(todo: InsertTodo): Promise<Todo>;
  deleteTodo(id: string): Promise<boolean>;
  toggleTodo(id: string): Promise<Todo | undefined>;

  // Feedback
  addFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getAllFeedback(): Promise<Feedback[]>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, StudySession>;
  private todos: Map<string, Todo>;
  private feedbacks: Map<string, Feedback>;
  private initialized: boolean = false;

  constructor() {
    this.sessions = new Map();
    this.todos = new Map();
    this.feedbacks = new Map();
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
      console.error("Error creating data directory:", error);
    }
  }

  private async loadData(): Promise<void> {
    if (this.initialized) return;

    await this.ensureDataDir();

    try {
      const sessionsData = await fs.readFile(SESSIONS_FILE, "utf-8");
      const sessions: StudySession[] = JSON.parse(sessionsData);
      sessions.forEach((session) => this.sessions.set(session.id, session));
    } catch (error) {
      console.log("No existing sessions file, starting fresh");
    }

    try {
      const todosData = await fs.readFile(TODOS_FILE, "utf-8");
      const todos: Todo[] = JSON.parse(todosData);
      todos.forEach((todo) => this.todos.set(todo.id, todo));
    } catch (error) {
      console.log("No existing todos file, starting fresh");
    }

    try {
      const feedbackData = await fs.readFile(FEEDBACK_FILE, "utf-8");
      const feedbacks: Feedback[] = JSON.parse(feedbackData);
      feedbacks.forEach((feedback) => this.feedbacks.set(feedback.id, feedback));
    } catch (error) {
      console.log("No existing feedback file, starting fresh");
    }

    this.initialized = true;
  }

  private async saveSessions(): Promise<void> {
    const sessions = Array.from(this.sessions.values());
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  }

  private async saveTodos(): Promise<void> {
    const todos = Array.from(this.todos.values());
    await fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2));
  }

  private async saveFeedback(): Promise<void> {
    const feedbacks = Array.from(this.feedbacks.values());
    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));
  }

  async getAllStudySessions(): Promise<StudySession[]> {
    await this.loadData();
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async addStudySession(insertSession: InsertStudySession): Promise<StudySession> {
    await this.loadData();
    const id = randomUUID();
    const session: StudySession = { ...insertSession, id };
    this.sessions.set(id, session);
    await this.saveSessions();
    return session;
  }

  async getStudyStats(): Promise<StudyStats> {
    await this.loadData();
    const sessions = Array.from(this.sessions.values());

    if (sessions.length === 0) {
      return {
        totalHours: 0,
        numberOfSubjects: 0,
        averageHoursPerSubject: 0,
      };
    }

    const totalHours = sessions.reduce((sum, session) => sum + session.hours, 0);

    const uniqueSubjects = new Set(sessions.map((s) => s.subject.toLowerCase()));
    const numberOfSubjects = uniqueSubjects.size;

    const averageHoursPerSubject = numberOfSubjects > 0 ? totalHours / numberOfSubjects : 0;

    return {
      totalHours,
      numberOfSubjects,
      averageHoursPerSubject,
    };
  }

  async getAllTodos(): Promise<Todo[]> {
    await this.loadData();
    return Array.from(this.todos.values());
  }

  async addTodo(insertTodo: InsertTodo): Promise<Todo> {
    await this.loadData();
    const id = randomUUID();
    const todo: Todo = { ...insertTodo, id };
    this.todos.set(id, todo);
    await this.saveTodos();
    return todo;
  }

  async deleteTodo(id: string): Promise<boolean> {
    await this.loadData();
    const deleted = this.todos.delete(id);
    if (deleted) {
      await this.saveTodos();
    }
    return deleted;
  }

  async toggleTodo(id: string): Promise<Todo | undefined> {
    await this.loadData();
    const todo = this.todos.get(id);
    if (todo) {
      todo.completed = !todo.completed;
      this.todos.set(id, todo);
      await this.saveTodos();
    }
    return todo;
  }

  async addFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    await this.loadData();
    const id = randomUUID();
    const feedback: Feedback = {
      ...insertFeedback,
      id,
      timestamp: new Date().toISOString(),
    };
    this.feedbacks.set(id, feedback);
    await this.saveFeedback();
    return feedback;
  }

  async getAllFeedback(): Promise<Feedback[]> {
    await this.loadData();
    return Array.from(this.feedbacks.values());
  }
}

export const storage = new MemStorage();
