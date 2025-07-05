// scripts/test-homepage-queries.js
const { MongoClient } = require("mongodb");

// משתמש ב-URI של פרודקשן (ללא -dev בסוף)
const uri =
  "mongodb+srv://helizakay1:Lsdfdslfkj-900-90-@cluster0.lm1gefl.mongodb.net/israeli-theater?retryWrites=true&w=majority&appName=Cluster0";

async function testHomepageQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB PRODUCTION");

    const db = client.db();

    // Test the exact same query as in the homepage
    console.log("\n=== Testing shows query ===");
    const shows = await db.collection("shows").find().toArray();
    console.log("Shows found:", shows.length);

    // Test the exact same query as in the homepage for reviews
    console.log("\n=== Testing reviews query ===");
    const reviews = await db
      .collection("reviews")
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    console.log("Reviews found:", reviews.length);
    console.log("Reviews data:");
    reviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.userName} - Rating: ${review.rating}`);
      console.log(`   Show: ${review.showId}`);
      console.log(`   Created: ${review.createdAt}`);
      console.log(`   ---`);
    });

    // Test mapping like in homepage
    const showTitleMap = {};
    shows.forEach((show) => {
      showTitleMap[show._id.toString()] = show.title;
    });

    console.log("\n=== Reviews with show titles ===");
    reviews.forEach((review, index) => {
      const showTitle = showTitleMap[review.showId.toString()] || "Unknown show";
      console.log(`${index + 1}. ${review.userName} on "${showTitle}"`);
      console.log(`   Rating: ${review.rating}`);
      console.log(`   Comment: ${review.comment}`);
      console.log(`   ---`);
    });

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

testHomepageQueries();
