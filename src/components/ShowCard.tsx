// src/components/ShowCard.tsx
"use client";

import Link from "next/link";
import type { ShowCardData } from "@/types/models";

interface ShowCardProps {
  show: ShowCardData;
}

export default function ShowCard({ show }: ShowCardProps) {
  return (
    <Link
      href={`/shows/${show.id}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-gray-100"
    >
      {show.posterUrl && (
        <div className="relative overflow-hidden">
          <img
            src={show.posterUrl}
            alt={show.title}
            className="w-full h-56 object-cover object-top transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      <div className="p-4 text-right bg-gradient-to-br from-white to-theater-50/30">
        <h3 className="text-xl font-semibold mb-1 text-theater-900 transition-colors duration-300">
          {show.title}
        </h3>
        <p className="text-gray-600 transition-colors duration-300">
          {show.venue}
        </p>
      </div>
    </Link>
  );
}
