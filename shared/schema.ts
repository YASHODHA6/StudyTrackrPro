import { z } from "zod";

// Study Session Schema
export const studySessionSchema = z.object({
  id: z.string(),
  subject: z.string().min(1, "Subject is required"),
  hours: z.number().min(0.5, "Minimum 0.5 hours").max(24, "Maximum 24 hours"),
  date: z.string(),
});

export const insertStudySessionSchema = studySessionSchema.omit({ id: true });
export const updateStudySessionSchema = insertStudySessionSchema.partial();

export type StudySession = z.infer<typeof studySessionSchema>;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type UpdateStudySession = z.infer<typeof updateStudySessionSchema>;

// Todo Schema
export const todoSchema = z.object({
  id: z.string(),
  task: z.string().min(1, "Task is required"),
  completed: z.boolean(),
});

export const insertTodoSchema = todoSchema.omit({ id: true });
export const updateTodoSchema = z.object({
  task: z.string().min(1, "Task is required").optional(),
  completed: z.boolean().optional(),
});

export type Todo = z.infer<typeof todoSchema>;
export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;

// Feedback Schema
export const feedbackSchema = z.object({
  id: z.string(),
  message: z.string().min(1, "Message is required"),
  timestamp: z.string(),
});

export const insertFeedbackSchema = feedbackSchema.omit({ id: true, timestamp: true });

export type Feedback = z.infer<typeof feedbackSchema>;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

// Stats Schema (for API response)
export type StudyStats = {
  totalHours: number;
  numberOfSubjects: number;
  averageHoursPerSubject: number;
};
