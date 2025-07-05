// scripts/check-data.js
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

async function checkData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();

    // Check shows
    const shows = await db.collection("shows").find({}).toArray();
    console.log("\n=== הצגות ===");
    shows.forEach((show, index) => {
      console.log(`${index + 1}. ${show.title} (${show.venue})`);
      console.log(`   ID: ${show._id}`);
      console.log("   ---");
    });
    console.log(`סה"כ הצגות: ${shows.length}`);

    // Check reviews
    const reviews = await db.collection("reviews").find({}).toArray();
    console.log("\n=== ביקורות ===");
    reviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.userName} - דירוג: ${review.rating}`);
      console.log(`   הצגה: ${review.showId}`);
      console.log(`   תגובה: ${review.comment}`);
      console.log(`   ID: ${review._id}`);
      console.log("   ---");
    });
    console.log(`סה"כ ביקורות: ${reviews.length}`);

    // Check users
    const users = await db.collection("users").find({}).toArray();
    console.log("\n=== משתמשים ===");
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name || "לא צוין"})`);
      console.log(`   ID: ${user._id}`);
      console.log("   ---");
    });
    console.log(`סה"כ משתמשים: ${users.length}`);

    // Check for duplicates
    console.log("\n=== בדיקת כפילויות ===");

    // Check duplicate shows
    const showTitles = {};
    shows.forEach((show) => {
      if (showTitles[show.title]) {
        console.log(`⚠️  הצגה כפולה: ${show.title}`);
      } else {
        showTitles[show.title] = true;
      }
    });

    // Check duplicate reviews
    const reviewKeys = {};
    reviews.forEach((review) => {
      const key = `${review.showId}-${review.userName}-${review.comment}`;
      if (reviewKeys[key]) {
        console.log(
          `⚠️  ביקורת כפולה: ${review.userName} על הצגה ${review.showId}`
        );
      } else {
        reviewKeys[key] = true;
      }
    });

    // Check duplicate users
    const userEmails = {};
    users.forEach((user) => {
      if (userEmails[user.email]) {
        console.log(`⚠️  משתמש כפול: ${user.email}`);
      } else {
        userEmails[user.email] = true;
      }
    });
  } catch (error) {
    console.error("שגיאה:", error);
  } finally {
    await client.close();
  }
}

checkData();
