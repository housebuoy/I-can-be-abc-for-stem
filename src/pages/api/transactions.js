const { MongoClient } = require("mongodb");

export default async function handler(req, res) {
  const { method, query } = req;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log("Connecting to MongoDB...");

    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db(process.env.MONGODB_DB);
    const transactionsCollection = db.collection("orders");

    if (method === "GET") {
      const { userId } = query;

      // Log the incoming query parameter
      console.log("Received userId:", userId);

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Perform the database query
      console.log("Querying transactions for userId:", userId);
      const transactions = await transactionsCollection.find({ userId }).toArray();

      console.log("Query result:", transactions);

      if (transactions.length === 0) {
        return res.status(404).json({ message: "No transactions found" });
      }

      return res.status(200).json({ transactions });
    }

    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error("Error in transactions API:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}
