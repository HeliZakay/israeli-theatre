import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const client = await clientPromise;
  if (await client.db().collection('users').findOne({ email })) {
    return NextResponse.json({ message: 'משתמש קיים ' }, { status: 409 });
  }
  const passwordHash = await hash(password, 10);
  await client.db().collection('users').insertOne({ name, email, passwordHash, createdAt: new Date() });
  return NextResponse.json({ message: 'נרשמת בהצלחה' }, { status: 201 });
}
