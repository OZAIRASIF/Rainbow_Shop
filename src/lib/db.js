import { MongoClient } from "mongodb";

// const MONGO_URI = "mongodb://localhost:27017";
const MONGO_URI = process.env.MONGO_URI
const DB_NAME = "My_Store";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(MONGO_URI);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

// ✅ Get database
export async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

// ✅ Get collections (same as your db.py)
export async function getCollections() {
  const db = await getDb();
  return {
    usersCollection: db.collection("users"),
    studentsCollection: db.collection("students"),
    productsCollection: db.collection("Products"),
    cartsCollection: db.collection("Carts"),
    ordersCollection: db.collection("Orders"),
  };
}
