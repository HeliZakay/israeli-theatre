// scripts/clean-all-data.js
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

async function cleanAllData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();

    // Delete all shows
    console.log("מוחק את כל ההצגות...");
    const showsResult = await db.collection("shows").deleteMany({});
    console.log(`נמחקו ${showsResult.deletedCount} הצגות`);

    // Delete all reviews
    console.log("מוחק את כל הביקורות...");
    const reviewsResult = await db.collection("reviews").deleteMany({});
    console.log(`נמחקו ${reviewsResult.deletedCount} ביקורות`);

    // Keep users as they are
    console.log("משתמשים נשארים כמו שהם");

    console.log("\n✅ ניקוי הושלם! עכשיו אפשר להריץ populate-db.js");
  } catch (error) {
    console.error("שגיאה:", error);
  } finally {
    await client.close();
  }
}

cleanAllData();
