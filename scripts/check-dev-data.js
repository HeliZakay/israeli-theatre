// scripts/check-dev-data.js
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

// Use environment variable for MongoDB URI
const uri = process.env.MONGODB_URI;

async function checkDevData() {
  if (!uri) {
    console.error("MONGODB_URI environment variable is not set");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB DEV");

    const db = client.db();

    // Check shows
    const shows = await db.collection("shows").find({}).toArray();
    console.log("\n=== הצגות בפיתוח ===");
    shows.forEach((show, index) => {
      console.log(`${index + 1}. ${show.title} (${show.venue})`);
    });
    console.log(`סה"כ הצגות: ${shows.length}`);

    // Check reviews
    const reviews = await db.collection("reviews").find({}).toArray();
    console.log("\n=== ביקורות בפיתוח ===");
    reviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.userName} - דירוג: ${review.rating}`);
      console.log(`   תגובה: ${review.comment}`);
    });
    console.log(`סה"כ ביקורות: ${reviews.length}`);

    // Check users
    const users = await db.collection("users").find({}).toArray();
    console.log("\n=== משתמשים בפיתוח ===");
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name || "לא צוין"})`);
    });
    console.log(`סה"כ משתמשים: ${users.length}`);
  } catch (error) {
    console.error("שגיאה:", error);
  } finally {
    await client.close();
  }
}

checkDevData();
