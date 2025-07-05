// src/app/api/shows/[id]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { Show } from '@/types/models';
import { ObjectId } from 'mongodb';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }  // <-- params is a Promise now
) {
  // await before using
  const { id } = await context.params;

  const client = await clientPromise;
  const show = await client
    .db()
    .collection<Show>('shows')
    .findOne({ _id: new ObjectId(id) });

  if (!show) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(show);
}
