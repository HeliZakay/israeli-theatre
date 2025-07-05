import { showsCollection, reviewsCollection } from "@/lib/db";

// Mock the MongoDB connection
jest.mock("@/lib/mongodb", () => {
  const mockCollection = {
    find: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection),
  };

  const mockClient = {
    db: jest.fn().mockReturnValue(mockDb),
  };

  return Promise.resolve(mockClient);
});

describe("Database Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("showsCollection", () => {
    it("should return shows collection", async () => {
      const collection = await showsCollection();
      expect(collection).toBeDefined();
      expect(typeof collection.find).toBe("function");
    });
  });

  describe("reviewsCollection", () => {
    it("should return reviews collection", async () => {
      const collection = await reviewsCollection();
      expect(collection).toBeDefined();
      expect(typeof collection.find).toBe("function");
    });
  });
});
