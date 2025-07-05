// scripts/check-reviews-detailed.js
const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://helizakay1:Lsdfdslfkj-900-90-@cluster0.lm1gefl.mongodb.net/israeli-theater?retryWrites=true&w=majority&appName=Cluster0";

async function checkReviewsDetailed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB PRODUCTION");

    const db = client.db();

    // Get all reviews sorted by creation date (newest first)
    const reviews = await db
      .collection("reviews")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`\n=== כל הביקורות (${reviews.length}) ===`);
    reviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.userName} - דירוג: ${review.rating}`);
      console.log(`   הצגה: ${review.showId}`);
      console.log(`   תגובה: ${review.comment}`);
      console.log(`   תאריך: ${review.createdAt || "לא צוין"}`);
      console.log(`   ID: ${review._id}`);
      console.log("   ---");
    });

    // Also check the shows to get titles
    const shows = await db.collection("shows").find().toArray();
    const showTitleMap = {};
    shows.forEach((show) => {
      showTitleMap[show._id.toString()] = show.title;
    });

    console.log("\n=== ביקורות עם כותרות הצגות ===");
    reviews.forEach((review, index) => {
      const showTitle = showTitleMap[review.showId.toString()] || "הצגה לא ידועה";
      console.log(`${index + 1}. ${review.userName} על "${showTitle}"`);
      console.log(`   דירוג: ${review.rating}`);
      console.log(`   תגובה: ${review.comment}`);
      console.log(`   תאריך: ${review.createdAt || "לא צוין"}`);
      console.log("   ---");
    });

  } catch (error) {
    console.error("שגיאה:", error);
  } finally {
    await client.close();
  }
}

checkReviewsDetailed();
