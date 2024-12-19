import { MongoClient } from "mongodb";

// Use cached client for performance optimization
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  clientPromise = MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} else {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    clientPromise = client.connect();
  }
}

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const usersCollection = db.collection("User");

    // Get the total number of users
    const currentUserCount = await usersCollection.countDocuments();

    // For simplicity, let's assume we are comparing this with a hardcoded previous count (e.g., from last week)
    // You can adjust this to compare with actual historical data, for example, from a separate "Statistics" collection.
    const previousUserCount = 5000; // Hardcoded previous count (you can update this with actual data)

    // Calculate the percentage change
    const percentageChange = previousUserCount
      ? ((currentUserCount - previousUserCount) / previousUserCount) * 100
      : 0;

    // Return the current count and percentage change
    return res.status(200).json({
      totalCount: currentUserCount,
      countPercentageChange: percentageChange.toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export default handler;
