import { pgTable, serial, text, boolean, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./models/auth";

export * from "./models/auth";
export * from "./models/chat";

// Extend users with relations (optional, but good for query builder)
export const usersRelations = relations(users, ({ many }) => ({
  quizzes: many(quizzes),
}));

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References users.id (which is varchar from auth)
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull(), // 'easy' | 'medium' | 'hard'
  title: text("title").notNull(),
  questions: jsonb("questions").notNull(), // Array of { question, options[], answer, explanation }
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizzesRelations = relations(quizzes, ({ one }) => ({
  user: one(users, {
    fields: [quizzes.userId],
    references: [users.id],
  }),
}));

// User usage tracking for credits
export const userUsage = pgTable("user_usage", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(), // One record per user
  quizzesGenerated: integer("quizzes_generated").default(0).notNull(),
  isPro: boolean("is_pro").default(false).notNull(),
});

// Zod Schemas
export const insertQuizSchema = createInsertSchema(quizzes).omit({ 
  id: true, 
  createdAt: true, 
  userId: true 
});

export const generateQuizSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  amount: z.number().min(1).max(10).default(5),
});

// Types
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type UserUsage = typeof userUsage.$inferSelect;
