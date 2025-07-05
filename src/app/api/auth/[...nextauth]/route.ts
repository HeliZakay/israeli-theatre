// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = creds?.email;
        const pw = creds?.password;
        if (!email || !pw) throw new Error("נא להזין אימייל וסיסמה");

        const client = await clientPromise;
        const user = await client.db().collection("users").findOne({ email });

        if (!user) {
          throw new Error("משתמש לא נמצא");
        }
        if (!user.passwordHash) {
          // No password on file → Google-only account
          throw new Error("חשבון נוצר דרך Google בלבד. אנא הגדר סיסמה מחדש.");
        }
        const isValid = await compare(pw, user.passwordHash);
        if (!isValid) throw new Error("סיסמה שגויה");

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Auto-provision users on first Google sign-in
      if (account?.provider === "google" && user.email) {
        const client = await clientPromise;
        const db = client.db();
        await db.collection("users").updateOne(
          { email: user.email },
          {
            $setOnInsert: {
              name: user.name,
              email: user.email,
              image: user.image,
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );
      }
      return true;
    },
  },

  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
  pages: { signIn: "/login", error: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
