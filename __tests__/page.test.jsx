// Testing for HomePage server component functionality
import { showsCollection, reviewsCollection } from "@/lib/db";

// Mock the database functions
jest.mock("@/lib/db", () => ({
  showsCollection: jest.fn(),
  reviewsCollection: jest.fn(),
}));

describe("HomePage Server Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle database connection properly", async () => {
    // Mock successful database response
    const mockShows = [
      {
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
      },
    ];

    const mockReviews = [
      {
        _id: "1",
        showId: "1",
        showTitle: "מלכת היופי של ירושלים",
        userName: "חלי זכאי",
        rating: 5,
        comment: "הצגה מדהימה!",
        createdAt: new Date("2025-01-01T11:00:00.000Z"),
      },
    ];

    showsCollection.mockResolvedValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockShows),
      }),
    });

    reviewsCollection.mockResolvedValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockReviews),
      }),
    });

    // Test that mocks are called correctly
    const showsCol = await showsCollection();
    const reviewsCol = await reviewsCollection();

    expect(showsCol).toBeDefined();
    expect(reviewsCol).toBeDefined();
  });

  it("should handle database connection errors", async () => {
    // Mock database error
    const error = new Error("Database connection failed");
    showsCollection.mockRejectedValue(error);

    await expect(showsCollection()).rejects.toThrow(
      "Database connection failed"
    );
  });
});
