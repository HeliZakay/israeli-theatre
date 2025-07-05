// src/components/Header.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();
  const userName = session?.user?.name;
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActivePage = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  const getLinkClasses = (path: string, baseClasses: string) => {
    const activeClasses =
      "text-white font-semibold bg-theater-800 px-3 py-1 rounded-md";
    const inactiveClasses = baseClasses;
    return isActivePage(path) ? activeClasses : inactiveClasses;
  };

  return (
    <header className="bg-theater-900 text-white relative sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo and mobile greeting */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center cursor-pointer">
            <img src="/logo.svg" alt="תיאטרון בישראל" className="h-16 w-auto" />
          </Link>
          {status !== "loading" && userName && (
            <span className="md:hidden bg-theater-700 text-white px-3 py-1 rounded-full text-base font-semibold">
              שלום, {userName}
            </span>
          )}
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-right">
          <Link
            href="/"
            className={getLinkClasses(
              "/",
              "font-semibold hover:text-white hover:bg-theater-800 px-3 py-1 rounded-md transition-all duration-200"
            )}
          >
            בית
          </Link>
          <Link
            href="/about"
            className={getLinkClasses(
              "/about",
              "font-semibold hover:text-white hover:bg-theater-800 px-3 py-1 rounded-md transition-all duration-200"
            )}
          >
            אודות
          </Link>
          <Link
            href="/contact"
            className={getLinkClasses(
              "/contact",
              "font-semibold hover:text-white hover:bg-theater-800 px-3 py-1 rounded-md transition-all duration-200"
            )}
          >
            צור קשר
          </Link>

          {status === "loading" ? null : userName ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="bg-white text-theater-800 px-4 py-2 rounded-full text-lg font-semibold hover:bg-theater-50 hover:text-theater-900 transition-all duration-200 shadow-lg border-2 border-white"
              >
                שלום, {userName}
              </Link>
              <button
                onClick={() => signOut()}
                className="px-3 py-1 border border-white rounded hover:bg-white hover:text-theater-900 text-right cursor-pointer transition-all duration-200"
              >
                התנתק
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="border border-white px-3 py-1 rounded hover:bg-white hover:text-theater-900 transition-all duration-200"
              >
                התחבר
              </Link>
              <Link
                href="/signup"
                className="bg-white text-theater-800 px-3 py-1 rounded hover:bg-theater-50 hover:text-theater-900 font-semibold transition-all duration-200 shadow-md border-2 border-white"
              >
                הירשם
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger toggle */}
        <button
          className="md:hidden text-2xl cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? "✖️" : "☰"}
        </button>
      </div>

      {/* Mobile navigation dropdown */}
      {open && (
        <nav className="absolute top-full right-0 bg-theater-900 w-full z-50">
          <ul className="flex flex-col space-y-2 p-4 text-right">
            <li>
              <Link
                href="/"
                className={getLinkClasses(
                  "/",
                  "block font-semibold hover:text-white hover:bg-theater-800 py-2 px-3 rounded-md transition-all duration-200"
                )}
                onClick={() => setOpen(false)}
              >
                בית
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={getLinkClasses(
                  "/about",
                  "block font-semibold hover:text-white hover:bg-theater-800 py-2 px-3 rounded-md transition-all duration-200"
                )}
                onClick={() => setOpen(false)}
              >
                אודות
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={getLinkClasses(
                  "/contact",
                  "block font-semibold hover:text-white hover:bg-theater-800 py-2 px-3 rounded-md transition-all duration-200"
                )}
                onClick={() => setOpen(false)}
              >
                צור קשר
              </Link>
            </li>
            {status === "loading" ? null : userName ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    className="block bg-white text-theater-800 px-3 py-2 rounded-lg hover:bg-theater-50 hover:text-theater-900 transition-all duration-200 font-semibold text-center shadow-lg border-2 border-white"
                    onClick={() => setOpen(false)}
                  >
                    שלום, {userName}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                    className="w-full text-right px-3 py-1 border border-white rounded hover:bg-white hover:text-theater-900 cursor-pointer transition-all duration-200"
                  >
                    התנתק
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="block border border-white px-3 py-1 rounded hover:bg-white hover:text-theater-900 transition-all duration-200"
                    onClick={() => setOpen(false)}
                  >
                    התחבר
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="block bg-white text-theater-800 px-3 py-1 rounded hover:bg-theater-50 hover:text-theater-900 font-semibold transition-all duration-200 shadow-md border-2 border-white"
                    onClick={() => setOpen(false)}
                  >
                    הירשם
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
