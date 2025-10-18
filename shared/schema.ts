import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Topic represents a learning topic within a subject and level
export interface Topic {
  id: string;
  title: string;
  subject: 'biology' | 'chemistry' | 'physics';
  level: 'ks3' | 'gcse' | 'a-level';
  description: string;
  lessonCount: number;
  completed?: boolean;
}

// Lesson represents educational content for a topic
export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  content: string;
  order: number;
  hasExercises: boolean;
}

// Exercise question types
export interface Exercise {
  id: string;
  lessonId: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  order: number;
}

// User progress tracking
export interface Progress {
  topicId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
}

// Session-based exercise attempt
export interface ExerciseAttempt {
  exerciseId: string;
  userAnswer: string;
  isCorrect: boolean;
  attemptedAt: Date;
}

// Progress summary for a topic
export interface TopicProgress {
  topicId: string;
  completedLessons: number;
  totalLessons: number;
  exercisesCompleted: number;
  totalExercises: number;
  averageScore?: number;
}

export const insertTopicSchema = z.object({
  title: z.string().min(1),
  subject: z.enum(['biology', 'chemistry', 'physics']),
  level: z.enum(['ks3', 'gcse', 'a-level']),
  description: z.string(),
  lessonCount: z.number().int().positive(),
});

export const insertLessonSchema = z.object({
  topicId: z.string(),
  title: z.string().min(1),
  content: z.string(),
  order: z.number().int().nonnegative(),
  hasExercises: z.boolean(),
});

export const insertExerciseSchema = z.object({
  lessonId: z.string(),
  question: z.string().min(1),
  type: z.enum(['multiple-choice', 'true-false', 'short-answer']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string(),
  order: z.number().int().nonnegative(),
});

export const submitAnswerSchema = z.object({
  exerciseId: z.string(),
  userAnswer: z.string(),
});

export const markLessonCompleteSchema = z.object({
  lessonId: z.string(),
  topicId: z.string(),
});

export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type SubmitAnswer = z.infer<typeof submitAnswerSchema>;
export type MarkLessonComplete = z.infer<typeof markLessonCompleteSchema>;
