import { LoginCredentials, AuthResponse, User } from '@/types'
import { api } from './api'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials)

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token)
    }

    return response
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      return await api.get<User>('/me')
    } catch {
      return null
    }
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }
}