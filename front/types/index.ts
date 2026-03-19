// Auth Types
export interface User {
  id: string
  email: string
  name: string
  role: 'client' | 'admin'
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SetPasswordData {
  token: string
  password: string
}

// Application Types
export type ApplicationStatus = 'in_progress' | 'completed' | 'submitted'

export interface Application {
  id: string
  userId: string
  status: ApplicationStatus
  progress: number
  createdAt: string
  updatedAt: string
}

export interface AdminApplication extends Application {
  userName: string
  userEmail: string
}

// Form Types
export type QuestionType = 'text' | 'select' | 'boolean' | 'date' | 'textarea'

export interface QuestionCondition {
  question_id: number
  value: string | boolean | number
}

export interface QuestionOption {
  label: string
  value: string
}

export interface Question {
  id: number
  type: QuestionType
  label: string
  required: boolean
  placeholder?: string
  options?: QuestionOption[]
  condition?: QuestionCondition
}

export interface FormSection {
  id: string
  title: string
  description?: string
  questions: Question[]
}

export interface FormStructure {
  sections: FormSection[]
}

export interface Answer {
  questionId: number
  value: string | boolean | number
}

export interface SaveAnswerPayload {
  questionId: number
  value: string | boolean | number
}

// Document Types
export type DocumentType = 'passport' | 'photo' | 'additional'

export interface Document {
  id: string
  type: DocumentType
  fileName: string
  fileUrl: string
  uploadedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

// Admin Types
export interface ApplicationDetail {
  id: string
  user: User
  status: ApplicationStatus
  progress: number
  sections: SectionAnswers[]
  documents: Document[]
  createdAt: string
  updatedAt: string
}

export interface SectionAnswers {
  title: string
  answers: {
    question: string
    value: string | boolean | number
  }[]
}
