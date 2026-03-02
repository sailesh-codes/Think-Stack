import { z } from "zod";

// MongoDB Collections (we'll use TypeScript interfaces for type safety)

export interface User {
  _id?: string;
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Session {
  _id?: string;
  sid: string;
  sess: any;
  expire: Date;
}

export interface Quiz {
  _id?: string;
  id: string;
  userId: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  questions: Array<{
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }>;
  isPublic: boolean;
  isOrganization?: boolean;
  createdAt: Date;
}

export interface UserUsage {
  _id?: string;
  id: string;
  userId: string;
  quizzesGenerated: number;
  organizationQuizzesGenerated: number;
  isPro: boolean;
}

// Zod Schemas for validation
export const insertQuizSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  title: z.string().min(1, "Title is required"),
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    answer: z.string(),
    explanation: z.string()
  })),
  isPublic: z.boolean().default(false)
});

export const generateQuizSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  amount: z.number().min(1).max(10).default(5),
  isOrganization: z.boolean().optional().default(false),
});

export const upsertUserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
});

// Types
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type GenerateQuiz = z.infer<typeof generateQuizSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
