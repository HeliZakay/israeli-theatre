// src/app/api/test-db/route.ts
import { showsCollection, reviewsCollection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing database connection...");
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    
    const shows = await (await showsCollection()).find().limit(3).toArray();
    const reviews = await (await reviewsCollection()).find().limit(3).toArray();
    
    console.log("Shows found:", shows.length);
    console.log("Reviews found:", reviews.length);
    
    return NextResponse.json({
      success: true,
      data: {
        showsCount: shows.length,
        reviewsCount: reviews.length,
        shows: shows.map(s => ({ 
          id: s._id?.toString(), 
          title: s.title, 
          venue: s.venue 
        })),
        reviews: reviews.map(r => ({ 
          id: r._id?.toString(), 
          userName: r.userName, 
          rating: r.rating,
          comment: r.comment.substring(0, 50) + "..." 
        }))
      }
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
}
