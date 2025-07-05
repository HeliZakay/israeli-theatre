import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer Component", () => {
  it("renders footer content", () => {
    render(<Footer />);

    // Check if footer is rendered
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    // Check if copyright text is present
    expect(screen.getByText(/© 2025/)).toBeInTheDocument();

    // Check if links are present
    expect(screen.getByRole("link", { name: /אודות/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /צור קשר/i })).toBeInTheDocument();
  });

  it("has correct navigation links", () => {
    render(<Footer />);

    const aboutLink = screen.getByRole("link", { name: /אודות/i });
    const contactLink = screen.getByRole("link", { name: /צור קשר/i });

    expect(aboutLink).toHaveAttribute("href", "/about");
    expect(contactLink).toHaveAttribute("href", "/contact");
  });
});
