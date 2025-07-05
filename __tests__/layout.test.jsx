import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

// Mock Next.js components
jest.mock("next/font/local", () => {
  return () => ({
    className: "mocked-font",
  });
});

// Mock SessionProvider and NextAuth completely
jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }) => children,
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock fetch for any authentication calls
global.fetch = jest.fn();

describe("RootLayout", () => {
  it("renders layout with proper structure", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("lang", "he");
  });

  it("includes metadata and proper HTML structure", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    // Check if the body has proper styling classes
    expect(document.body).toHaveClass("mocked-font");
  });
});
