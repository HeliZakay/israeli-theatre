import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Theater Colors - Deep, Rich, Elegant (like velvet theater curtains)
        theater: {
          50: "#fdf2f2", // Very light background
          100: "#fce7e7", // Light background
          200: "#f8d7d7", // Light background medium
          300: "#f0b8b8", // Light accent
          400: "#e89494", // Medium accent
          500: "#dc6b6b", // Medium theater red
          600: "#8b1538", // Deep wine red - main theater color
          700: "#7a1230", // Darker wine
          800: "#651025", // Rich burgundy
          900: "#4a0c1a", // Deep burgundy
          950: "#2d0610", // Darkest theater red
        },
        // גוונים נוספים לשלמות העיצוב
        burgundy: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#7f1d1d", // בורדו עמוק
          600: "#6b1717",
          700: "#5b1414",
          800: "#4a1010",
          900: "#2d0a0a",
          950: "#1a0505",
        },
        curtain: {
          50: "#fdf2f2",
          100: "#fce7e7",
          200: "#fbd4d4",
          300: "#f8b4b4",
          400: "#f87171",
          500: "#8b0000", // וילון תיאטרון אדום כהה
          600: "#7f1d1d",
          700: "#6b1717",
          800: "#5b1414",
          900: "#4a1010",
          950: "#2d0a0a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
