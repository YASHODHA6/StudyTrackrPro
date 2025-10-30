import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertStudySessionSchema,
  updateStudySessionSchema,
  insertTodoSchema,
  updateTodoSchema,
  insertFeedbackSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Study Sessions
  
  // POST /api/study - Add a new study session
  app.post("/api/study", async (req, res) => {
    try {
      const validatedData = insertStudySessionSchema.parse(req.body);
      const session = await storage.addStudySession(validatedData);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid study session data" });
    }
  });

  // GET /api/study - Get all study sessions
  app.get("/api/study", async (req, res) => {
    try {
      const sessions = await storage.getAllStudySessions();
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch study sessions" });
    }
  });

  // PUT /api/study/:id - Update a study session
  app.put("/api/study/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateStudySessionSchema.parse(req.body);
      const session = await storage.updateStudySession(id, validatedData);
      
      if (!session) {
        return res.status(404).json({ error: "Study session not found" });
      }
      
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid study session data" });
    }
  });

  // DELETE /api/study/:id - Delete a study session
  app.delete("/api/study/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteStudySession(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Study session not found" });
      }
      
      res.json({ success: true, message: "Study session deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete study session" });
    }
  });

  // Statistics
  
  // GET /api/stats - Get study statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStudyStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to calculate statistics" });
    }
  });

  // Todos
  
  // POST /api/todo - Add a new todo task
  app.post("/api/todo", async (req, res) => {
    try {
      const validatedData = insertTodoSchema.parse(req.body);
      const todo = await storage.addTodo(validatedData);
      res.json(todo);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid todo data" });
    }
  });

  // GET /api/todo - Get all todos
  app.get("/api/todo", async (req, res) => {
    try {
      const todos = await storage.getAllTodos();
      res.json(todos);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch todos" });
    }
  });

  // PUT /api/todo/:id - Update a todo
  app.put("/api/todo/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateTodoSchema.parse(req.body);
      const todo = await storage.updateTodo(id, validatedData);
      
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      
      res.json(todo);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid todo data" });
    }
  });

  // DELETE /api/todo/:id - Delete a todo
  app.delete("/api/todo/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTodo(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Todo not found" });
      }
      
      res.json({ success: true, message: "Todo deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete todo" });
    }
  });

  // POST /api/todo/:id/toggle - Toggle todo completion
  app.post("/api/todo/:id/toggle", async (req, res) => {
    try {
      const { id } = req.params;
      const todo = await storage.toggleTodo(id);
      
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      
      res.json(todo);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to toggle todo" });
    }
  });

  // Feedback
  
  // POST /api/feedback - Submit feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.addFeedback(validatedData);
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid feedback data" });
    }
  });

  // Reports
  
  // GET /api/report - Download study report
  app.get("/api/report", async (req, res) => {
    try {
      const format = req.query.format as string || "json";
      const sessions = await storage.getAllStudySessions();
      const stats = await storage.getStudyStats();

      if (format === "txt") {
        // Generate text report
        let report = "=".repeat(60) + "\n";
        report += "           STUDENT STUDY TRACKER - REPORT\n";
        report += "=".repeat(60) + "\n\n";
        
        report += "STATISTICS\n";
        report += "-".repeat(60) + "\n";
        report += `Total Study Hours: ${stats.totalHours.toFixed(1)} hours\n`;
        report += `Number of Subjects: ${stats.numberOfSubjects}\n`;
        report += `Average Hours per Subject: ${stats.averageHoursPerSubject.toFixed(1)} hours\n\n`;

        report += "STUDY SESSIONS\n";
        report += "-".repeat(60) + "\n";
        
        if (sessions.length === 0) {
          report += "No study sessions recorded yet.\n";
        } else {
          sessions.forEach((session, index) => {
            report += `${index + 1}. ${session.subject}\n`;
            report += `   Date: ${session.date}\n`;
            report += `   Hours: ${session.hours}\n\n`;
          });
        }

        report += "=".repeat(60) + "\n";
        report += `Generated on: ${new Date().toLocaleString()}\n`;

        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", "attachment; filename=study-report.txt");
        res.send(report);
      } else {
        // JSON format
        const report = {
          generatedAt: new Date().toISOString(),
          statistics: stats,
          sessions: sessions,
        };

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", "attachment; filename=study-report.json");
        res.json(report);
      }
    } catch (error: any) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
