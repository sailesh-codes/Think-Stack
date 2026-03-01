import { getDatabase } from "../../db";
import { type User, type UpsertUser } from "@shared/models/auth";

// Interface for auth storage operations
// (IMPORTANT) These user operations are mandatory for Replit Auth.
export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const db = await getDatabase();
    const collection = db.collection('users');
    
    const userDoc = await collection.findOne({ id });
    return userDoc ? (userDoc as unknown as User) : undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const db = await getDatabase();
      const collection = db.collection('users');

      const now = new Date();
      const result = await collection.findOneAndUpdate(
        { id: userData.id },
        {
          $set: {
            ...userData,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        { upsert: true, returnDocument: 'after' }
      );

      if (result?.value) {
        return result.value as unknown as User;
      }

      // Fallback: in rare cases drivers can return null value even when write succeeded.
      const userDoc = await collection.findOne({ id: userData.id });
      if (userDoc) {
        return userDoc as unknown as User;
      }

      throw new Error('Failed to upsert user');
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to upsert user: ${msg}`);
    }
  }
}

export const authStorage = new AuthStorage();
