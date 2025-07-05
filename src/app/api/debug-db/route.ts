// src/app/api/debug-db/route.ts
import { NextResponse } from "next/server";
import { showsCollection, reviewsCollection } from "@/lib/db";

export async function GET() {
  try {
    console.log("Debug: Checking database connection...");
    console.log("Debug: MONGODB_URI exists:", !!process.env.MONGODB_URI);
    console.log("Debug: Environment:", process.env.NODE_ENV);

    // Test shows collection
    const shows = await (await showsCollection()).find().limit(1).toArray();
    console.log("Debug: Shows query successful, found:", shows.length);

    // Test reviews collection
    const reviews = await (await reviewsCollection()).find().limit(1).toArray();
    console.log("Debug: Reviews query successful, found:", reviews.length);

    return NextResponse.json({
      success: true,
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      environment: process.env.NODE_ENV,
      shows_count: shows.length,
      reviews_count: reviews.length,
      message: "Database connection successful",
    });
  } catch (error) {
    console.error("Debug: Database connection failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        mongodb_uri_exists: !!process.env.MONGODB_URI,
        environment: process.env.NODE_ENV,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}
