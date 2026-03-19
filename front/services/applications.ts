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
    await delay(400)
    return mockFormStructure
  },

  async getSavedAnswers(): Promise<Record<number, string | boolean | number>> {
    await delay(300)
    return savedAnswers
  },

  async saveAnswer(payload: SaveAnswerPayload): Promise<{ success: boolean }> {
    await delay(200)
    savedAnswers[payload.questionId] = payload.value
    return { success: true }
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
