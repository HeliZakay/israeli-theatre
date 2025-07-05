// scripts/populate-db.js
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

async function populateDatabase() {
  if (!uri) {
    console.error("MONGODB_URI not found in environment variables");
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();

    // Add shows
    const shows = [
      {
        title: "קזבלן",
        venue: "תיאטרון הבימה",
        posterUrl: "/images/kazablan.jpg",
        createdAt: new Date(),
      },
      {
        title: "חבדניקים",
        venue: "תיאטרון הקאמרי",
        posterUrl: "/images/hachabadnikim.jpg",
        createdAt: new Date(),
      },
      {
        title: "שווצברים",
        venue: "תיאטרון הביתן",
        posterUrl: "/images/shusterman.jpg",
        createdAt: new Date(),
      },
      {
        title: "אפס ביחס אנוש",
        venue: "תיאטרון הסימטה",
        posterUrl: "/images/efes-beyachas-enosh.jpg",
        createdAt: new Date(),
      },
      {
        title: "מיקי מציל",
        venue: "תיאטרון הילדים",
        posterUrl: "/images/miki-matzil.jpg",
        createdAt: new Date(),
      },
      {
        title: "הכל אודות איב",
        venue: "תיאטרון הקלוב",
        posterUrl: "/images/hakol-odot-eve.jpg",
        createdAt: new Date(),
      },
    ];

    const showsResult = await db.collection("shows").insertMany(shows);
    console.log(`Inserted ${showsResult.insertedCount} shows`);

    // Add reviews
    const reviews = [
      {
        showId: showsResult.insertedIds[0],
        userName: "דוד כהן",
        rating: 5,
        comment: "הצגה מדהימה! המוזיקה והמשחק היו ברמה גבוהה מאוד.",
        createdAt: new Date("2024-12-15"),
        userEmail: "david@example.com",
      },
      {
        showId: showsResult.insertedIds[1],
        userName: "רחל לוי",
        rating: 4,
        comment: "הצגה מצחיקה ומרגשת, מומלץ לכל המשפחה.",
        createdAt: new Date("2024-12-10"),
        userEmail: "rachel@example.com",
      },
      {
        showId: showsResult.insertedIds[2],
        userName: "אבי אברהם",
        rating: 3,
        comment: "הצגה סבירה, יש מקום לשיפור בעלילה.",
        createdAt: new Date("2024-12-05"),
        userEmail: "avi@example.com",
      },
    ];

    const reviewsResult = await db.collection("reviews").insertMany(reviews);
    console.log(`Inserted ${reviewsResult.insertedCount} reviews`);

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await client.close();
  }
}

populateDatabase();
