// src/components/Footer.tsx
"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-theater-900 text-white py-8 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-right space-y-6 md:space-y-0">
        <div className="flex flex-col items-center md:items-start space-y-3">
          <img
            src="/logo.svg"
            alt="תיאטרון בישראל"
            className="h-12 w-auto opacity-80"
          />
          <p className="text-sm opacity-75">
            © {new Date().getFullYear()} תיאטרון בישראל. כל הזכויות שמורות.
          </p>
        </div>
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          <li>
            <Link
              href="/"
              className="hover:underline opacity-75 hover:opacity-100 transition-opacity"
            >
              בית
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="hover:underline opacity-75 hover:opacity-100 transition-opacity"
            >
              אודות
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="hover:underline opacity-75 hover:opacity-100 transition-opacity"
            >
              צור קשר
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
