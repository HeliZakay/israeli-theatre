"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          res.status === 409 ? "משתמש קיים" : data.message || "שגיאה בהרשמה"
        );
        setLoading(false);
        return;
      }

      // Automatically sign in the new user
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      setLoading(false);
      if (signInRes?.error) {
        setError("ההרשמה הצליחה אך הכניסה נכשלה. אנא התחבר.");
      } else {
        setSignedIn(true);
      }
    } catch (err: unknown) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : "שגיאה ברשת";
      setError(errorMessage);
    }
  }

  function handleGoogleSignUp() {
    // Redirect user through Google OAuth
    signIn("google", { callbackUrl: "/" });
  }

  if (signedIn) {
    return (
      <main className="container mx-auto p-6 flex justify-center">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg text-right">
          <h1 className="text-2xl font-bold mb-4 text-theater-800">
            ההרשמה הצליחה!
          </h1>
          <p className="mb-4">הינך מחובר כעת.</p>
          <Link
            href="/"
            className="inline-block bg-theater-700 text-white px-4 py-2 rounded hover:bg-theater-800"
          >
            לחזרה לאתר
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg space-y-4 text-right"
      >
        <h1 className="text-2xl font-bold mb-4 text-theater-800">הרשמה</h1>

        {error && (
          <p className="text-theater-700">
            {error === "משתמש קיים" ? (
              <>
                משתמש קיים,{" "}
                <Link href="/login" className="underline">
                  התחבר כאן
                </Link>
              </>
            ) : (
              error
            )}
          </p>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">שם מלא</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theater-300 focus:border-theater-600 p-3 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-theater-300"
            placeholder="הכנס את שמך המלא"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">דואר אלקטרוני</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theater-300 focus:border-theater-600 p-3 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-theater-300"
            placeholder="example@domain.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">סיסמה</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theater-300 focus:border-theater-600 p-3 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-theater-300"
            placeholder="בחר סיסמה חזקה"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-theater-700 text-white py-2 rounded-md hover:bg-theater-800 transition cursor-pointer"
        >
          {loading ? "טוען..." : "הרשמה"}
        </button>
      </form>

      {/* Or divider */}
      <div className="flex items-center w-full max-w-sm my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500">או</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Google Sign-Up */}
      <button
        onClick={handleGoogleSignUp}
        className="flex items-center justify-center w-full max-w-sm px-4 py-2 border rounded-md hover:bg-gray-100 transition cursor-pointer"
      >
        {/* You can replace this emoji with a proper Google icon if you install react-icons */}
        <span className="mr-2 text-xl">
          <FcGoogle className="mr-2 text-xl" />
        </span>
        הרשמה באמצעות Google
      </button>
    </main>
  );
}
