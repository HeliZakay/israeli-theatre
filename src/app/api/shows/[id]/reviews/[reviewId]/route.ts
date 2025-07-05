// src/app/api/shows/[id]/reviews/[reviewId]/route.ts
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

// PUT /api/shows/:id/reviews/:reviewId → update a review
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  const resolvedParams = await params;
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { rating, comment } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Find the user
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the review - but only if it belongs to the current user
    const result = await db.collection("reviews").updateOne(
      {
        _id: new ObjectId(resolvedParams.reviewId),
        userId: user._id, // וודא שהביקורת שייכת למשתמש הנוכחי
      },
      {
        $set: {
          rating,
          comment,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Review not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Review updated successfully" });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/shows/:id/reviews/:reviewId → delete a review
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  const resolvedParams = await params;
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Find the user
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the review - but only if it belongs to the current user
    const result = await db.collection("reviews").deleteOne({
      _id: new ObjectId(resolvedParams.reviewId),
      userId: user._id, // וודא שהביקורת שייכת למשתמש הנוכחי
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Review not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
