import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";

// Mock Next.js hooks
jest.mock("next-auth/react");
jest.mock("next/navigation");
jest.mock("next/link", () => {
  return function MockLink({ href, children, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const mockUseSession = useSession;
const mockUsePathname = usePathname;

describe("Header Component", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders logo and basic navigation", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<Header />);

    // Check if logo is rendered
    expect(screen.getByAltText("תיאטרון בישראל")).toBeInTheDocument();

    // Check if logo links to home
    const logoLink = screen.getByRole("link", { name: /תיאטרון בישראל/i });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("shows user greeting when authenticated", () => {
    const mockSession = {
      user: {
        name: "ג'ון דו",
        email: "john@example.com",
      },
    };

    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "authenticated",
    });

    render(<Header />);

    // Check if user greeting is displayed (there are multiple instances)
    expect(screen.getAllByText("שלום, ג'ון דו")).toHaveLength(2); // mobile and desktop versions
  });

  it("shows login/signup links when not authenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<Header />);

    // Check if login and signup links are present
    expect(screen.getByRole("link", { name: /התחבר/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /הירשם/i })).toBeInTheDocument();
  });

  it("highlights active page in navigation", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    // Mock current page as about
    mockUsePathname.mockReturnValue("/about");

    render(<Header />);

    const aboutLink = screen.getByRole("link", { name: /אודות/i });
    expect(aboutLink).toHaveClass("bg-theater-800"); // Active state class
  });

  it("shows profile and logout options when authenticated", () => {
    const mockSession = {
      user: {
        name: "ג'ון דו",
        email: "john@example.com",
      },
    };

    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "authenticated",
    });

    render(<Header />);

    // Check if profile link exists (the user greeting is the profile link)
    expect(
      screen.getByRole("link", { name: /שלום, ג'ון דו/i })
    ).toBeInTheDocument();

    // Check if logout button exists
    expect(screen.getByRole("button", { name: /התנתק/i })).toBeInTheDocument();
  });

  it("handles loading state gracefully", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "loading",
    });

    render(<Header />);

    // Should render header without user-specific content during loading
    expect(screen.getByAltText("תיאטרון בישראל")).toBeInTheDocument();
    expect(screen.queryByText(/שלום/)).not.toBeInTheDocument();
  });
});
