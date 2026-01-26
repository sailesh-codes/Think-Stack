import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}

const uri: string = process.env.MONGODB_URI;
const dbName: string = process.env.MONGODB_DB || "thinkstack";

const client = new MongoClient(uri);

let dbPromise: Promise<Db> | undefined;

export function getMongoDb(): Promise<Db> {
  if (!dbPromise) {
    dbPromise = client.connect().then((connected: MongoClient) => connected.db(dbName));
  }
  // At this point dbPromise is guaranteed to be set
  return dbPromise as Promise<Db>;
}
