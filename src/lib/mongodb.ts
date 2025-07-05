// src/lib/mongodb.ts
import { MongoClient } from "mongodb";

// Handle missing URI during build time
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/fallback";
if (!process.env.MONGODB_URI && process.env.NODE_ENV !== "production") {
  console.warn("MongoDB URI not found. Using fallback for development.");
}
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  maxIdleTimeMS: 30000,
  minPoolSize: 5,
  // SSL options for better compatibility
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
