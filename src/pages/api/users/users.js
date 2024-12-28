import { connectToDatabase } from "@/lib/mongodb"; // Import the connect function

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    // Handle GET request: Fetch users from the "users" collection
    if (req.method === 'GET') {
      const users = await db
        .collection("User") // Collection name
        .find({})
        .project({ uid: 1, fullName: 1, email: 1, createdAt: 1, role: 1 }) // Include role
        .toArray();
      res.status(200).json(users);
      return;
    }

    // Handle PUT request: Update user role
    if (req.method === 'PUT') {
      const { uid, role } = req.body;

      // Ensure UID and role are provided
      if (!uid || !role) {
        return res.status(400).json({ message: 'User UID and role are required' });
      }

      // Update the user role in the "User" collection
      const result = await db
        .collection("User")
        .updateOne({ uid: uid }, { $set: { role: role } });

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send success response
      res.status(200).json({ message: `User ${uid} role updated to ${role}` });
      return;
    }

    // Handle unsupported methods
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });

  } catch (error) {
    console.error("Error fetching/updating users:", error);
    res.status(500).json({ message: "Error processing the request" });
  }
}
