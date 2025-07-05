import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();
  const client = await clientPromise;
  const db     = client.db();

  const record = await db.collection('passwordResets').findOne({ token });
  if (
    !record ||
    record.used ||
    new Date(record.expires) < new Date()
  ) {
    return NextResponse.json({ message: 'קישור לא תקין או שפג תוקפו' }, { status: 400 });
  }

  // Update user’s password
  const passwordHash = await hash(newPassword, 10);
  await db.collection('users').updateOne(
    { email: record.email },
    { $set: { passwordHash } }
  );

  // Mark token as used
  await db.collection('passwordResets').updateOne(
    { token },
    { $set: { used: true } }
  );

  return NextResponse.json({ message: 'הסיסמה עודכנה בהצלחה' });
}
