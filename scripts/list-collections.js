// scripts/list-collections.js
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

// Use environment variable for MongoDB URI
const uri = process.env.MONGODB_URI;

async function listCollections() {
  if (!uri) {
    console.error("MONGODB_URI environment variable is not set");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB PRODUCTION");

    const db = client.db();

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("\n=== כל האוספים (Collections) בפרודקשן ===");
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name}`);
    });

    // Also check all databases
    const admin = db.admin();
    const dbs = await admin.listDatabases();
    console.log("\n=== כל בסיסי הנתונים ===");
    dbs.databases.forEach((database, index) => {
      console.log(`${index + 1}. ${database.name}`);
    });
  } catch (error) {
    console.error("שגיאה:", error);
  } finally {
    await client.close();
  }
}

listCollections();
