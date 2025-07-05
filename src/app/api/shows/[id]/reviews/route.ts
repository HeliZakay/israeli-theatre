// src/app/api/shows/[id]/reviews/route.ts
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { Review } from "@/types/models";

// GET /api/shows/:id/reviews → list reviews
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const client = await clientPromise;
  const reviews = await client
    .db()
    .collection<Review>("reviews")
    .find({ showId: new ObjectId(resolvedParams.id) })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json(reviews);
}

// POST /api/shows/:id/reviews → add a new review
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { userName, rating, comment, userEmail, isAuthenticated } =
    await request.json();
  const now = new Date();
  const client = await clientPromise;

  // אם המשתמש מחובר, נמצא את המשתמש במסד הנתונים
  let userId = null;
  if (isAuthenticated && userEmail) {
    const user = await client
      .db()
      .collection("users")
      .findOne({ email: userEmail });
    if (user) {
      userId = user._id;
    }
  }

  const reviewData = {
    showId: new ObjectId(resolvedParams.id),
    userName,
    rating,
    comment,
    createdAt: now,
    // נוסיף את נתוני המשתמש אם הוא מחובר
    ...(userId && { userId }),
    ...(userEmail && { userEmail }),
  };

  const result = await client.db().collection("reviews").insertOne(reviewData);

  return NextResponse.json({ _id: result.insertedId }, { status: 201 });
}
