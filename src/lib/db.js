import { MongoClient } from "mongodb";

let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient.db(process.env.MONGO_DB_NAME);
  }

  const client = await MongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = client;
  return client.db(process.env.MONGO_DB_NAME);
}
