// API service for communicating with the MooFoo backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface UserRequest {
  message: string
  user_id?: string
}

export interface Recipe {
  name: string
  cuisine_type: string
  prep_time: string
  cook_time: string
  ingredients: string[]
  instructions: string[]
  youtube_videos?: string[]
}

export interface Restaurant {
  name: string
  cuisine_type: string
  rating?: number
  price_range: string
  address: string
  phone?: string
  specialties: string[]
}

export interface FoodRecommendation {
  recommendation_type: 'recipe' | 'restaurant' | 'delivery'
  recipes?: Recipe[]
  restaurants?: Restaurant[]
  mood_analysis: string
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const api = {
  async getRecommendation(request: UserRequest): Promise<FoodRecommendation> {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API Error:', error)
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to get recommendation. Please try again.')
    }
  },

  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      if (!response.ok) {
        throw new ApiError(`Health check failed: ${response.status}`)
      }
      return response.json()
    } catch (error) {
      console.error('Health check error:', error)
      throw new ApiError('Backend is not available')
    }
  },

  async getRoot(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/`)
      if (!response.ok) {
        throw new ApiError(`Root endpoint failed: ${response.status}`)
      }
      return response.json()
    } catch (error) {
      console.error('Root endpoint error:', error)
      throw new ApiError('Backend is not available')
    }
  }
} 