"use client";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <title>תיאטרון בישראל - כל ההצגות במקום אחד</title>
      </head>
      <body className="flex flex-col min-h-screen">
        <SessionProvider>
          <Header />
          <div className="flex-grow">{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
