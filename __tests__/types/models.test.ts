// Tests for types and models
import type { Show, ShowCardData, Review } from "@/types/models";

describe("Type Definitions", () => {
  it("should allow creating Show objects", () => {
    const show: Show = {
      _id: "1",
      title: "Test Show",
      venue: "Test Venue",
      description: "Test Description",
      posterUrl: "/test.jpg",
      genre: "Drama",
      duration: "120 minutes",
      rating: 4.5,
      reviewCount: 10,
      ticketPrice: 100,
      locationName: "Test Location",
      phoneNumber: "123-456-7890",
      webUrl: "https://test.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(show.title).toBe("Test Show");
    expect(show.rating).toBe(4.5);
  });

  it("should allow creating ShowCardData objects", () => {
    const showCard: ShowCardData = {
      _id: "1",
      title: "Test Show",
      venue: "Test Venue",
      description: "Test Description",
      posterUrl: "/test.jpg",
      genre: "Drama",
      duration: "120 minutes",
      rating: 4.5,
      reviewCount: 10,
      ticketPrice: 100,
      locationName: "Test Location",
      phoneNumber: "123-456-7890",
      webUrl: "https://test.com",
    };

    expect(showCard.title).toBe("Test Show");
    expect(showCard.rating).toBe(4.5);
  });

  it("should allow creating Review objects", () => {
    const review: Review = {
      _id: "1",
      showId: "1",
      userName: "Test User",
      rating: 5,
      comment: "Great show!",
      createdAt: new Date(),
      userId: "user1",
      userEmail: "test@example.com",
    };

    expect(review.rating).toBe(5);
    expect(review.comment).toBe("Great show!");
  });
});
