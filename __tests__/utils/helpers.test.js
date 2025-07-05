import {
  formatDate,
  validateEmail,
  validateRating,
  sanitizeInput,
} from "@/utils/helpers";

describe("Helper Functions", () => {
  describe("formatDate", () => {
    it("formats date correctly in Hebrew", () => {
      const date = new Date("2025-01-15");
      const formatted = formatDate(date);
      expect(formatted).toMatch(/2025/);
      expect(formatted).toMatch(/ינואר/);
    });

    it("returns empty string for invalid date", () => {
      expect(formatDate(null)).toBe("");
      expect(formatDate(undefined)).toBe("");
      expect(formatDate("")).toBe("");
    });
  });

  describe("validateEmail", () => {
    it("validates correct email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.co.il")).toBe(true);
      expect(validateEmail("hebrew@דוגמה.com")).toBe(true);
    });

    it("rejects invalid email addresses", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@domain.com")).toBe(false);
      expect(validateEmail("test.domain.com")).toBe(false);
    });
  });

  describe("validateRating", () => {
    it("validates correct rating values", () => {
      expect(validateRating(1)).toBe(true);
      expect(validateRating(3)).toBe(true);
      expect(validateRating(5)).toBe(true);
    });

    it("rejects invalid rating values", () => {
      expect(validateRating(0)).toBe(false);
      expect(validateRating(6)).toBe(false);
      expect(validateRating(3.5)).toBe(false);
      expect(validateRating("3")).toBe(false);
    });
  });

  describe("sanitizeInput", () => {
    it("trims whitespace and removes dangerous characters", () => {
      expect(sanitizeInput("  hello world  ")).toBe("hello world");
      expect(sanitizeInput('test<script>alert("xss")</script>')).toBe(
        'testscriptalert("xss")/script'
      );
      expect(sanitizeInput("normal text")).toBe("normal text");
    });

    it("handles non-string inputs", () => {
      expect(sanitizeInput(null)).toBe("");
      expect(sanitizeInput(undefined)).toBe("");
      expect(sanitizeInput(123)).toBe("");
    });
  });
});
