// src/app/profile/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface UserReview {
  _id: string;
  showId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  showTitle: string;
  showVenue: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: "",
  });
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserReviews();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const fetchUserReviews = async () => {
    try {
      const response = await fetch("/api/user/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (review: UserReview) => {
    setEditingReview(review._id);
    setEditForm({
      rating: review.rating,
      comment: review.comment,
    });
  };

  const cancelEditing = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: "" });
  };

  const saveEdit = async (reviewId: string, showId: string) => {
    try {
      const response = await fetch(`/api/shows/${showId}/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        // רענן את רשימת הביקורות
        await fetchUserReviews();
        setEditingReview(null);
        setEditForm({ rating: 5, comment: "" });
      } else {
        console.error("Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const deleteReview = async (reviewId: string, showId: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הביקורת?")) {
      return;
    }

    try {
      const response = await fetch(`/api/shows/${showId}/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // רענן את רשימת הביקורות
        await fetchUserReviews();
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-theater-700 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            טוען את הפרופיל...
          </h2>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
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
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              כדי לראות את הפרופיל
            </h1>
            <p className="text-gray-600">אנא התחבר לחשבון שלך</p>
          </div>
          <Link
            href="/login"
            className="inline-block bg-theater-700 text-white px-6 py-3 rounded-lg hover:bg-theater-800 transition font-semibold"
          >
            התחבר לאתר
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-theater-700 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="text-right flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {session?.user?.name || "משתמש"}
            </h1>
            <p className="text-gray-600 text-lg">{session?.user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                חבר פעיל
              </span>
              <span className="text-gray-500 text-sm">
                {reviews.length} ביקורות
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-right">
            הביקורות שלי
          </h2>
          <span className="bg-theater-100 text-theater-900 px-3 py-1 rounded-full text-sm font-medium">
            {reviews.length} ביקורות
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              אין ביקורות עדיין
            </h3>
            <p className="text-gray-600 mb-4">
              התחל לכתוב ביקורות על הצגות שראית
            </p>
            <Link
              href="/"
              className="inline-block bg-theater-700 text-white px-6 py-3 rounded-lg hover:bg-theater-800 transition font-semibold"
            >
              חזור לעמוד הראשי
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-right flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        href={`/shows/${review.showId}`}
                        className="text-theater-700 font-bold text-xl hover:underline"
                      >
                        {review.showTitle}
                      </Link>
                      <Link
                        href={`/shows/${review.showId}`}
                        className="inline-flex items-center gap-1 px-2 py-1 text-theater-700 hover:text-theater-900 hover:bg-theater-50 rounded-md transition-colors text-sm border border-gray-200 hover:border-theater-400"
                      >
                        לעמוד ההצגה
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>
                    </div>
                    <p className="text-gray-600 font-medium">
                      {review.showVenue}
                    </p>
                  </div>
                  <div className="bg-yellow-50 px-3 py-1 rounded-full">
                    <div className="text-yellow-500 text-lg">
                      {"⭐".repeat(review.rating)}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 leading-relaxed text-right">
                    {review.comment}
                  </p>
                </div>{" "}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {new Date(review.createdAt).toLocaleDateString("he-IL")}
                  </span>

                  {/* Edit and Delete Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(review)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-theater-50 text-theater-700 rounded-lg hover:bg-theater-100 transition-colors text-sm font-medium cursor-pointer"
                      title="ערוך ביקורת"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      ערוך
                    </button>
                    <button
                      onClick={() => deleteReview(review._id, review.showId)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-theater-50 text-theater-700 rounded-lg hover:bg-theater-100 transition-colors text-sm font-medium cursor-pointer"
                      title="מחק ביקורת"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      מחק
                    </button>
                  </div>
                </div>
                {/* Edit Form */}
                {editingReview === review._id && (
                  <div className="mt-4 p-4 bg-theater-50 rounded-lg border border-theater-200">
                    <h4 className="text-theater-900 font-semibold mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      עריכת ביקורת
                    </h4>

                    {/* Rating Section */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        דירוג
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive =
                            star <= (hoveredStar || editForm.rating);
                          return (
                            <button
                              key={star}
                              onClick={() =>
                                setEditForm({ ...editForm, rating: star })
                              }
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
                        <div className="mr-3 px-3 py-1 bg-yellow-50 rounded-full border border-yellow-200">
                          <span className="text-sm font-medium text-yellow-800">
                            {editForm.rating} מתוך 5
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        לחץ על הכוכבים כדי לדרג
                      </p>
                    </div>

                    {/* Comment Section */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        הביקורת שלך
                      </label>
                      <textarea
                        value={editForm.comment}
                        onChange={(e) =>
                          setEditForm({ ...editForm, comment: e.target.value })
                        }
                        className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theater-300 focus:border-theater-600 p-3 text-right transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-theater-300 resize-none"
                        rows={4}
                        placeholder="כתוב את הביקורת שלך כאן..."
                      ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={cancelEditing}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
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
                        ביטול
                      </button>
                      <button
                        onClick={() => saveEdit(review._id, review.showId)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
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
                        שמור שינויים
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
