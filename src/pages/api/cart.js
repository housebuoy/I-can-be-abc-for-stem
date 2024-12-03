import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const { method, query, body } = req;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const cartsCollection = db.collection("carts");

    switch (method) {
      case "GET": {
        const { userId } = query;
        if (!userId) return res.status(400).json({ message: "User ID is required" });

        const cart = await cartsCollection.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        return res.status(200).json(cart);
      }

      case "POST": {
        const { userId, cartItems } = body;
        if (!userId || !cartItems) return res.status(400).json({ message: "User ID and cartItems are required" });

        await cartsCollection.updateOne(
          { userId },
          { $set: { cartItems } },
          { upsert: true }
        );

        return res.status(200).json({ message: "Cart updated successfully" });
      }

      default:
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("Error in /api/cart:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
