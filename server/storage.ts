import { getDatabase } from "./db";
import { 
  type Quiz, type InsertQuiz, type UserUsage 
} from "@shared/schema";
import { ObjectId, WithId } from "mongodb";

export interface IStorage {
  // User Usage
  getUserUsage(userId: string): Promise<UserUsage>;
  incrementUsage(userId: string): Promise<UserUsage>;
  setUserPro(userId: string, isPro: boolean): Promise<UserUsage>;

  // Quizzes
  createQuiz(quiz: InsertQuiz & { userId: string }): Promise<Quiz>;
  getQuiz(id: string): Promise<Quiz | undefined>;
  getUserQuizzes(userId: string): Promise<Quiz[]>;
  deleteQuiz(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUserUsage(userId: string): Promise<UserUsage> {
    const db = await getDatabase();
    const collection = db.collection('userUsage');
    
    let usageDoc = await collection.findOne({ userId });
    
    if (!usageDoc) {
      // Create default usage record
      const newUsage: UserUsage = {
        id: new ObjectId().toString(),
        userId,
        quizzesGenerated: 0,
        isPro: false
      };
      await collection.insertOne(newUsage as any);
      return newUsage;
    }
    
    return usageDoc as unknown as UserUsage;
  }

  async incrementUsage(userId: string): Promise<UserUsage> {
    console.log('🔍 incrementUsage called for userId:', userId);
    const db = await getDatabase();
    console.log('📊 Database connected:', !!db);
    const collection = db.collection('userUsage');
    console.log('📁 Collection ready');
    
    try {
      // First try to find existing usage
      const existing = await collection.findOne({ userId });
      console.log('Existing usage:', existing);
      
      if (existing) {
        // Update existing
        const result = await collection.updateOne(
          { userId },
          { $inc: { quizzesGenerated: 1 } }
        );
        console.log('Update result:', result);
        
        // Get the updated document
        const updated = await collection.findOne({ userId });
        return updated as unknown as UserUsage;
      } else {
        // Create new usage document
        const newUsage = {
          id: new ObjectId().toString(),
          userId,
          quizzesGenerated: 1,
          isPro: false
        };
        
        const result = await collection.insertOne(newUsage);
        console.log('Insert result:', result);
        
        return newUsage as unknown as UserUsage;
      }
    } catch (error) {
      console.error('MongoDB incrementUsage error:', error);
      throw new Error(`Failed to increment usage: ${(error as Error).message}`);
    }
  }

  async setUserPro(userId: string, isPro: boolean): Promise<UserUsage> {
    const db = await getDatabase();
    const collection = db.collection('userUsage');
    
    const result = await collection.findOneAndUpdate(
      { userId },
      { 
        $set: { isPro },
        $setOnInsert: { 
          id: new ObjectId().toString(),
          userId,
          quizzesGenerated: 0
        }
      },
      { upsert: true, returnDocument: 'after' }
    );
    
    if (!result.value) {
      throw new Error('Failed to set user pro status');
    }
    
    return result.value! as unknown as UserUsage;
  }

  async createQuiz(quiz: InsertQuiz & { userId: string }): Promise<Quiz> {
    const db = await getDatabase();
    const collection = db.collection('quizzes');
    
    const newQuiz: Quiz = {
      id: new ObjectId().toString(),
      ...quiz,
      createdAt: new Date()
    };
    
    await collection.insertOne(newQuiz as any);
    return newQuiz;
  }

  async getQuiz(id: string): Promise<Quiz | undefined> {
    const db = await getDatabase();
    const collection = db.collection('quizzes');
    
    const quizDoc = await collection.findOne({ id });
    return quizDoc ? (quizDoc as unknown as Quiz) : undefined;
  }

  async getUserQuizzes(userId: string): Promise<Quiz[]> {
    const db = await getDatabase();
    const collection = db.collection('quizzes');
    
    const quizDocs = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return quizDocs as unknown as Quiz[];
  }

  async deleteQuiz(id: string): Promise<void> {
    const db = await getDatabase();
    const collection = db.collection('quizzes');
    
    await collection.deleteOne({ id });
  }
}

export const storage = new DatabaseStorage();
