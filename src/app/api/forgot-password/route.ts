// src/app/api/forgot-password/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { nanoid } from "nanoid";
import nodemailer from "nodemailer";

const TOKEN_EXPIRY_MS = 1000 * 60 * 60; // 1 hour

async function sendResetEmail(to: string, token: string) {
  let transporter;
  let fromAddress: string;

  // Check if we have SMTP configuration
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Use configured SMTP (Gmail)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    fromAddress = process.env.FROM_EMAIL || process.env.SMTP_USER;
  } else {
    // Fallback to Ethereal test account
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
    fromAddress = testAccount.user;
  }

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const info = await transporter.sendMail({
    from: fromAddress,
    to,
    subject: "איפוס סיסמה ל–תיאטרון בישראל",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #8B4513; text-align: center;">איפוס סיסמה</h2>
        <p>שלום,</p>
        <p>התקבלה בקשה לאיפוס הסיסמה שלך באתר "תיאטרון בישראל".</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            איפוס סיסמה
          </a>
        </div>
        <p>הקישור תקף למשך שעה אחת.</p>
        <p>אם לא ביקשת איפוס סיסמה, התעלם/י מההודעה הזו.</p>
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">
          הודעה זו נשלחה מאתר "תיאטרון בישראל"
        </p>
      </div>
    `,
  });

  // Log preview URL if using test account
  if (!process.env.SMTP_HOST) {
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
