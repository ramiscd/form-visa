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
    await delay(500)
    
    // Calcula progresso baseado nas respostas
    const totalQuestions = mockFormStructure.sections.reduce(
      (acc, section) => acc + section.questions.filter(q => q.required).length, 
      0
    )
    const answeredQuestions = Object.keys(savedAnswers).length
    const progress = Math.round((answeredQuestions / totalQuestions) * 100)

    return {
      ...mockCurrentApplication,
      progress: Math.min(progress, 100),
      status: progress >= 100 ? 'completed' : 'in_progress',
    }
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

  // Admin APIs
  async getAdminApplications(
    status?: Application['status']
  ): Promise<AdminApplication[]> {
    await delay(600)
    
    if (status) {
      return mockAdminApplications.filter(app => app.status === status)
    }
    return mockAdminApplications
  },

  async getApplicationDetail(id: string): Promise<ApplicationDetail> {
    await delay(500)
    
    const app = mockAdminApplications.find(a => a.id === id)
    if (!app) {
      throw new Error('Aplicação não encontrada')
    }
    
    return {
      ...mockApplicationDetail,
      id,
      status: app.status,
      progress: app.progress,
    }
  },
}
