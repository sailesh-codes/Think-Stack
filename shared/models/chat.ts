import { z } from "zod";

// MongoDB Collections for Chat

export interface Conversation {
  _id?: string;
  id: string;
  title: string;
  createdAt: Date;
}

export interface Message {
  _id?: string;
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

// Zod schemas for validation
export const insertConversationSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const insertMessageSchema = z.object({
  conversationId: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, "Content is required"),
});

// Types
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

