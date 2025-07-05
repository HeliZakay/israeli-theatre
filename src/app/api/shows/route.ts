// src/app/api/shows/route.ts
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Show } from "@/types/models";

// GET /api/shows → list all shows
export async function GET() {
  const client = await clientPromise;
  const shows = await client
    .db()
    .collection<Show>("shows")
    .find()
    .toArray();
  return NextResponse.json(shows);
}

// POST /api/shows → create a new show
export async function POST(request: Request) {
  const data = await request.json() as Omit<Show, "_id" | "createdAt" | "updatedAt">;
  const now = new Date();
  const client = await clientPromise;
  const result = await client
    .db()
    .collection("shows")
    .insertOne({ ...data, createdAt: now, updatedAt: now });
  return NextResponse.json({ _id: result.insertedId }, { status: 201 });
}
