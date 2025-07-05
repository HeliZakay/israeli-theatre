// src/components/ReviewCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface ReviewData {
  _id?: string;
  showId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userId?: string;
  userEmail?: string;
  showTitle?: string;
  showPosterUrl?: string | null;
}

interface ReviewCardProps {
  review: ReviewData;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150; // Maximum characters before "read more"
  const shouldTruncate = review.comment.length > maxLength;
  const displayText =
    shouldTruncate && !isExpanded
      ? review.comment.substring(0, maxLength) + "..."
      : review.comment;

  return (
    <li
      className={`bg-white rounded-lg shadow flex gap-4 overflow-hidden transition-all duration-300 ${
        isExpanded ? "h-auto" : "h-40"
      }`}
    >
      {/* Show poster */}
      {review.showPosterUrl && (
        <div className="flex-shrink-0">
          <img
            src={review.showPosterUrl}
            alt={review.showTitle}
            className="w-24 h-full object-cover"
          />
        </div>
      )}

      {/* Review content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Show title link with rating */}
        <div className="flex items-center gap-3 mb-2">
          <Link
            href={`/shows/${review.showId.toString()}`}
            className="text-theater-700 font-bold text-lg hover:underline"
          >
            {review.showTitle}
          </Link>
          <p className="text-yellow-500">{"⭐".repeat(review.rating)}</p>
        </div>

        {/* Reviewer */}
        <p className="font-semibold text-sm mb-2">{review.userName}</p>

        {/* Comment */}
        <div className={`${isExpanded ? "flex-1" : "overflow-hidden"}`}>
          <p className="text-gray-700 text-sm leading-relaxed">
            {displayText}
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-theater-600 hover:text-theater-800 font-medium mr-2 cursor-pointer"
              >
                {isExpanded ? " קרא פחות" : " קרא עוד"}
              </button>
            )}
          </p>
        </div>

        {/* Date */}
        <p className="text-xs text-gray-500 mt-auto">
          {new Date(review.createdAt).toLocaleString("he-IL")}
        </p>
      </div>
    </li>
  );
}
