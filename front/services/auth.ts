import type { AuthResponse, LoginCredentials, SetPasswordData, User } from '@/types'
import { delay, mockUsers } from './mock-data'

// Para desenvolvimento, usamos mocks
// Em produção, substituir por chamadas reais à API

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800)
    
    // Mock: verificar credenciais
    const user = mockUsers.find(u => u.email === credentials.email)
    
    if (!user || credentials.password !== '123456') {
      throw new Error('Email ou senha inválidos')
    }

    const token = `mock_token_${user.id}_${Date.now()}`
    
    return {
      token,
      user,
    }
  },

  async setPassword(data: SetPasswordData): Promise<AuthResponse> {
    await delay(800)
    
    // Mock: validar token e definir senha
    if (!data.token || data.token.length < 10) {
      throw new Error('Token inválido ou expirado')
    }

    const user = mockUsers[0] // Mock: retorna o primeiro usuário
    const token = `mock_token_${user.id}_${Date.now()}`

    return {
      token,
      user,
    }
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(300)
    
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('auth_token') 
      : null
    
    if (!token) return null

    // Mock: extrair user_id do token
    const match = token.match(/mock_token_(\d+)/)
    if (!match) return null

    const userId = match[1]
    const user = mockUsers.find(u => u.id === userId)
    
    return user || null
  },

  async logout(): Promise<void> {
    await delay(200)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  },

  async validateToken(token: string): Promise<boolean> {
    await delay(300)
    // Mock: token válido se começar com mock_token_
    return token.startsWith('mock_token_')
  },
}
