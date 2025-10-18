import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { submitAnswerSchema, markLessonCompleteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all topics
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getAllTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  });

  // Get a specific topic
  app.get("/api/topics/:id", async (req, res) => {
    try {
      const topic = await storage.getTopic(req.params.id);
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topic" });
    }
  });

  // Get lessons for a topic
  app.get("/api/topics/:id/lessons", async (req, res) => {
    try {
      const lessons = await storage.getLessonsByTopic(req.params.id);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });

  // Get a specific lesson
  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lesson" });
    }
  });

  // Get exercises for a lesson
  app.get("/api/lessons/:id/exercises", async (req, res) => {
    try {
      const exercises = await storage.getExercisesByLesson(req.params.id);
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exercises" });
    }
  });

  // Submit an exercise answer
  app.post("/api/exercises/submit", async (req, res) => {
    try {
      const validatedData = submitAnswerSchema.parse(req.body);
      
      const exercise = await storage.getExercise(validatedData.exerciseId);
      if (!exercise) {
        return res.status(404).json({ error: "Exercise not found" });
      }

      // Normalize answers for comparison
      const normalizeAnswer = (answer: string) => 
        answer.toLowerCase().trim().replace(/[^\w\s]/g, '');

      const userAnswerNormalized = normalizeAnswer(validatedData.userAnswer);
      const correctAnswerNormalized = normalizeAnswer(exercise.correctAnswer);

      const isCorrect = userAnswerNormalized === correctAnswerNormalized;

      // Record the attempt
      await storage.recordExerciseAttempt({
        exerciseId: exercise.id,
        userAnswer: validatedData.userAnswer,
        isCorrect,
        attemptedAt: new Date(),
      });

      res.json({
        isCorrect,
        correctAnswer: exercise.correctAnswer,
        explanation: exercise.explanation,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit answer" });
    }
  });

  // Mark a lesson as complete
  app.post("/api/progress/lesson", async (req, res) => {
    try {
      const validatedData = markLessonCompleteSchema.parse(req.body);
      await storage.markLessonComplete(validatedData.lessonId, validatedData.topicId);
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to mark lesson complete" });
    }
  });

  // Get progress for a specific topic
  app.get("/api/progress/topic/:topicId", async (req, res) => {
    try {
      const progress = await storage.getTopicProgress(req.params.topicId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topic progress" });
    }
  });

  // Check if a lesson is complete
  app.get("/api/progress/lesson/:lessonId", async (req, res) => {
    try {
      const isComplete = await storage.isLessonComplete(req.params.lessonId);
      res.json({ completed: isComplete });
    } catch (error) {
      res.status(500).json({ error: "Failed to check lesson status" });
    }
  });

  // Get all progress
  app.get("/api/progress", async (req, res) => {
    try {
      const progress = await storage.getAllProgress();
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
