import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// OpenRouter-backed OpenAI-compatible client
const openai = process.env.OPENROUTER_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_API_BASE || "https://openrouter.ai/api/v1",
    })
  : null;

type LLMModelConfig = {
  name: string;
  maxCalls: number;
};

// Basic in-memory orchestration config: adjust limits via env if desired
const llmModels: LLMModelConfig[] = [
  {
    name: "openai/gpt-4o-mini",
    maxCalls: Number(process.env.OPENROUTER_GPT4O_MINI_LIMIT || "1000"),
  },
  {
    name: "openai/gpt-4.1-mini",
    maxCalls: Number(process.env.OPENROUTER_GPT41_MINI_LIMIT || "1000"),
  },
];

const llmUsage: Record<string, number> = {};

function getNextModel(): string {
  for (const { name, maxCalls } of llmModels) {
    const used = llmUsage[name] ?? 0;
    if (used < maxCalls) {
      llmUsage[name] = used + 1;
      return name;
    }
  }

  // If all limits are reached, fall back to the last model even if over limit
  const fallback = llmModels[llmModels.length - 1];
  llmUsage[fallback.name] = (llmUsage[fallback.name] ?? 0) + 1;
  return fallback.name;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Skip Replit Auth setup entirely when REPL_ID is not present (local/dev)
  if (!process.env.REPL_ID) {
    console.warn("REPL_ID not set. Skipping Replit Auth setup and using mock auth.");
  } else {
    // Auth Setup
    await setupAuth(app);
    registerAuthRoutes(app);
  }

  // Protected middleware - bypass when Replit auth is not configured
  const requireAuth = (req: any, res: any, next: any) => {
    if (!process.env.REPL_ID) {
      // Mock user when Replit auth is not configured (local/dev)
      req.user = {
        claims: {
          sub: "mock-user-id",
          email: "mock@example.com",
          name: "Mock User",
        },
      };
      return next();
    }
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Get current user + usage (Replit-style API used by server-side code)
  app.get(api.auth.me.path, requireAuth, async (req: any, res) => {
    const usage = await storage.getUserUsage(req.user.claims.sub);
    res.json({
      user: req.user.claims,
      usage,
    });
  });

  // Frontend auth hook expects /api/auth/user to return just the User object
  if (!process.env.REPL_ID) {
    // Local/dev: return a static mock user so the UI can load without real auth
    app.get("/api/auth/user", (_req, res) => {
      res.json({
        id: "mock-user-id",
        email: "mock@example.com",
        firstName: "Mock",
        lastName: "User",
        profileImageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  } else {
    // Replit / real auth: protect the route and return the authenticated user
    app.get("/api/auth/user", requireAuth, (req: any, res) => {
      res.json(req.user.claims);
    });
  }

  // Generate Quiz
  app.post(api.quizzes.generate.path, requireAuth, async (req: any, res) => {
    try {
      const input = api.quizzes.generate.input.parse(req.body);
      const userId = req.user.claims.sub;

      // Check credits (skip in development mode)
      const usage = await storage.getUserUsage(userId);
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (!isDevelopment && !usage.isPro && usage.quizzesGenerated >= 5) {
        return res.status(402).json({ message: "Free limit reached. Please upgrade to Pro." });
      }

      // Generate with AI
      const prompt = `You are a quiz generator.

      Create a ${input.difficulty} difficulty multiple-choice quiz on the topic "${input.topic}".
      The quiz must have EXACTLY ${input.amount} questions.

      Return ONLY valid JSON in the following shape (no extra text, no markdown):
      {
        "title": string,
        "questions": [
          {
            "questionText": string,
            "options": [string, string, string, string],
            "correctAnswer": string,
            "explanation": string
          },
          ...
        ]
      }

      Rules:
      - "options" must contain exactly 4 answer choices.
      - "correctAnswer" must be EXACTLY one of the strings in "options".
      - "explanation" must clearly explain:
        - why the correct answer is correct, and
        - why each of the other options is incorrect.
      - Do not include any keys other than the ones specified above.
      - Do not include any commentary outside the JSON.
      `;

      let quizData;

      if (!openai) {
        // Mock quiz data for development without OpenAI
        quizData = {
          title: `${input.topic} Quiz`,
          questions: [
            {
              questionText: `Sample question about ${input.topic}`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: "Option A",
              explanation: "This is a sample explanation"
            }
          ]
        };
        console.warn("Using mock quiz data - OpenRouter not configured");
      } else {
        const model = getNextModel();
        const completion = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: "You are a helpful quiz generator. Output valid JSON only." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        quizData = JSON.parse(content);
      }

      // Save to DB
      const quiz = await storage.createQuiz({
        userId,  // Fix: use userId as defined in the schema
        topic: input.topic,
        difficulty: input.difficulty,
        title: quizData.title || `${input.topic} Quiz`,
        questions: quizData.questions,
        isPublic: false
      } as any);  // Use type assertion to bypass schema validation

      // Increment usage
      await storage.incrementUsage(userId);

      res.status(201).json(quiz);

    } catch (err: any) {
      console.error("Quiz generation error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      const message = typeof err?.message === "string" ? err.message : "Failed to generate quiz";
      res.status(500).json({ message });
    }
  });

  // List Quizzes
  app.get(api.quizzes.list.path, requireAuth, async (req: any, res) => {
    const quizzes = await storage.getUserQuizzes(req.user.claims.sub);
    res.json(quizzes);
  });

  // Get Quiz
  app.get(api.quizzes.get.path, requireAuth, async (req: any, res) => {
    const quiz = await storage.getQuiz(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    
    // Authorization check
    if (quiz.userId !== req.user.claims.sub && !quiz.isPublic) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(quiz);
  });

  // Delete Quiz
  app.delete(api.quizzes.delete.path, requireAuth, async (req: any, res) => {
    const quiz = await storage.getQuiz(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.userId !== req.user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await storage.deleteQuiz(req.params.id);
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
