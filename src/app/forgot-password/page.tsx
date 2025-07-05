"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    // Call your API to send reset link
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.message);
    else setMessage(data.message);
  }

  return (
    <main className="container mx-auto p-6 text-right">
      <h1 className="text-2xl font-bold mb-4">איפוס סיסמה</h1>
      {message ? (
        <p className="text-green-600">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
          {error && <p className="text-red-700">{error}</p>}
          <div>
            <label className="block text-sm">דואר אלקטרוני</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border p-2 rounded"
            />
          </div>
          <button className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition cursor-pointer">
            שלח לינק לאיפוס
          </button>
        </form>
      )}
    </main>
  );
}
