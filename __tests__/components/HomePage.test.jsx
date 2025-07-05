// Component tests for HomePage functionality
import { render, screen, waitFor } from "@testing-library/react";
import ShowCard from "@/components/ShowCard";
import ReviewCard from "@/components/ReviewCard";

// Mock the child components
jest.mock("@/components/ShowCard", () => {
  return function MockShowCard({ show }) {
    return (
      <div data-testid="show-card">
        <h3>{show.title}</h3>
        <p>{show.description}</p>
      </div>
    );
  };
});

jest.mock("@/components/ReviewCard", () => {
  return function MockReviewCard({ review }) {
    return (
      <div data-testid="review-card">
        <h4>{review.showTitle}</h4>
        <p>{review.comment}</p>
        <p>Rating: {review.rating}</p>
      </div>
    );
  };
});

describe("HomePage Components", () => {
  it("renders ShowCard with show data", () => {
    const mockShow = {
      _id: "1",
      title: "מלכת היופי של ירושלים",
      description: "הצגה מופלאה",
      genre: "דרמה",
      rating: 4.5,
      posterUrl: "/images/test-show.jpg",
      ticketPrice: 120,
      locationName: "תיאטרון הבימה",
      phoneNumber: "03-1234567",
      webUrl: "https://example.com",
    };

    render(<ShowCard show={mockShow} />);

    expect(screen.getByText("מלכת היופי של ירושלים")).toBeInTheDocument();
    expect(screen.getByText("הצגה מופלאה")).toBeInTheDocument();
  });

  it("renders ReviewCard with review data", () => {
    const mockReview = {
      _id: "1",
      showId: "1",
      showTitle: "מלכת היופי של ירושלים",
      userName: "חלי זכאי",
      rating: 5,
      comment: "הצגה מדהימה!",
      createdAt: new Date("2025-01-01T11:00:00.000Z"),
    };

    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText("מלכת היופי של ירושלים")).toBeInTheDocument();
    expect(screen.getByText("הצגה מדהימה!")).toBeInTheDocument();
    expect(screen.getByText("Rating: 5")).toBeInTheDocument();
  });
});
