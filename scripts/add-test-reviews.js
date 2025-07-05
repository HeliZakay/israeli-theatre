// scripts/add-test-reviews.js
const { MongoClient, ObjectId } = require("mongodb");

const uri =
  "mongodb+srv://helizakay1:Lsdfdslfkj-900-90-@cluster0.lm1gefl.mongodb.net/israeli-theater?retryWrites=true&w=majority&appName=Cluster0";

async function addTestReviews() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB PRODUCTION");

    const db = client.db();

    // Get show IDs
    const shows = await db.collection("shows").find().toArray();
    console.log("Available shows:", shows.length);

    // Add a few more reviews to test
    const newReviews = [
      {
        showId: new ObjectId("681e8934de9a13015d8036dd"), // מלכת היופי של ירושלים
        userName: "יוסי כהן",
        rating: 4,
        comment: "הצגה מרגשת ומעוררת מחשבה. משחק מצוין.",
        createdAt: new Date(),
      },
      {
        showId: new ObjectId("681e89d2de9a13015d8036de"), // דתילונים
        userName: "שרה לוי",
        rating: 5,
        comment: "הצגה מבדרת ומשעשעת. מומלץ בחום!",
        createdAt: new Date(),
      },
      {
        showId: new ObjectId("681e8a29de9a13015d8036df"), // אפס ביחסי אנוש
        userName: "מיכל אברהם",
        rating: 3,
        comment: "הצגה בסדר, יש מקום לשיפור.",
        createdAt: new Date(),
      },
    ];

    const result = await db.collection("reviews").insertMany(newReviews);
    console.log(`Added ${result.insertedCount} new reviews`);

    // Now check total reviews
    const totalReviews = await db.collection("reviews").countDocuments();
    console.log(`Total reviews in database: ${totalReviews}`);

    // Get latest 5 reviews
    const latestReviews = await db
      .collection("reviews")
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    console.log("\n=== Latest 5 reviews ===");
    latestReviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.userName} - Rating: ${review.rating}`);
      console.log(`   Comment: ${review.comment}`);
      console.log("   ---");
    });

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

addTestReviews();
