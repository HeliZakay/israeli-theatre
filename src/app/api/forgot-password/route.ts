// src/app/api/forgot-password/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { nanoid } from "nanoid";
import nodemailer from "nodemailer";

const TOKEN_EXPIRY_MS = 1000 * 60 * 60; // 1 hour

async function sendResetEmail(to: string, token: string) {
  let transporter;
  let fromAddress: string;

  if (process.env.NODE_ENV === "development") {
    // Dev: Ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    fromAddress = testAccount.user; // use ethereal account as sender
  } else {
    // Prod: real SMTP from env
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });
    fromAddress = process.env.FROM_EMAIL || process.env.SMTP_USER!;
  }

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const info = await transporter.sendMail({
    from: fromAddress,
    to,
    subject: "איפוס סיסמה ל–תיאטרון בישראל",
    html: `
      <p>התקבלה בקשה לאיפוס הסיסמה שלך.</p>
      <p>
        לחץ/י <a href="${resetUrl}">כאן</a> כדי לאפס את הסיסמה.
      </p>
      <p>אם לא ביקשת איפוס, התעלם/י מההודעה.</p>
    `,
  });

  if (process.env.NODE_ENV === "development") {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }
}

export async function POST(req: Request) {
  const { email } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "משתמש לא קיים" }, { status: 404 });
  }

  const token = nanoid(32);
  const expires = new Date(Date.now() + TOKEN_EXPIRY_MS);

  await db.collection("passwordResets").insertOne({
    email,
    token,
    expires,
    used: false,
  });

  try {
    await sendResetEmail(email, token);
    return NextResponse.json({ message: "נשלח לך אימייל לאיפוס הסיסמה" });
  } catch (err: unknown) {
    console.error("Mail error:", err);
    return NextResponse.json(
      { message: "אירעה שגיאה בשליחת האימייל" },
      { status: 500 }
    );
  }
}
