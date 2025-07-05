// scripts/list-collections.js
const { MongoClient } = require("mongodb");

// משתמש ב-URI של פרודקשן (ללא -dev בסוף)
const uri =
  "mongodb+srv://helizakay1:Lsdfdslfkj-900-90-@cluster0.lm1gefl.mongodb.net/israeli-theater?retryWrites=true&w=majority&appName=Cluster0";

async function listCollections() {
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
