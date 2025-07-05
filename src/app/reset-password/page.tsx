"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();
  const [newPwd, setNewPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: newPwd }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "שגיאה בעדכון הסיסמה");
        setIsLoading(false);
      } else {
        setSuccess(true);
        setIsLoading(false);
        // Show success message for 2 seconds, then redirect
        setTimeout(() => {
          router.push("/login?message=password-reset-success");
        }, 2000);
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const errorMessage =
        err instanceof Error ? err.message : "אירעה שגיאה ברשת";
      setError(errorMessage);
    }
  }

  if (success) {
    return (
      <main className="container mx-auto p-6 text-right">
        <div className="max-w-sm mx-auto text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <div className="flex items-center justify-center mb-2">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
            <h2 className="text-lg font-semibold">הסיסמה שונתה בהצלחה!</h2>
            <p className="text-sm mt-2">אתה מועבר לעמוד ההתחברות...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 text-right">
      <h1 className="text-2xl font-bold mb-4">הגדר סיסמה חדשה</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        {error && (
          <div className="bg-theater-100 border border-theater-500 text-theater-800 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium">סיסמה חדשה</label>
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            required
            className="mt-1 w-full border p-2 rounded focus:ring-2 focus:ring-theater-300 focus:border-theater-500"
            placeholder="הכנס סיסמה חדשה"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-theater-700 text-white rounded hover:bg-theater-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              מעדכן...
            </>
          ) : (
            "עדכן סיסמה"
          )}
        </button>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>טוען...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
