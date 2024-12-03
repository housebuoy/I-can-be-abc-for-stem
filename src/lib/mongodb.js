import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export const connectToDatabase = async () => {
  if (!client.isConnected()) {
    await client.connect();
  }
  const db = client.db(process.env.MONGODB_DB);
  return { db };
};
