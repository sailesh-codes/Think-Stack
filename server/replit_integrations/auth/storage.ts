import { getDatabase } from "../../db";
import { type User, type UpsertUser } from "@shared/models/auth";
import { ObjectId } from "mongodb";

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
    const db = await getDatabase();
    const collection = db.collection('users');
    
    const result = await collection.findOneAndUpdate(
      { id: userData.id },
      { 
        $set: {
          ...userData,
          updatedAt: new Date(),
          createdAt: new Date() // Always set createdAt for new records
        }
      },
      { upsert: true, returnDocument: 'after' }
    );
    
    if (!result.value) {
      throw new Error('Failed to upsert user');
    }
    
    return result.value! as unknown as User;
  }
}

export const authStorage = new AuthStorage();
