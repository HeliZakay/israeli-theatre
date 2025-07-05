import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Test database connection
    await db.admin().ping();

    // Get basic collection info
    const collections = await db.listCollections().toArray();
    const showsCollection = db.collection("shows");
    const reviewsCollection = db.collection("reviews");

    const showsCount = await showsCollection.countDocuments();
    const reviewsCount = await reviewsCollection.countDocuments();

    return NextResponse.json({
      message: "Database connection successful!",
      database: db.databaseName,
      collections: collections.map((c) => c.name),
      counts: {
        shows: showsCount,
        reviews: reviewsCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
