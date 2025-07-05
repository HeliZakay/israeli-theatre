import { render, screen } from '@testing-library/react'
import ShowCard from '@/components/ShowCard'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }) {
    return <a href={href} {...props}>{children}</a>
  }
})

const mockShow = {
  id: '507f1f77bcf86cd799439011',
  title: 'מלכת היופי של ירושלים',
  venue: 'תיאטרון בית ליסין',
  posterUrl: '/images/test-show.jpg'
}

describe('ShowCard Component', () => {
  it('renders show information correctly', () => {
    render(<ShowCard show={mockShow} />)
    
    // Check if title is rendered
    expect(screen.getByText('מלכת היופי של ירושלים')).toBeInTheDocument()
    
    // Check if venue is rendered
    expect(screen.getByText('תיאטרון בית ליסין')).toBeInTheDocument()
    
    // Check if it's a link to the show page
    expect(screen.getByRole('link')).toHaveAttribute('href', '/shows/507f1f77bcf86cd799439011')
  })

  it('renders show image with correct alt text when posterUrl exists', () => {
    render(<ShowCard show={mockShow} />)
    
    const image = screen.getByAltText('מלכת היופי של ירושלים')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/test-show.jpg')
  })

  it('renders without image when posterUrl is not provided', () => {
    const showWithoutPoster = { ...mockShow, posterUrl: null }
    render(<ShowCard show={showWithoutPoster} />)
    
    // Should still render title and venue
    expect(screen.getByText('מלכת היופי של ירושלים')).toBeInTheDocument()
    expect(screen.getByText('תיאטרון בית ליסין')).toBeInTheDocument()
    
    // Should not render image
    expect(screen.queryByAltText('מלכת היופי של ירושלים')).not.toBeInTheDocument()
  })

  it('has correct CSS classes for styling', () => {
    render(<ShowCard show={mockShow} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('group', 'block', 'bg-white', 'rounded-lg')
  })
})
