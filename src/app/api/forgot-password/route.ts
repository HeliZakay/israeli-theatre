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
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl; text-align: right; background: linear-gradient(135deg, #f5f1eb 0%, #e8dcc6 100%);">
        <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(139, 69, 19, 0.1);">
          <!-- Header with logo placeholder -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #8B4513;">
            <h1 style="color: #8B4513; margin: 0; font-size: 28px; font-weight: bold;">🎭 תיאטרון בישראל</h1>
          </div>
          
          <!-- Main content -->
          <div style="color: #333; line-height: 1.6;">
            <h2 style="color: #8B4513; text-align: center; margin-bottom: 25px; font-size: 24px;">איפוס סיסמה</h2>
            
            <p style="font-size: 16px; margin-bottom: 15px;">שלום רב,</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              קיבלנו בקשה לאיפוס הסיסמה שלך באתר <strong>"תיאטרון בישראל"</strong>.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              כדי להמשיך ולהגדיר סיסמה חדשה, אנא לחץ על הכפתור הבא:
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-size: 18px; 
                        font-weight: bold; 
                        display: inline-block; 
                        box-shadow: 0 4px 10px rgba(139, 69, 19, 0.3);
                        transition: all 0.3s ease;">
                🔑 איפוס סיסמה
              </a>
            </div>
            
            <!-- Instructions -->
            <div style="background: #f8f6f0; border-right: 4px solid #8B4513; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 15px; color: #666;">
                ⏰ <strong>חשוב לדעת:</strong> הקישור תקף למשך שעה אחת בלבד.
              </p>
            </div>
            
            <p style="font-size: 15px; color: #666; margin-bottom: 25px;">
              אם לא ביקשת איפוס סיסמה, אנא התעלם מהודעה זו. החשבון שלך בטוח ולא נדרשת כל פעולה נוספת.
            </p>
            
            <!-- Alternative link -->
            <p style="font-size: 14px; color: #888; margin-bottom: 30px;">
              אם הכפתור לא עובד, העתק והדבק את הקישור הבא בדפדפן:
              <br><a href="${resetUrl}" style="color: #8B4513; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="font-size: 13px; color: #999; margin: 0;">
              הודעה זו נשלחה אוטומטית מאתר <strong>תיאטרון בישראל</strong>
            </p>
            <p style="font-size: 12px; color: #bbb; margin: 5px 0 0 0;">
              © ${new Date().getFullYear()} תיאטרון בישראל. כל הזכויות שמורות.
            </p>
          </div>
        </div>
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
