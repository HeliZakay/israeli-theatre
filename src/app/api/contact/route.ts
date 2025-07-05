import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();
  const client = await clientPromise;
  const now = new Date();

  // Insert into 'contacts' collection
  await client.db().collection('contacts').insertOne({
    name,
    email,
    message,
    createdAt: now,
  });

  return NextResponse.json({ success: true }, { status: 200 });
}