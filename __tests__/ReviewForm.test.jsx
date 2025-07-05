import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReviewForm from "@/components/ReviewForm";

// Mock NextAuth
jest.mock("next-auth/react");
const mockUseSession = useSession;

// Mock Next.js router
jest.mock("next/navigation");
const mockUseRouter = useRouter;

// Mock fetch
global.fetch = jest.fn();

describe("ReviewForm Component", () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    mockUseRouter.mockReturnValue(mockRouter);
    fetch.mockClear();
  });

  it("renders form when user is not authenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<ReviewForm showId="123" />);

    expect(screen.getByText(/השאר חוות דעת/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/שמך המלא/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /שלח חוות דעת/i })
    ).toBeInTheDocument();
  });

  it("renders form when user is authenticated", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { name: "ג'ון דו", email: "john@example.com" },
      },
      status: "authenticated",
    });

    render(<ReviewForm showId="123" />);

    expect(screen.getByText(/השאר חוות דעת/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("ג'ון דו")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /שלח חוות דעת/i })
    ).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { name: "ג'ון דו", email: "john@example.com" },
      },
      status: "authenticated",
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ReviewForm showId="123" />);

    const textarea = screen.getByPlaceholderText(/כתוב כאן את חוות דעתך/);
    const submitButton = screen.getByRole("button", { name: /שלח חוות דעת/i });

    // Fill in the form
    fireEvent.change(textarea, { target: { value: "הצגה מדהימה!" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/shows/123/reviews",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("הצגה מדהימה!"),
        })
      );
    });
  });

  it("handles form submission error", async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { name: "ג'ון דו", email: "john@example.com" },
      },
      status: "authenticated",
    });

    // Mock console.error to avoid error output in tests
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetch.mockRejectedValueOnce(new Error("Server error"));

    render(<ReviewForm showId="123" />);

    const textarea = screen.getByPlaceholderText(/כתוב כאן את חוות דעתך/);
    const submitButton = screen.getByRole("button", { name: /שלח חוות דעת/i });

    fireEvent.change(textarea, { target: { value: "הצגה מדהימה!" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error submitting review:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
