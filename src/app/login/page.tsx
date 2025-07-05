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

  const isGoogleOnlyError =
    error === "חשבון נוצר דרך Google בלבד. אנא הגדר סיסמה מחדש.";

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

        {isGoogleOnlyError ? (
          <p className="text-theater-700 text-sm mb-2">
            חשבון זה נוצר באמצעות Google בלבד.&nbsp;
            <Link href="/forgot-password" className="underline">
              הגדר סיסמה עכשיו
            </Link>
          </p>
        ) : (
          error && <p className="text-theater-700">{error}</p>
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
