import { render, screen, fireEvent } from "@testing-library/react";
import ReviewCard from "@/components/ReviewCard";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({ href, children, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const mockReview = {
  _id: "507f1f77bcf86cd799439012",
  showId: "507f1f77bcf86cd799439011",
  userName: "חלי זכאי",
  rating: 5,
  comment: "הצגה מדהימה! המוזיקה והמשחק היו ברמה גבוהה מאוד.",
  createdAt: new Date("2025-01-01T12:00:00Z"),
  showTitle: "מלכת היופי של ירושלים",
  showPosterUrl: "/images/test-show.jpg",
};

describe("ReviewCard Component", () => {
  it("renders review information correctly", () => {
    render(<ReviewCard review={mockReview} />);

    // Check if user name is rendered
    expect(screen.getByText("חלי זכאי")).toBeInTheDocument();

    // Check if comment is rendered
    expect(
      screen.getByText("הצגה מדהימה! המוזיקה והמשחק היו ברמה גבוהה מאוד.")
    ).toBeInTheDocument();

    // Check if stars are rendered (5 stars)
    expect(screen.getByText("⭐⭐⭐⭐⭐")).toBeInTheDocument();
  });

  it("displays creation date", () => {
    render(<ReviewCard review={mockReview} />);

    // Check if date is displayed (formatted)
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it("renders show poster and title when available", () => {
    render(<ReviewCard review={mockReview} />);

    // Check if poster image is rendered
    const image = screen.getByAltText("מלכת היופי של ירושלים");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/test-show.jpg");

    // Check if show title links are rendered (there are multiple ones)
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/shows/507f1f77bcf86cd799439011");
    });
  });

  it("handles long comments with read more functionality", () => {
    const longComment = "זהו תגובה ארוכה מאוד שצריכה להיות מקוצרת. ".repeat(10);
    const reviewWithLongComment = {
      ...mockReview,
      comment: longComment,
    };

    render(<ReviewCard review={reviewWithLongComment} />);

    // Should show truncated text initially
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();

    // Should have "read more" functionality
    const readMoreButton = screen.getByText("קרא עוד");
    expect(readMoreButton).toBeInTheDocument();

    // Click read more
    fireEvent.click(readMoreButton);

    // Should show "read less" button after clicking
    expect(screen.getByText("קרא פחות")).toBeInTheDocument();
  });

  it("renders without poster when showPosterUrl is not provided", () => {
    const reviewWithoutPoster = { ...mockReview, showPosterUrl: null };
    render(<ReviewCard review={reviewWithoutPoster} />);

    // Should still render other content
    expect(screen.getByText("חלי זכאי")).toBeInTheDocument();

    // Should not render image
    expect(
      screen.queryByAltText("מלכת היופי של ירושלים")
    ).not.toBeInTheDocument();
  });
});
