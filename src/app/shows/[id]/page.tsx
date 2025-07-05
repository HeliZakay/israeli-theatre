// src/app/shows/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Show, Review } from "@/types/models";
import ReviewForm from "@/components/ReviewForm";
import Image from "next/image";
import Link from "next/link";

type PageProps = { params: Promise<{ id: string }> };

export default function ShowPage({ params }: PageProps) {
  const { data: session } = useSession();
  const [show, setShow] = useState<Show | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showId, setShowId] = useState<string>("");
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: "",
  });
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  useEffect(() => {
    async function init() {
      const resolvedParams = await params;
      setShowId(resolvedParams.id);
      await fetchShowData(resolvedParams.id);
    }
    init();
  }, [params]);

  const fetchShowData = async (id: string) => {
    try {
      const [showResponse, reviewsResponse] = await Promise.all([
        fetch(`/api/shows/${id}`),
        fetch(`/api/shows/${id}/reviews`),
      ]);

      if (showResponse.ok) {
        const showData = await showResponse.json();
        setShow(showData);
      }

      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error("Error fetching show data:", error);
    } finally {
      setLoading(false);
    }
  };

  const isUserReview = (review: Review) => {
    return session?.user?.email === review.userEmail;
  };

  const hasUserReviewed = () => {
    return (
      session?.user?.email &&
      reviews.some((review) => review.userEmail === session.user?.email)
    );
  };

  const startEditing = (review: Review) => {
    setEditingReview(review._id?.toString() || "");
    setEditForm({
      rating: review.rating,
      comment: review.comment,
    });
  };

  const cancelEditing = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: "" });
  };

  const saveEdit = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/shows/${showId}/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        await fetchShowData(showId);
        setEditingReview(null);
        setEditForm({ rating: 5, comment: "" });
      } else {
        console.error("Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הביקורת?")) {
      return;
    }

    try {
      const response = await fetch(`/api/shows/${showId}/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchShowData(showId);
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const refreshReviews = () => {
    if (showId) {
      fetchShowData(showId);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-theater-700 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            טוען את ההצגה...
          </h2>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ההצגה לא נמצאה
          </h2>
          <Link
            href="/"
            className="inline-block bg-theater-700 text-white px-6 py-3 rounded-lg hover:bg-theater-800 transition font-semibold"
          >
            חזרה לעמוד הראשי
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl p-6 space-y-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-block text-theater-700 hover:underline text-sm"
      >
        ← חזרה להצגות
      </Link>

      {/* Header & Poster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {show.posterUrl && (
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src={show.posterUrl}
              alt={show.title}
              width={800}
              height={600}
              className="object-cover w-full h-64 md:h-80 lg:h-full"
            />
          </div>
        )}
        <div className="space-y-4 text-right">
          <h1 className="text-4xl font-extrabold">{show.title}</h1>
          <p className="text-gray-500 text-lg">{show.venue}</p>
          <div
            className="prose prose-lg text-gray-700"
            dangerouslySetInnerHTML={{ __html: show.description }}
          />
        </div>
      </div>

      {/* Review form or user's review */}
      <div className="mt-8">
        {session && hasUserReviewed() ? (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">הביקורת שלי</h2>
            {(() => {
              const userReview = reviews.find(
                (review) => review.userEmail === session.user?.email
              );
              return userReview ? (
                <div className="bg-theater-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-theater-200">
                  <div className="flex items-center gap-x-4 mb-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-theater-700 rounded-full flex items-center justify-center text-white font-bold">
                      {userReview.userName.charAt(0)}
                    </div>
                    {/* Name and Rating */}
                    <div className="flex-1 flex items-center gap-x-1 justify-between">
                      <p className="text-right font-semibold text-lg">
                        {userReview.userName}
                      </p>
                      <p className="text-yellow-500 text-lg">
                        {"⭐".repeat(userReview.rating)}
                      </p>
                    </div>
                  </div>
                  <p className="mb-4 text-gray-700">{userReview.comment}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      {new Date(userReview.createdAt).toLocaleString("he-IL")}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(userReview)}
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
                        onClick={() =>
                          deleteReview(userReview._id?.toString() || "")
                        }
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
                  {editingReview === userReview._id?.toString() && (
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
                                className={`text-2xl transition-all duration-200 hover:scale-110 cursor-pointer ${
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
                          <div className="mr-3 px-2 py-1 bg-yellow-50 rounded-full border border-yellow-200">
                            <span className="text-xs font-medium text-yellow-800">
                              {editForm.rating} מתוך 5
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Comment Section */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          הביקורת שלך
                        </label>
                        <textarea
                          value={editForm.comment}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              comment: e.target.value,
                            })
                          }
                          className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theater-300 focus:border-theater-600 p-3 text-right transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-theater-300 resize-none"
                          rows={3}
                          placeholder="כתוב את הביקורת שלך כאן..."
                        ></textarea>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelEditing}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm cursor-pointer"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          ביטול
                        </button>
                        <button
                          onClick={() =>
                            saveEdit(userReview._id?.toString() || "")
                          }
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm cursor-pointer"
                        >
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          שמור
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null;
            })()}
          </section>
        ) : (
          <ReviewForm showId={showId} onReviewSubmitted={refreshReviews} />
        )}
      </div>

      {/* Reviews section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          {session && hasUserReviewed() ? "ביקורות אחרות" : "חוות דעת"}
        </h2>
        {(() => {
          // סנן את הביקורות - אם המשתמש מחובר והשאיר ביקורת, הסר את הביקורת שלו
          const filteredReviews =
            session && hasUserReviewed()
              ? reviews.filter(
                  (review) => review.userEmail !== session.user?.email
                )
              : reviews;

          return filteredReviews.length > 0 ? (
            <div className="space-y-6">
              {filteredReviews.map((r: Review) => (
                <div
                  key={r._id?.toString()}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                  id={`review-${r._id?.toString()}`}
                >
                  <div className="flex items-center gap-x-4 mb-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                      {r.userName.charAt(0)}
                    </div>
                    {/* Name and Rating */}
                    <div className="flex-1 flex items-center gap-x-1 justify-between">
                      <p className="text-right font-semibold text-lg">
                        {r.userName}
                      </p>
                      <p className="text-yellow-500 text-lg">
                        {"⭐".repeat(r.rating)}
                      </p>
                    </div>
                  </div>
                  <p className="mb-4 text-gray-700">{r.comment}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      {new Date(r.createdAt).toLocaleString("he-IL")}
                    </p>

                    {/* Edit and Delete Buttons for User's Own Reviews */}
                    {session && isUserReview(r) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(r)}
                          className="flex items-center gap-1 px-2 py-1 bg-theater-50 text-theater-700 rounded-md hover:bg-theater-100 transition-colors text-xs font-medium cursor-pointer"
                          title="ערוך ביקורת"
                        >
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          ערוך
                        </button>
                        <button
                          onClick={() => deleteReview(r._id?.toString() || "")}
                          className="flex items-center gap-1 px-2 py-1 bg-theater-50 text-theater-700 rounded-md hover:bg-theater-100 transition-colors text-xs font-medium cursor-pointer"
                          title="מחק ביקורת"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          מחק
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Edit Form */}
                  {editingReview === r._id?.toString() && (
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
                                className={`text-2xl transition-all duration-200 hover:scale-110 cursor-pointer ${
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
                          <div className="mr-3 px-2 py-1 bg-yellow-50 rounded-full border border-yellow-200">
                            <span className="text-xs font-medium text-yellow-800">
                              {editForm.rating} מתוך 5
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Comment Section */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          הביקורת שלך
                        </label>
                        <textarea
                          value={editForm.comment}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              comment: e.target.value,
                            })
                          }
                          className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theater-300 focus:border-theater-600 p-3 text-right transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-theater-300 resize-none"
                          rows={3}
                          placeholder="כתוב את הביקורת שלך כאן..."
                        ></textarea>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelEditing}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm cursor-pointer"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          ביטול
                        </button>
                        <button
                          onClick={() => saveEdit(r._id?.toString() || "")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm cursor-pointer"
                        >
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          שמור
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              {session && hasUserReviewed()
                ? "אין ביקורות נוספות"
                : "עדיין אין חוות דעת. הוסף אחת!"}
            </p>
          );
        })()}
      </section>
    </main>
  );
}
