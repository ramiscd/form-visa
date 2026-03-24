import { api } from '@/services/api'

export async function testApi() {
  try {
    const res = await api.get('/health')
    console.log('API OK:', res)
  } catch (err) {
    console.error('Erro API:', err)
  }
}