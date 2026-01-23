import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Protected middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Get current user + usage
  app.get(api.auth.me.path, requireAuth, async (req: any, res) => {
    const usage = await storage.getUserUsage(req.user.claims.sub);
    res.json({
      user: req.user.claims,
      usage
    });
  });

  // Generate Quiz
  app.post(api.quizzes.generate.path, requireAuth, async (req: any, res) => {
    try {
      const input = api.quizzes.generate.input.parse(req.body);
      const userId = req.user.claims.sub;

      // Check credits
      const usage = await storage.getUserUsage(userId);
      if (!usage.isPro && usage.quizzesGenerated >= 5) {
        return res.status(402).json({ message: "Free limit reached. Please upgrade to Pro." });
      }

      // Generate with AI
      const prompt = `Generate a ${input.difficulty} difficulty quiz about "${input.topic}" with ${input.amount} questions.
      Format the output as a JSON object with a "title" string and a "questions" array.
      Each question object should have:
      - "questionText" (string)
      - "options" (array of 4 strings)
      - "correctAnswer" (string, must match one of the options)
      - "explanation" (string, brief explanation of why it's correct)
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.1", // or gpt-4o-mini if 5.1 not available in integration context, but blueprint said 5.1 is latest
        messages: [
          { role: "system", content: "You are a helpful quiz generator. Output valid JSON only." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error("No content generated");

      const quizData = JSON.parse(content);

      // Save to DB
      const quiz = await storage.createQuiz({
        userId,
        topic: input.topic,
        difficulty: input.difficulty,
        title: quizData.title || `${input.topic} Quiz`,
        questions: quizData.questions,
        isPublic: false
      });

      // Increment usage
      await storage.incrementUsage(userId);

      res.status(201).json(quiz);

    } catch (err) {
      console.error("Quiz generation error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to generate quiz" });
    }
  });

  // List Quizzes
  app.get(api.quizzes.list.path, requireAuth, async (req: any, res) => {
    const quizzes = await storage.getUserQuizzes(req.user.claims.sub);
    res.json(quizzes);
  });

  // Get Quiz
  app.get(api.quizzes.get.path, requireAuth, async (req: any, res) => {
    const quiz = await storage.getQuiz(Number(req.params.id));
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    
    // Authorization check
    if (quiz.userId !== req.user.claims.sub && !quiz.isPublic) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(quiz);
  });

  // Delete Quiz
  app.delete(api.quizzes.delete.path, requireAuth, async (req: any, res) => {
    const quiz = await storage.getQuiz(Number(req.params.id));
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.userId !== req.user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await storage.deleteQuiz(Number(req.params.id));
    res.status(204).send();
  });

  // Stripe (Mock for MVP)
  app.post(api.stripe.createCheckout.path, requireAuth, async (req: any, res) => {
    // In a real app, this would call Stripe API
    // For MVP, we'll just mock upgrade the user
    await storage.setUserPro(req.user.claims.sub, true);
    res.json({ url: "/?upgraded=true" });
  });

  return httpServer;
}
