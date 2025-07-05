import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }) {
    return <a href={href} {...props}>{children}</a>
  }
})

// Mock fetch globally
global.fetch = jest.fn()

const mockSession = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com'
  }
}

const mockShows = [
  {
    _id: '507f1f77bcf86cd799439011',
    title: 'מלכת היופי של ירושלים',
    venue: 'תיאטרון בית ליסין',
    description: 'הצגה מרגשת על חיי היומיום בירושלים',
    posterUrl: '/images/test-show.jpg',
    genre: 'דרמה',
    duration: '120 דקות'
  },
  {
    _id: '507f1f77bcf86cd799439012',
    title: 'דתילונים',
    venue: 'תיאטרון בית ליסין',
    description: 'קומדיה מצחיקה',
    posterUrl: '/images/test-show2.jpg',
    genre: 'קומדיה',
    duration: '90 דקות'
  }
]

describe('Home Page Integration', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('displays shows and allows navigation to show details', async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockShows
    })

    // Import Home component dynamically to avoid module loading issues
    const Home = (await import('@/app/page')).default

    render(
      <SessionProvider session={null}>
        <Home />
      </SessionProvider>
    )

    // Wait for shows to load
    await waitFor(() => {
      expect(screen.getByText('מלכת היופי של ירושלים')).toBeInTheDocument()
    })

    // Check if both shows are displayed
    expect(screen.getByText('מלכת היופי של ירושלים')).toBeInTheDocument()
    expect(screen.getByText('דתילונים')).toBeInTheDocument()

    // Check if venues are displayed
    expect(screen.getAllByText('תיאטרון בית ליסין')).toHaveLength(2)

    // Check if links are correct
    const showLinks = screen.getAllByRole('link')
    const showLink = showLinks.find(link => link.getAttribute('href') === '/shows/507f1f77bcf86cd799439011')
    expect(showLink).toBeInTheDocument()
  })

  it('handles loading and error states', async () => {
    // Mock API error
    fetch.mockRejectedValueOnce(new Error('Network error'))

    const Home = (await import('@/app/page')).default

    render(
      <SessionProvider session={null}>
        <Home />
      </SessionProvider>
    )

    // Should display error message
    await waitFor(() => {
      expect(screen.getByText(/שגיאה/)).toBeInTheDocument()
    })
  })

  it('works with authenticated user session', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockShows
    })

    const Home = (await import('@/app/page')).default

    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('מלכת היופי של ירושלים')).toBeInTheDocument()
    })

    // Additional checks for authenticated state can be added here
  })
})
