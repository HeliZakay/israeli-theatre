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
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl; text-align: right; background: linear-gradient(135deg, #fdf2f2 0%, #fce7e7 100%);">
        <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(139, 21, 56, 0.1);">
          <!-- Header with real logo -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #8b1538;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 50" width="170" height="50" style="margin: 0 auto;">
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#8B1538;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#6B1029;stop-opacity:1" />
                </linearGradient>
                <filter id="textShadow">
                  <feDropShadow dx="1" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.8"/>
                </filter>
              </defs>
              <rect x="0" y="0" width="170" height="50" rx="8" fill="url(#bgGradient)"/>
              <rect x="0" y="3" width="170" height="2" fill="#8B6F3A"/>
              <g>
                <rect x="5" y="5" width="8" height="40" fill="#D4A574" rx="1"/>
                <rect x="6" y="5" width="6" height="40" fill="#C19B6B"/>
                <line x1="9" y1="5" x2="9" y2="45" stroke="#B8956A" stroke-width="0.5"/>
                <rect x="15" y="5" width="8" height="40" fill="#D4A574" rx="1"/>
                <rect x="16" y="5" width="6" height="40" fill="#C19B6B"/>
                <line x1="19" y1="5" x2="19" y2="45" stroke="#B8956A" stroke-width="0.5"/>
                <rect x="25" y="5" width="8" height="40" fill="#D4A574" rx="1"/>
                <rect x="26" y="5" width="6" height="40" fill="#C19B6B"/>
                <line x1="29" y1="5" x2="29" y2="45" stroke="#B8956A" stroke-width="0.5"/>
              </g>
              <g>
                <rect x="137" y="5" width="8" height="40" fill="#D4A574" rx="1"/>
                <rect x="138" y="5" width="6" height="40" fill="#C19B6B"/>
                <line x1="141" y1="5" x2="141" y2="45" stroke="#B8956A" stroke-width="0.5"/>
                <rect x="147" y="5" width="8" height="40" fill="#D4A574" rx="1"/>
                <rect x="148" y="5" width="6" height="40" fill="#C19B6B"/>
                <line x1="151" y1="5" x2="151" y2="45" stroke="#B8956A" stroke-width="0.5"/>
                <rect x="157" y="5" width="8" height="40" fill="#D4A574" rx="1"/>
                <rect x="158" y="5" width="6" height="40" fill="#C19B6B"/>
                <line x1="161" y1="5" x2="161" y2="45" stroke="#B8956A" stroke-width="0.5"/>
              </g>
              <text x="85" y="22" font-family="serif" font-size="18" font-weight="bold" fill="#FFFFFF" filter="url(#textShadow)" text-anchor="middle">תיאטרון</text>
              <text x="85" y="38" font-family="serif" font-size="14" font-weight="600" fill="#FFFFFF" opacity="0.9" filter="url(#textShadow)" text-anchor="middle">בישראל</text>
              <rect x="35" y="47" width="100" height="2" fill="#B8956A" opacity="0.7"/>
            </svg>
          </div>
          
          <!-- Main content -->
          <div style="color: #333; line-height: 1.6;">
            <h2 style="color: #8b1538; text-align: center; margin-bottom: 25px; font-size: 24px;">איפוס סיסמה</h2>
            
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
                 style="background: linear-gradient(135deg, #8b1538 0%, #7a1230 100%); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-size: 18px; 
                        font-weight: bold; 
                        display: inline-block; 
                        box-shadow: 0 4px 10px rgba(139, 21, 56, 0.3);
                        transition: all 0.3s ease;">
                🔑 איפוס סיסמה
              </a>
            </div>
            
            <!-- Instructions -->
            <div style="background: #fdf2f2; border-right: 4px solid #8b1538; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
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
              <br><a href="${resetUrl}" style="color: #8b1538; word-break: break-all;">${resetUrl}</a>
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
