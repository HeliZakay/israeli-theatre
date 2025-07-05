/**
 * @jest-environment node
 */

import { GET, POST } from '@/app/api/shows/route'
import { NextRequest } from 'next/server'

// Mock the MongoDB client
jest.mock('@/lib/mongodb', () => {
  const mockCollection = {
    find: jest.fn().mockReturnValue({
      toArray: jest.fn()
    }),
    insertOne: jest.fn()
  }
  
  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection)
  }
  
  const mockClient = {
    db: jest.fn().mockReturnValue(mockDb)
  }
  
  return {
    __esModule: true,
    default: Promise.resolve(mockClient)
  }
})

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => {
      const response = new Response(JSON.stringify(data), init)
      response.json = jest.fn().mockResolvedValue(data)
      return response
    })
  },
  NextRequest: jest.fn()
}))

describe('/api/shows', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/shows', () => {
    it('should return shows list successfully', async () => {
      const mockShows = [
        {
          _id: '507f1f77bcf86cd799439011',
          title: 'מלכת היופי של ירושלים',
          venue: 'תיאטרון בית ליסין',
          description: 'הצגה מרגשת',
          posterUrl: '/images/test-show.jpg'
        }
      ]

      // Setup mock
      const clientPromise = require('@/lib/mongodb').default
      const client = await clientPromise
      client.db().collection().find().toArray.mockResolvedValue(mockShows)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockShows)
      expect(client.db().collection).toHaveBeenCalledWith('shows')
    })

    it('should handle database errors gracefully', async () => {
      // Setup mock to throw error
      const clientPromise = require('@/lib/mongodb').default
      const client = await clientPromise
      client.db().collection().find().toArray.mockRejectedValue(new Error('Database error'))

      await expect(GET()).rejects.toThrow('Database error')
    })
  })

  describe('POST /api/shows', () => {
    it('should create a new show successfully', async () => {
      const newShow = {
        title: 'הצגה חדשה',
        venue: 'תיאטרון חדש',
        description: 'תיאור הצגה',
        posterUrl: '/images/new-show.jpg'
      }

      const mockInsertResult = {
        insertedId: '507f1f77bcf86cd799439012'
      }

      // Setup mock
      const clientPromise = require('@/lib/mongodb').default
      const client = await clientPromise
      client.db().collection().insertOne.mockResolvedValue(mockInsertResult)

      const request = {
        json: jest.fn().mockResolvedValue(newShow)
      }

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual({ _id: mockInsertResult.insertedId })
      expect(client.db().collection().insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          ...newShow,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      )
    })
  })
})
