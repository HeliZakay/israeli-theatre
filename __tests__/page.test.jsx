import { render, screen, waitFor } from '@testing-library/react'
import Home from '@/app/page'

// Mock the fetch function
global.fetch = jest.fn()

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated'
  }))
}))

const mockShows = [
  {
    _id: '507f1f77bcf86cd799439011',
    title: 'מלכת היופי של ירושלים',
    venue: 'תיאטרון בית ליסין',
    description: 'הצגה מרגשת על חיי היומיום בירושלים',
    image: '/images/test-show.jpg',
    genre: 'דרמה',
    duration: '120 דקות',
    rating: 4.5,
    reviewCount: 25
  }
]

describe('Home Page', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders welcome message', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockShows
    })

    render(<Home />)
    
    // Check if welcome message is displayed
    expect(screen.getByText(/ברוכים הבאים/)).toBeInTheDocument()
  })

  it('displays loading state initially', () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})) // Never resolves
    
    render(<Home />)
    
    expect(screen.getByText(/טוען/)).toBeInTheDocument()
  })

  it('displays shows after loading', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockShows
    })

    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('מלכת היופי של ירושלים')).toBeInTheDocument()
    })
  })

  it('handles API error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'))
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/שגיאה בטעינת הנתונים/)).toBeInTheDocument()
    })
  })
})
