const { MongoClient } = require("mongodb");
import { verifyRole } from "../../../middleware/verifyRole";

export default async function handler(req, res) {
  const { transactionId } = req.query;
  const { method } = req;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await verifyRole("admin")(req, res, async () => {
      if (method !== "GET") {
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
      }

      if (!transactionId) {
        return res.status(400).json({ message: "Transaction ID is required." });
      }

      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const ordersCollection = db.collection("orders");

      const order = await ordersCollection.findOne({ transactionId });

      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }

      res.status(200).json(order);
    });
  } catch (error) {
    console.error("Error fetching order by transaction ID:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    await client.close();
  }
}
