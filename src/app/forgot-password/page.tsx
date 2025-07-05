"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (err: unknown) {
      setLoading(false);
      const errorMessage =
        err instanceof Error ? err.message : "אירעה שגיאה ברשת";
      setError(errorMessage);
    }
  }

  return (
    <main className="container mx-auto p-6 flex justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg text-right">
        <h1 className="text-2xl font-bold mb-4 text-theater-800">
          איפוס סיסמה
        </h1>

        {message ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{message}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              בדוק את תיבת האימייל שלך (כולל תיקיית הספאם) וקליק על הקישור
              לאיפוס הסיסמה.
            </p>
            <Link
              href="/login"
              className="inline-block w-full text-center bg-theater-700 text-white px-4 py-2 rounded-lg hover:bg-theater-800 transition-colors font-medium"
            >
              חזרה לכניסה
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">
              הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
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
            )}

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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-theater-700 text-white px-4 py-2 rounded-lg hover:bg-theater-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "שולח..." : "שלח לינק לאיפוס"}
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-theater-700 underline"
              >
                חזרה לכניסה
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
