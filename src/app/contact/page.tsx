// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("שגיאה בשליחת ההודעה");
      setSubmitted(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "שגיאה לא ידועה";
      setError(errorMessage);
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-center text-theater-800">
            צור קשר
          </h1>
          {submitted ? (
            <div className="text-center">
              <p className="text-green-600 font-semibold mb-4">
                תודה! ההודעה שלך נשלחה בהצלחה.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block px-6 py-2 bg-theater-700 text-white font-medium rounded hover:bg-theater-800 transition cursor-pointer"
              >
                חזרה לעמוד הבית
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  שם
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theater-300 focus:border-theater-600 p-3 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-theater-300"
                  placeholder="הכנס את שמך"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  דואר אלקטרוני
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theater-300 focus:border-theater-600 p-3 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-theater-300"
                  placeholder="example@domain.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  הודעה
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theater-300 focus:border-theater-600 p-3 text-right transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-theater-300 resize-none"
                  placeholder="כתוב כאן את ההודעה שלך..."
                  required
                />
              </div>

              {error && <p className="text-theater-700 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full flex justify-center px-6 py-3 bg-theater-600 text-white font-semibold rounded-lg hover:bg-theater-700 transition cursor-pointer"
              >
                שלח
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
