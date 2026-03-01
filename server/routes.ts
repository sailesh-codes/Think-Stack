import type { Express } from "express";
import type { Server } from "http";
import { getSession, setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { setupGoogleAuth } from "./auth/googleAuth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import passport from "passport";

// Admin emails for unlimited quizzes and admin dashboard access
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || "codecraft2k@gmail.com,thinkstack.ai.cc@gmail.com")
    .split(",")
    .map(e => e.trim().toLowerCase())
);

// Helper to check if authenticated user is admin
function isAdmin(req: any): boolean {
  const email = req.user?.claims?.email || req.user?.email;
  return email ? ADMIN_EMAILS.has(email.toLowerCase()) : false;
}

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

  // Setup Google OAuth if credentials are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log("Setting up Google OAuth authentication...");

    // If Replit auth isn't configured, we still must initialize session + passport
    // so that req.isAuthenticated(), req.user, and session persistence work for Google OAuth.
    if (!process.env.REPL_ID) {
      app.set("trust proxy", 1);
      app.use(getSession());
      app.use(passport.initialize());
      app.use(passport.session());
    }

    setupGoogleAuth();
  }

  // Protected middleware - require auth when configured
  const requireAuth = (req: any, res: any, next: any) => {
    const acceptsHtml =
      typeof req.headers?.accept === "string" &&
      req.headers.accept.includes("text/html");

    // If Google OAuth is configured, require authentication
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      if (typeof req.isAuthenticated === "function" && req.isAuthenticated()) {
        // Normalize Google user objects into the shape expected by the rest of the server
        // (Replit auth stores user info under req.user.claims).
        if (req.user && !req.user.claims) {
          req.user.claims = {
            sub: req.user.id,
            email: req.user.email,
            first_name: req.user.firstName,
            last_name: req.user.lastName,
            profile_image_url: req.user.profileImageUrl,
          };
        }
        return next();
      }
      if (req.method === "GET" && acceptsHtml) {
        return res.redirect("/login");
      }
      return res
        .status(401)
        .json({ message: "Authentication required. Please login with Google." });
    }

    // If Replit auth is configured, require authentication
    if (process.env.REPL_ID) {
      if (req.isAuthenticated()) {
        return next();
      }
      if (req.method === "GET" && acceptsHtml) {
        return res.redirect("/login");
      }
      return res
        .status(401)
        .json({ message: "Authentication required. Please login with Replit." });
    }

    // No auth configured (development mode), allow with mock user
    req.user = {
      claims: {
        sub: "mock-user-id",
        email: "mock@example.com",
        name: "Mock User",
      },
    };
    return next();
  };

  // Google OAuth Routes
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get("/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get("/auth/google/callback", (req, res, next) => {
      passport.authenticate(
        "google",
        { failureRedirect: "/login" },
        (err: any, user: any) => {
          if (err) {
            console.error("Google OAuth callback error:", err);
            return res.status(500).json({
              message:
                err instanceof Error
                  ? err.message
                  : "Google OAuth callback failed",
            });
          }
          if (!user) {
            return res.redirect("/login");
          }
          req.logIn(user, (loginErr) => {
            if (loginErr) {
              console.error("Google OAuth req.logIn error:", loginErr);
              return res.status(500).json({
                message:
                  loginErr instanceof Error
                    ? loginErr.message
                    : "Login session setup failed",
              });
            }
            if (req.session) {
              return req.session.save(() => res.redirect("/"));
            }
            return res.redirect("/");
          });
        }
      )(req, res, next);
    });

    app.post("/auth/logout", (req, res) => {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed" });
        }
        res.json({ message: "Logged out successfully" });
      });
    });
  }

  // Get current user + usage (Replit-style API used by server-side code)
  app.get(api.auth.me.path, requireAuth, async (req: any, res) => {
    const usage = await storage.getUserUsage(req.user.claims.sub);
    res.json({
      user: req.user.claims,
      usage,
    });
  });

  // Frontend auth hook expects /api/auth/user to return just the User object
  if (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
  ) {
    // Google OAuth configured: require auth so the client can accurately know login state
    app.get("/api/auth/user", requireAuth, (req: any, res) => {
      res.json(req.user.claims);
    });
  } else if (!process.env.REPL_ID) {
    // Local/dev without any real auth configured: return a static mock user so the UI can load
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

  // Admin-only routes
  app.get("/api/admin/summary", requireAuth, async (req: any, res) => {
    console.log('Admin summary request from user:', req.user?.claims?.email);
    if (!isAdmin(req)) {
      console.log('Admin access denied for user:', req.user?.claims?.email);
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      console.log('Fetching admin summary...');
      const db = await (await import("./db")).getDatabase();
      const usersCollection = db.collection('users');
      const quizzesCollection = db.collection('quizzes');
      const userUsageCollection = db.collection('userUsage');

      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const yearStart = new Date(now.getFullYear(), 0, 1);

      const [totalUsers, totalQuizzes, totalUsage] = await Promise.all([
        usersCollection.countDocuments(),
        quizzesCollection.countDocuments(),
        userUsageCollection.aggregate([
          { $group: { _id: null, total: { $sum: "$quizzesGenerated" } } }
        ]).toArray()
      ]);

      const quizzesGeneratedToday = await quizzesCollection.countDocuments({
        createdAt: { $gte: todayStart }
      });

      // Login statistics based on user creation/last login timestamps
      const [
        loginsToday,
        loginsThisWeek,
        loginsThisMonth,
        loginsThisYear,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        newUsersThisYear
      ] = await Promise.all([
        // Users who logged in today (using updatedAt as proxy for last login)
        usersCollection.countDocuments({ updatedAt: { $gte: todayStart } }),
        // Users who logged in this week
        usersCollection.countDocuments({ updatedAt: { $gte: weekStart } }),
        // Users who logged in this month
        usersCollection.countDocuments({ updatedAt: { $gte: monthStart } }),
        // Users who logged in this year
        usersCollection.countDocuments({ updatedAt: { $gte: yearStart } }),
        // New users today
        usersCollection.countDocuments({ createdAt: { $gte: todayStart } }),
        // New users this week
        usersCollection.countDocuments({ createdAt: { $gte: weekStart } }),
        // New users this month
        usersCollection.countDocuments({ createdAt: { $gte: monthStart } }),
        // New users this year
        usersCollection.countDocuments({ createdAt: { $gte: yearStart } })
      ]);

      const result = {
        totalUsers,
        totalQuizzes,
        quizzesGeneratedToday,
        totalQuizzesGenerated: totalUsage[0]?.total || 0,
        loginStats: {
          today: loginsToday,
          thisWeek: loginsThisWeek,
          thisMonth: loginsThisMonth,
          thisYear: loginsThisYear,
        },
        newUserStats: {
          today: newUsersToday,
          thisWeek: newUsersThisWeek,
          thisMonth: newUsersThisMonth,
          thisYear: newUsersThisYear,
        }
      };

      console.log('Admin summary result:', result);
      res.json(result);
    } catch (error) {
      console.error("Admin summary error:", error);
      res.status(500).json({ message: "Failed to fetch admin summary" });
    }
  });

// ...
  app.get("/api/admin/quizzes", requireAuth, async (req: any, res) => {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const db = await (await import("./db")).getDatabase();
      const quizzesCollection = db.collection('quizzes');
      
      const quizzes = await quizzesCollection
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

      res.json(quizzes);
    } catch (error) {
      console.error("Admin quizzes error:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  app.delete("/api/admin/quizzes/:id", requireAuth, async (req: any, res) => {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const { id } = req.params;
      await storage.deleteQuiz(id);
      res.status(204).send();
    } catch (error) {
      console.error("Admin delete quiz error:", error);
      res.status(500).json({ message: "Failed to delete quiz" });
    }
  });

  // Generate Quiz
  app.post(api.quizzes.generate.path, requireAuth, async (req: any, res) => {
    try {
      const input = api.quizzes.generate.input.parse(req.body);
      const userId = req.user.claims.sub;

      // Check credits (skip in development mode or for admins)
      const usage = await storage.getUserUsage(userId);
      const isDevelopment = process.env.NODE_ENV === 'development';
      const userIsAdmin = isAdmin(req);
      
      if (!isDevelopment && !userIsAdmin && !usage.isPro && usage.quizzesGenerated >= 5) {
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
