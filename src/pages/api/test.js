const { MongoClient } = require("mongodb");

const testConnection = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(process.env.MONGODB_DB);
    const transactions = await db.collection("transactions").find({ userId: "<USER_ID>" }).toArray();

    console.log("Transactions:", transactions);
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    await client.close();
  }
};

testConnection();
