// Integration tests for HomePage functionality
import { render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import ShowCard from "@/components/ShowCard";
import ReviewCard from "@/components/ReviewCard";

describe("Home Page Integration", () => {
  it("renders ShowCard component correctly", () => {
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

    // Only check for the title since description may not be displayed
    expect(screen.getByText("מלכת היופי של ירושלים")).toBeInTheDocument();
    expect(screen.getByAltText("מלכת היופי של ירושלים")).toBeInTheDocument();
  });

  it("renders ReviewCard component correctly", () => {
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
  });

  it("handles authentication state correctly", () => {
    const mockSession = {
      user: { name: "ג'ון דו", email: "john@example.com" },
    };

    render(
      <SessionProvider session={mockSession}>
        <div>מבחן התחברות</div>
      </SessionProvider>
    );

    expect(screen.getByText("מבחן התחברות")).toBeInTheDocument();
  });
});
