import { db } from "./db";
import { 
  quizzes, userUsage, users,
  type Quiz, type InsertQuiz, type UserUsage 
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // User Usage
  getUserUsage(userId: string): Promise<UserUsage>;
  incrementUsage(userId: string): Promise<UserUsage>;
  setUserPro(userId: string, isPro: boolean): Promise<UserUsage>;

  // Quizzes
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  getUserQuizzes(userId: string): Promise<Quiz[]>;
  deleteQuiz(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUserUsage(userId: string): Promise<UserUsage> {
    const [usage] = await db
      .select()
      .from(userUsage)
      .where(eq(userUsage.userId, userId));
    
    if (!usage) {
      // Create default usage record
      const [newUsage] = await db
        .insert(userUsage)
        .values({ userId, quizzesGenerated: 0, isPro: false })
        .returning();
      return newUsage;
    }
    
    return usage;
  }

  async incrementUsage(userId: string): Promise<UserUsage> {
    const [usage] = await db
      .insert(userUsage)
      .values({ userId, quizzesGenerated: 1 })
      .onConflictDoUpdate({
        target: userUsage.userId,
        set: { 
          quizzesGenerated: sql`${userUsage.quizzesGenerated} + 1` 
        },
      })
      .returning();
    return usage;
  }

  async setUserPro(userId: string, isPro: boolean): Promise<UserUsage> {
    const [usage] = await db
      .insert(userUsage)
      .values({ userId, isPro })
      .onConflictDoUpdate({
        target: userUsage.userId,
        set: { isPro },
      })
      .returning();
    return usage;
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async getUserQuizzes(userId: string): Promise<Quiz[]> {
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.userId, userId))
      .orderBy(sql`${quizzes.createdAt} DESC`);
  }

  async deleteQuiz(id: number): Promise<void> {
    await db.delete(quizzes).where(eq(quizzes.id, id));
  }
}

export const storage = new DatabaseStorage();
