// src/components/ReviewForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ReviewFormProps {
  showId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({
  showId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // Auto-fill userName if logged in
  useEffect(() => {
    if (status === "authenticated" && session.user?.name) {
      setUserName(session.user.name);
    }
  }, [session, status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // נתונים לשליחה
    const reviewData = {
      userName,
      rating,
      comment,
      // אם המשתמש מחובר, שלח גם את פרטיו
      userEmail: session?.user?.email || null,
      isAuthenticated: status === "authenticated",
    };

    try {
      await fetch(`/api/shows/${showId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      setLoading(false);

      // נקה את הטופס
      if (status !== "authenticated") setUserName("");
      setRating(5);
      setComment("");

      // קרא לפונקציה שהועברה כדי לרענן את הביקורות
      if (onReviewSubmitted) {
        onReviewSubmitted();
      } else {
        router.refresh();
      }

      // גלול לסקציה של הביקורות רק אם המשתמש לא מחובר
      // כי אם הוא מחובר, הביקורת שלו תופיע בסקציה "הביקורת שלי" למעלה
      if (status !== "authenticated") {
        setTimeout(() => {
          const reviewsSection = document.getElementById("reviews-section");
          if (reviewsSection) {
            reviewsSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 300);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting review:", error);
    }
  }

  return (
    <div className="bg-gradient-to-br from-theater-50 to-white p-6 rounded-xl shadow-lg border border-theater-100">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">השאר חוות דעת</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            שם
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theater-300 focus:border-theater-600 p-3 text-right transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-theater-300"
            placeholder="שמך המלא"
            required
          />
        </div>

        {/* Rating Field */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            דירוג
          </label>
          <div className="flex items-center gap-2 p-4 bg-white/60 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoveredStar || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className={`text-3xl transition-all duration-200 hover:scale-110 cursor-pointer ${
                      isActive
                        ? "text-yellow-400 drop-shadow-sm"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                    title={`דרג ${star} כוכבים`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
            <div className="mr-3 px-3 py-1 bg-yellow-50 rounded-full border border-yellow-200">
              <span className="text-sm font-medium text-yellow-800">
                {rating} מתוך 5
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-right">
            לחץ על הכוכבים כדי לדרג
          </p>
        </div>

        {/* Comment Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            חוות דעת
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theater-300 focus:border-theater-600 p-3 text-right transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-theater-300 resize-none"
            rows={5}
            placeholder="כתוב כאן את חוות דעתך על ההצגה... מה היה מיוחד? איך הרגשת? מה הותיר רושם?"
            required
          />
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{comment.length} תווים</span>
            <span>מינימום 10 תווים</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || comment.length < 10}
          className="w-full px-6 py-3 bg-gradient-to-r from-theater-700 to-theater-800 text-white font-semibold rounded-lg hover:from-theater-800 hover:to-theater-900 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              שולח...
            </>
          ) : (
            "שלח חוות דעת"
          )}{" "}
        </button>
      </form>
    </div>
  );
}
