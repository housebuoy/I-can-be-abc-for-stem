const { MongoClient } = require("mongodb");

export default async function handler(req, res) {
  const { method } = req;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    if (method !== "GET") {
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const ordersCollection = db.collection("orders");

    // Get the start of the current week and the previous week
    const now = new Date();
    const startOfCurrentWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfPreviousWeek = new Date(startOfCurrentWeek);
    startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);

    // Query for counts and total revenue for the current week
    const currentWeekOrders = await ordersCollection.aggregate([
      { $match: { createdAt: { $gte: startOfCurrentWeek } } },
      { $group: { _id: null, count: { $sum: 1 }, totalRevenue: { $sum: "$total" } } },
    ]).toArray();

    const currentWeekCount = currentWeekOrders.length > 0 ? currentWeekOrders[0].count : 0;
    const currentWeekRevenue = currentWeekOrders.length > 0 ? currentWeekOrders[0].totalRevenue : 0;

    // Query for counts and total revenue for the previous week
    const previousWeekOrders = await ordersCollection.aggregate([
      { $match: { createdAt: { $gte: startOfPreviousWeek, $lt: startOfCurrentWeek } } },
      { $group: { _id: null, count: { $sum: 1 }, totalRevenue: { $sum: "$total" } } },
    ]).toArray();

    const previousWeekCount = previousWeekOrders.length > 0 ? previousWeekOrders[0].count : 0;
    const previousWeekRevenue = previousWeekOrders.length > 0 ? previousWeekOrders[0].totalRevenue : 0;

    // Calculate the total count and total revenue for all orders
    const totalCount = await ordersCollection.countDocuments({});
    const totalRevenue = await ordersCollection.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]).toArray();
    
    const totalRevenueAmount = totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0;

    // Calculate the difference and percentage change for counts and revenue
    const countDifference = currentWeekCount - previousWeekCount;
    const countPercentageChange = previousWeekCount > 0
      ? ((countDifference / previousWeekCount) * 100).toFixed(2)
      : currentWeekCount > 0
      ? 100
      : 0;

    const revenueDifference = currentWeekRevenue - previousWeekRevenue;
    const revenuePercentageChange = previousWeekRevenue > 0
      ? ((revenueDifference / previousWeekRevenue) * 100).toFixed(2)
      : currentWeekRevenue > 0
      ? 100
      : 0;

    // Return the response
    res.status(200).json({
      currentWeekCount,
      previousWeekCount,
      totalCount,
      currentWeekRevenue,
      previousWeekRevenue,
      totalRevenueAmount,
      countDifference,
      countPercentageChange,
      revenueDifference,
      revenuePercentageChange,
    });
  } catch (error) {
    console.error("Error in /api/orders/weekly-stats:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  } finally {
    await client.close();
  }
}
