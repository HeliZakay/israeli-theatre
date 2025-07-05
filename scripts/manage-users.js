// scripts/manage-users.js
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

async function listUsers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const users = await db.collection("users").find({}).toArray();

    console.log("\n=== רשימת משתמשים ===");
    users.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.email} (שם: ${user.name || "לא צוין"})`
      );
      console.log(`   ID: ${user._id}`);
      console.log(`   נוצר: ${user.createdAt || "לא ידוע"}`);
      console.log("   ---");
    });

    console.log(`\nסה"כ משתמשים: ${users.length}`);
  } catch (error) {
    console.error("שגיאה:", error);
  } finally {
    await client.close();
  }
}

async function deleteUserByEmail(email) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const result = await db.collection("users").deleteOne({ email });

    if (result.deletedCount === 1) {
      console.log(`✅ המשתמש ${email} נמחק בהצלחה`);
    } else {
      console.log(`❌ משתמש עם האימייל ${email} לא נמצא`);
    }
  } catch (error) {
    console.error("שגיאה במחיקה:", error);
  } finally {
    await client.close();
  }
}

async function deleteAllUsers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const result = await db.collection("users").deleteMany({});

    console.log(`✅ נמחקו ${result.deletedCount} משתמשים`);
  } catch (error) {
    console.error("שגיאה במחיקה:", error);
  } finally {
    await client.close();
  }
}

// בדיקת הפרמטרים מהטרמינל
const command = process.argv[2];
const email = process.argv[3];

switch (command) {
  case "list":
    listUsers();
    break;
  case "delete":
    if (!email) {
      console.log("❌ נא לציין אימייל למחיקה");
      console.log(
        "דוגמה: node scripts/manage-users.js delete user@example.com"
      );
    } else {
      deleteUserByEmail(email);
    }
    break;
  case "delete-all":
    console.log("⚠️  האם את בטוחה שאת רוצה למחוק את כל המשתמשים?");
    console.log("הרצי: node scripts/manage-users.js confirm-delete-all");
    break;
  case "confirm-delete-all":
    deleteAllUsers();
    break;
  default:
    console.log("\n🔧 ניהול משתמשים - תיאטרון ישראל\n");
    console.log("פקודות זמינות:");
    console.log(
      "  node scripts/manage-users.js list                    - הצגת כל המשתמשים"
    );
    console.log(
      "  node scripts/manage-users.js delete <email>          - מחיקת משתמש לפי אימייל"
    );
    console.log(
      "  node scripts/manage-users.js delete-all              - מחיקת כל המשתמשים"
    );
    console.log("\nדוגמאות:");
    console.log("  node scripts/manage-users.js list");
    console.log("  node scripts/manage-users.js delete user@example.com");
}
