import { z } from "zod";

// Re-export types from main schema for compatibility
export type { User, Session, UpsertUser } from "../schema";

// Session storage for MongoDB
export interface SessionData {
  sid: string;
  sess: any;
  expire: Date;
}

// User storage for MongoDB
export interface UserData {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Zod schemas for validation
export const sessionSchema = z.object({
  sid: z.string(),
  sess: z.any(),
  expire: z.date(),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
});
