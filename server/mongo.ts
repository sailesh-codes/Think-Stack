import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "thinkstack";

const client = new MongoClient(uri);

let dbPromise: Promise<Db> | null = null;

export function getMongoDb(): Promise<Db> {
  if (!dbPromise) {
    dbPromise = client.connect().then((connected) => connected.db(dbName));
  }
  return dbPromise;
}
