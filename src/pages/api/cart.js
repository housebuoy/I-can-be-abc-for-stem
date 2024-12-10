const { MongoClient } = require("mongodb");

export default async function handler(req, res) {
  const { method, query, body } = req;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log("Incoming request:", { method, query, body });

    // Ensure MongoDB connection is successful
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB.");

    const db = client.db(process.env.MONGODB_DB);
    const cartsCollection = db.collection("carts");

    if (method === "GET") {
      const { userId } = query;
      if (!userId) {
        console.error("Error: User ID is missing in the request.");
        return res.status(400).json({ message: "User ID is required" });
      }

      console.log("Fetching cart for userId:", userId);
      const cart = await cartsCollection.findOne({ userId });
      console.log("Cart fetched:", cart);
      return res.status(200).json(cart || { cartItems: [] });
    }

    if (method === "POST") {
      const { userId, cartItems } = body;
      if (!userId || !cartItems) {
        console.error("Error: Missing userId or cartItems in POST request.");
        return res.status(400).json({ message: "User ID and cartItems are required" });
      }

      console.log("Updating cart for userId:", userId, "with cartItems:", cartItems);
      await cartsCollection.updateOne(
        { userId },
        { $set: { cartItems } },
        { upsert: true }
      );
      console.log("Cart updated successfully.");
      return res.status(200).json({ message: "Cart updated successfully" });
    }

    console.error("Error: Unsupported HTTP method.");
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
