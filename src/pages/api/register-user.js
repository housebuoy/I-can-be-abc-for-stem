import { MongoClient } from "mongodb";

// Using cached client to improve performance (connection reuse)
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a new client for every request (for debugging)
  clientPromise = MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} else {
  // In production mode, create a single client instance to reuse
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    clientPromise = client.connect();
  }
}

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { uid, fullName, email } = req.body;

  // Validate required fields
  if (!uid || !fullName || !email) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const usersCollection = db.collection("User");

    // Check if user already exists by UID (for Firebase)
    const existingUser = await usersCollection.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Insert the new user into the database
    const result = await usersCollection.insertOne({
      uid,
      fullName,
      email,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "User registered successfully.", userId: result.insertedId });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export default handler;
