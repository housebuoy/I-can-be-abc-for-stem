const { MongoClient } = require("mongodb");

export default async function handler(req, res) {
  const { method, body } = req;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log("Incoming request:", { method, body });

    // Connect to the MongoDB database
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const ordersCollection = db.collection("orders");

    switch (method) {
      case "POST": {
        const { userId, shippingDetails, cartItems, total, paymentReference, transactionId } = body;

        // Validate required fields
        if (!userId || !shippingDetails || !cartItems || !total || !paymentReference || !transactionId) {
          return res.status(400).json({ message: "Missing required order fields" });
        }

        // Insert order into the database
        const order = {
          userId,
          transactionId,
          shippingDetails,
          cartItems,          
          total,
          status: "Pending",
          paymentReference,
          createdAt: new Date(),
        };
        const result = await ordersCollection.insertOne(order);

        return res.status(201).json({ message: "Order created successfully", orderId: result.insertedId });
      }

      default:
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("Error in /api/orders handler:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  } finally {
    await client.close();
  }
}
