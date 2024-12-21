import { MongoClient } from "mongodb";
import { verifyRole } from "../../../middleware/verifyRole";

// Create a new API route to update the order status
export default async function handler(req, res) {
  const { method } = req;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Ensure only admin can access this endpoint
    await verifyRole("admin")(req, res, async () => {
      if (method !== "PUT") {
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
      }

      // Extract transaction ID and new status from request body
      const { deliveryCompany, officerInCharge, officerInChargeContact, status, transactionId } = req.body;

      // Validate required fields
      if (!transactionId || !status || !deliveryCompany || !officerInCharge ||!officerInChargeContact) {
        console.error("missing fields")
        return res.status(400).json({ message: "Transaction ID and status are required." });
      }

      // Connect to MongoDB
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const transactionsCollection = db.collection("orders");

      // Define allowed status values and their color codes
      const allowedStatuses = ["Pending", "Delivered", "Cancelled", "Out for Delivery", "Returned", "Refunded"];
      const statusColor = {
        Pending: "yellow",
        Delivered: "green",
        Cancelled: "red",
        "Out for Delivery": "blue",
        Returned: "orange",
        Refunded: "purple",
      };

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status." });        
      }

      // Update the order status in the database
      const result = await transactionsCollection.updateOne(
        { transactionId },
        {
          $set: {
            status,
            statusColor: statusColor[status],
            deliveryCompany,
            officerInCharge,
            officerInChargeContact,
          },
        }
      );      

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Order not found." });
      }

      console.log("Request body:", req.body);
      console.log("Result:", result);

      // Return the updated order information
      const updatedOrder = await transactionsCollection.findOne({ transactionId });

      res.status(200).json({ message: "Order status updated.", order: updatedOrder });
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  } finally {
    await client.close();
  }
}
