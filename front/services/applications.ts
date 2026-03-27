import type {
  Application,
  FormStructure,
  SaveAnswerPayload,
  Document,
  AdminApplication,
  ApplicationDetail
} from '@/types'
import { delay } from './mock-data'
import { api } from './api'

export const applicationService = {
  async getCurrentApplication(): Promise<Application> {
    return api.get('/applications/current')
  },

  async getFormStructure(): Promise<FormStructure> {
    return api.get('/form_structure')
  },

  async getSavedAnswers(): Promise<Record<number, any>> {
    return api.get('/answers')
  },

  async saveAnswer(payload: SaveAnswerPayload): Promise<{ success: boolean }> {
    return api.post('/answers', {
      question_id: payload.questionId,
      value: payload.value,
    })
  },

  async submitApplication(): Promise<{ success: boolean }> {
    await delay(800)
    return { success: true }
  },

  async getDocuments(): Promise<Document[]> {
    return api.get('/applications/current/documents')
  },

  async uploadDocument(
    type: Document['type'],
    file: File
  ): Promise<Document> {
    const formData = new FormData()
    formData.append('type', type)
    formData.append('file', file)

    return api.uploadFile('/applications/current/documents', formData)
  },

  async deleteDocument(documentId: string | number): Promise<{ success: boolean }> {
    return api.delete(`/documents/${documentId}`)
  },

  async getAdminApplications(status?: Application['status']): Promise<AdminApplication[]> {
    const params = status ? `?status=${status}` : ''
    return api.get<AdminApplication[]>(`/applications${params}`)
  },

  async getApplicationDetail(id: string): Promise<ApplicationDetail> {
    return api.get<ApplicationDetail>(`/applications/${id}`)
  },
}