// scripts/clean-duplicates.js
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

async function cleanDuplicates() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();

    // Clean duplicate shows
    console.log("\n=== מנקה הצגות כפולות ===");
    const shows = await db.collection("shows").find({}).toArray();
    const seenShows = new Set();
    let showsToDelete = [];

    shows.forEach((show) => {
      const key = `${show.title}-${show.venue}`;
      if (seenShows.has(key)) {
        showsToDelete.push(show._id);
        console.log(`מוצא כפילות: ${show.title} - ${show.venue}`);
      } else {
        seenShows.add(key);
      }
    });

    if (showsToDelete.length > 0) {
      const result = await db.collection("shows").deleteMany({
        _id: { $in: showsToDelete },
      });
      console.log(`נמחקו ${result.deletedCount} הצגות כפולות`);
    }

    // Clean duplicate reviews
    console.log("\n=== מנקה ביקורות כפולות ===");
    const reviews = await db.collection("reviews").find({}).toArray();
    const seenReviews = new Set();
    let reviewsToDelete = [];

    reviews.forEach((review) => {
      const key = `${review.showId}-${review.userName}-${review.comment}`;
      if (seenReviews.has(key)) {
        reviewsToDelete.push(review._id);
        console.log(`מוצא כפילות: ביקורת של ${review.userName}`);
      } else {
        seenReviews.add(key);
      }
    });

    if (reviewsToDelete.length > 0) {
      const result = await db.collection("reviews").deleteMany({
        _id: { $in: reviewsToDelete },
      });
      console.log(`נמחקו ${result.deletedCount} ביקורות כפולות`);
    }

    // Clean duplicate users
    console.log("\n=== מנקה משתמשים כפולים ===");
    const users = await db.collection("users").find({}).toArray();
    const seenUsers = new Set();
    let usersToDelete = [];

    users.forEach((user) => {
      if (seenUsers.has(user.email)) {
        usersToDelete.push(user._id);
        console.log(`מוצא כפילות: ${user.email}`);
      } else {
        seenUsers.add(user.email);
      }
    });

    if (usersToDelete.length > 0) {
      const result = await db.collection("users").deleteMany({
        _id: { $in: usersToDelete },
      });
      console.log(`נמחקו ${result.deletedCount} משתמשים כפולים`);
    }

    console.log("\n✅ ניקוי הכפילויות הושלם!");
  } catch (error) {
    console.error("שגיאה:", error);
  } finally {
    await client.close();
  }
}

cleanDuplicates();
