import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    console.log("Reset password API called");
    const { token, newPassword } = await req.json();
    console.log("Token received:", token ? "yes" : "no");
    console.log("Password received:", newPassword ? "yes" : "no");

    if (!token || !newPassword) {
      console.log("Missing data - token or password");
      return NextResponse.json({ message: "נתונים חסרים" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      console.log("Password too short");
      return NextResponse.json(
        { message: "הסיסמה צריכה להכיל לפחות 6 תווים" },
        { status: 400 }
      );
    }

    console.log("Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db();
    console.log("MongoDB connected");

    console.log("Looking for reset token...");
    const record = await db.collection("passwordResets").findOne({ token });
    console.log("Reset record found:", record ? "yes" : "no");

    if (!record || record.used || new Date(record.expires) < new Date()) {
      console.log("Invalid or expired token");
      return NextResponse.json(
        { message: "קישור לא תקין או שפג תוקפו" },
        { status: 400 }
      );
    }

    // Update user's password
    const passwordHash = await hash(newPassword, 10);
    const updateResult = await db
      .collection("users")
      .updateOne({ email: record.email }, { $set: { passwordHash } });

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ message: "משתמש לא נמצא" }, { status: 404 });
    }

    // Mark token as used
    await db
      .collection("passwordResets")
      .updateOne({ token }, { $set: { used: true } });

    return NextResponse.json({ message: "הסיסמה עודכנה בהצלחה" });
  } catch (error: unknown) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "אירעה שגיאה בשרת" }, { status: 500 });
  }
}
