// scripts/check-production-data.js
const { MongoClient } = require("mongodb");

// משתמש ב-URI של פרודקשן (ללא -dev בסוף)
const uri =
  "mongodb+srv://helizakay1:Lsdfdslfkj-900-90-@cluster0.lm1gefl.mongodb.net/israeli-theater?retryWrites=true&w=majority&appName=Cluster0";

async function checkProductionData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB PRODUCTION");

    const db = client.db();

    // Check shows
    const shows = await db.collection("shows").find({}).toArray();
    console.log("\n=== הצגות בפרודקשן ===");
    shows.forEach((show, index) => {
      console.log(`${index + 1}. ${show.title} (${show.venue})`);
      console.log(`   ID: ${show._id}`);
      console.log("   ---");
    });
    console.log(`סה"כ הצגות: ${shows.length}`);

    // Check reviews
    const reviews = await db.collection("reviews").find({}).toArray();
    console.log("\n=== ביקורות בפרודקשן ===");
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
    console.log("\n=== משתמשים בפרודקשן ===");
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name || "לא צוין"})`);
      console.log(`   ID: ${user._id}`);
      console.log("   ---");
    });
    console.log(`סה"כ משתמשים: ${users.length}`);
  } catch (error) {
    console.error("שגיאה:", error);
  } finally {
    await client.close();
  }
}

checkProductionData();
