// src/app/login/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "password-reset-success") {
      setSuccessMessage(
        "הסיסמה שונתה בהצלחה! כעת תוכל להתחבר עם הסיסמה החדשה."
      );
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/");
    }
  }

  function handleGoogleSignIn() {
    signIn("google", { callbackUrl: "/" });
  }

  // Check different error types
  const isSignUpError =
    error?.includes("לא רשום במערכת") || error?.includes("לא נמצא");
  const isGoogleOnlyError =
    error === "חשבון נוצר דרך Google בלבד. אנא הגדר סיסמה מחדש.";
  const isPasswordError = error?.includes("סיסמה שגויה");

  return (
    <main className="container mx-auto p-6 flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg space-y-4 text-right"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-theater-800">
          התחברות
        </h1>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-green-600 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {isSignUpError ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 text-blue-600 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">האימייל לא רשום במערכת</span>
            </div>
            <p className="text-sm mb-3">
              נראה שעדיין לא נרשמת לאתר. ברוכים הבאים!
            </p>
            <Link
              href="/signup"
              className="inline-block bg-theater-600 text-white px-4 py-2 rounded-lg hover:bg-theater-700 transition-colors font-medium"
            >
              הירשם עכשיו
            </Link>
          </div>
        ) : isGoogleOnlyError ? (
          <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 text-orange-600 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="font-medium">חשבון Google בלבד</span>
            </div>
            <p className="text-sm mb-3">
              חשבון זה נוצר באמצעות Google בלבד. כדי להתחבר עם סיסמה, צריך
              להגדיר אותה תחילה.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              הגדר סיסמה עכשיו
            </Link>
          </div>
        ) : isPasswordError ? (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 text-red-600 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="font-medium">סיסמה שגויה</span>
            </div>
            <p className="text-sm mb-3">
              הסיסמה שהזנת אינה נכונה. אנא נסה שוב.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              שכחת סיסמה?
            </Link>
          </div>
        ) : (
          error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-600 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">דואר אלקטרוני</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theater-300 focus:border-theater-600 p-3 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-theater-300"
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
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-theater-700 text-white py-2 rounded-md hover:bg-theater-800 transition cursor-pointer"
        >
          {loading ? "טוען..." : "התחבר"}
        </button>

        <div className="text-right text-sm mt-2">
          <Link href="/forgot-password" className="underline text-gray-600">
            שכחת סיסמה?
          </Link>
        </div>
      </form>

      {/* Or divider */}
      <div className="flex items-center w-full max-w-sm my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500">או</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Google Sign-In */}
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center w-full max-w-sm px-4 py-2 border rounded-md hover:bg-gray-100 transition cursor-pointer"
      >
        <FcGoogle className="mr-2 text-xl" />
        התחבר עם Google
      </button>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>טוען...</div>}>
      <LoginForm />
    </Suspense>
  );
}
