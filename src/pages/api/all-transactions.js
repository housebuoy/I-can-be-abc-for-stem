import { MongoClient } from "mongodb";
import { verifyRole } from "../../middleware/verifyRole";

// Create a new API route to fetch transactions
export default async function handler(req, res) {
  const { method } = req;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await verifyRole("admin")(req, res, async () => {
    if (method !== "GET") {
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const transactionsCollection = db.collection("orders");

    // Fetch all documents in the transaction collection
    const transactions = await transactionsCollection.find({}).toArray();

    // Return the transactions as a JSON response
    res.status(200).json({ transactions });
    })
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  } finally {
    await client.close();
  }
}
