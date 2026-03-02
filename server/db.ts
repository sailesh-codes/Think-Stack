import { MongoClient, Db } from "mongodb";
import * as schema from "@shared/schema";

// Load dotenv if not already loaded
import { config } from "dotenv";
config();

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set. Using mock database for development.");
  // For development without database, we'll use a mock
  process.env.DATABASE_URL = "mongodb://localhost:27017/thinkstack";
} else if (process.env.DATABASE_URL.includes("159.41.196.")) {
  console.warn("Remote MongoDB detected. Switching to local MongoDB for development.");
  process.env.DATABASE_URL = "mongodb://localhost:27017/thinkstack";
}

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (client) {
    return { client, db };
  }

  client = new MongoClient(process.env.DATABASE_URL!);
  await client.connect();
  db = client.db();
  
  return { client, db };
}

export async function getDatabase() {
  if (!db) {
    await connectToDatabase();
  }
  return db;
}

// Export a simple db object for compatibility
export const database = {
  collection: (name: string) => getDatabase().then(db => db.collection(name))
};
