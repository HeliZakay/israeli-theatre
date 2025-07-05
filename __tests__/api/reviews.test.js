/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/reviews/route";
import { NextRequest } from "next/server";

// Mock the MongoDB client promise
const mockCollection = {
  find: jest.fn().mockReturnValue({
    toArray: jest.fn(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  }),
  insertOne: jest.fn(),
};

const mockDb = {
  collection: jest.fn().mockReturnValue(mockCollection),
};

const mockClient = {
  db: jest.fn().mockReturnValue(mockDb),
};

jest.mock("@/lib/mongodb", () => Promise.resolve(mockClient));

describe("/api/reviews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/reviews", () => {
    it("should return reviews list successfully", async () => {
      const mockReviews = [
        {
          _id: "507f1f77bcf86cd799439011",
          showId: "507f1f77bcf86cd799439012",
          userName: "חלי זכאי",
          rating: 5,
          comment: "הצגה מדהימה!",
          createdAt: new Date(),
        },
      ];

      mockCollection.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue(mockReviews),
          }),
        }),
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockReviews);
    });

    it("should handle database errors gracefully", async () => {
      mockCollection.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            toArray: jest.fn().mockRejectedValue(new Error("Database error")),
          }),
        }),
      });

      await expect(GET()).rejects.toThrow("Database error");
    });
  });

  describe("POST /api/reviews", () => {
    it("should create a new review successfully", async () => {
      const newReview = {
        showId: "507f1f77bcf86cd799439012",
        userName: "חלי זכאי",
        rating: 5,
        comment: "הצגה מדהימה!",
      };

      const mockInsertResult = {
        insertedId: "507f1f77bcf86cd799439013",
      };

      mockCollection.insertOne.mockResolvedValue(mockInsertResult);

      const request = {
        json: jest.fn().mockResolvedValue(newReview),
      };

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({ _id: mockInsertResult.insertedId });
      expect(mockCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          ...newReview,
          createdAt: expect.any(Date),
        })
      );
    });
  });
});
