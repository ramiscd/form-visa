import type {
  Application,
  FormStructure,
  SaveAnswerPayload,
  Document,
  AdminApplication,
  ApplicationDetail
} from '@/types'
import {
  delay,
  mockCurrentApplication,
  mockFormStructure,
  mockSavedAnswers,
  mockDocuments,
  mockAdminApplications,
  mockApplicationDetail
} from './mock-data'
import { api } from './api'

// Armazenamento local para respostas (simula persistência)
let savedAnswers = { ...mockSavedAnswers }
let documents = [...mockDocuments]

export const applicationService = {
  // Client APIs
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

  // Document APIs
  async getDocuments(): Promise<Document[]> {
    await delay(400)
    return documents
  },

  async uploadDocument(
    type: Document['type'],
    file: File
  ): Promise<Document> {
    await delay(1000)

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      type,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      status: 'pending',
    }

    // Remove documento antigo do mesmo tipo
    documents = documents.filter(d => d.type !== type)
    documents.push(newDoc)

    return newDoc
  },

  async deleteDocument(documentId: string): Promise<{ success: boolean }> {
    await delay(400)
    documents = documents.filter(d => d.id !== documentId)
    return { success: true }
  },

  // applicationService.ts
  async getAdminApplications(status?: Application['status']): Promise<AdminApplication[]> {
    const params = status ? `?status=${status}` : ''
    return api.get<AdminApplication[]>(`/applications${params}`)
  },

  async getApplicationDetail(id: string): Promise<ApplicationDetail> {
    return api.get<ApplicationDetail>(`/applications/${id}`)
  },
}
