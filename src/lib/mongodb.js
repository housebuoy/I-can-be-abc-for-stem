// lib/mongodb.js

import { MongoClient } from "mongodb";

// Initialize MongoClient with URI and options
const client = new MongoClient(process.env.MONGODB_URI);

export const connectToDatabase = async () => {
  try {
    // Always attempt to connect when the function is called
    await client.connect();

    const db = client.db(process.env.MONGODB_DB);
    return { db };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Could not connect to the database.");
  }
};
