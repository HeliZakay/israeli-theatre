// src/app/api/user/reviews/route.ts
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// GET /api/user/reviews → get all reviews by the current user
export async function GET() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Find user first
  const user = await db
    .collection("users")
    .findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get all reviews by this user
  const reviews = await db
    .collection("reviews")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .toArray();

  // Get show information for each review
  const reviewsWithShows = await Promise.all(
    reviews.map(async (review) => {
      const show = await db.collection("shows").findOne({ _id: review.showId });
      return {
        ...review,
        showTitle: show?.title || "הצגה לא נמצאה",
        showVenue: show?.venue || "",
      };
    })
  );

  return NextResponse.json(reviewsWithShows);
}
