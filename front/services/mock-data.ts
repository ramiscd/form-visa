import type { 
  User, 
  Application, 
  FormStructure, 
  AdminApplication,
  ApplicationDetail,
  Document 
} from '@/types'

// Simulação de delay de rede
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock Users
export const mockUsers: User[] = [
  { id: '1', email: 'cliente@teste.com', name: 'João Silva', role: 'client' },
  { id: '2', email: 'admin@teste.com', name: 'Admin', role: 'admin' },
]

// Mock Current Application
export const mockCurrentApplication: Application = {
  id: 'app-1',
  userId: '1',
  status: 'in_progress',
  progress: 35,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
}

// Mock Form Structure
export const mockFormStructure: FormStructure = {
  sections: [
    {
      id: 'personal',
      title: 'Dados Pessoais',
      description: 'Informações básicas sobre você',
      questions: [
        {
          id: 1,
          type: 'text',
          label: 'Nome completo',
          required: true,
          placeholder: 'Digite seu nome completo',
        },
        {
          id: 2,
          type: 'text',
          label: 'Nome social (se aplicável)',
          required: false,
          placeholder: 'Digite seu nome social',
        },
        {
          id: 3,
          type: 'date',
          label: 'Data de nascimento',
          required: true,
        },
        {
          id: 4,
          type: 'select',
          label: 'Gênero',
          required: true,
          options: [
            { label: 'Masculino', value: 'male' },
            { label: 'Feminino', value: 'female' },
            { label: 'Outro', value: 'other' },
          ],
        },
        {
          id: 5,
          type: 'select',
          label: 'Estado civil',
          required: true,
          options: [
            { label: 'Solteiro(a)', value: 'single' },
            { label: 'Casado(a)', value: 'married' },
            { label: 'Divorciado(a)', value: 'divorced' },
            { label: 'Viúvo(a)', value: 'widowed' },
          ],
        },
      ],
    },
    {
      id: 'contact',
      title: 'Informações de Contato',
      description: 'Como podemos entrar em contato',
      questions: [
        {
          id: 6,
          type: 'text',
          label: 'Email',
          required: true,
          placeholder: 'seu@email.com',
        },
        {
          id: 7,
          type: 'text',
          label: 'Telefone',
          required: true,
          placeholder: '(11) 99999-9999',
        },
        {
          id: 8,
          type: 'textarea',
          label: 'Endereço completo',
          required: true,
          placeholder: 'Rua, número, bairro, cidade, estado, CEP',
        },
      ],
    },
    {
      id: 'travel',
      title: 'Histórico de Viagens',
      description: 'Informações sobre viagens anteriores',
      questions: [
        {
          id: 9,
          type: 'boolean',
          label: 'Já viajou para os Estados Unidos?',
          required: true,
        },
        {
          id: 10,
          type: 'text',
          label: 'Quando foi sua última viagem aos EUA?',
          required: true,
          placeholder: 'Ex: Janeiro de 2023',
          condition: {
            question_id: 9,
            value: true,
          },
        },
        {
          id: 11,
          type: 'textarea',
          label: 'Descreva o motivo da viagem anterior',
          required: false,
          placeholder: 'Turismo, negócios, estudos...',
          condition: {
            question_id: 9,
            value: true,
          },
        },
        {
          id: 12,
          type: 'boolean',
          label: 'Já teve visto americano negado?',
          required: true,
        },
        {
          id: 13,
          type: 'textarea',
          label: 'Explique o motivo da negativa',
          required: true,
          placeholder: 'Descreva as circunstâncias...',
          condition: {
            question_id: 12,
            value: true,
          },
        },
      ],
    },
    {
      id: 'employment',
      title: 'Informações Profissionais',
      description: 'Sobre seu trabalho atual',
      questions: [
        {
          id: 14,
          type: 'select',
          label: 'Situação profissional atual',
          required: true,
          options: [
            { label: 'Empregado(a)', value: 'employed' },
            { label: 'Autônomo(a)', value: 'self_employed' },
            { label: 'Empresário(a)', value: 'business_owner' },
            { label: 'Estudante', value: 'student' },
            { label: 'Aposentado(a)', value: 'retired' },
            { label: 'Desempregado(a)', value: 'unemployed' },
          ],
        },
        {
          id: 15,
          type: 'text',
          label: 'Nome da empresa/instituição',
          required: true,
          placeholder: 'Nome da empresa onde trabalha ou estuda',
        },
        {
          id: 16,
          type: 'text',
          label: 'Cargo/Função',
          required: true,
          placeholder: 'Seu cargo atual',
        },
        {
          id: 17,
          type: 'text',
          label: 'Tempo no emprego atual',
          required: true,
          placeholder: 'Ex: 2 anos e 6 meses',
        },
      ],
    },
    {
      id: 'trip_details',
      title: 'Detalhes da Viagem',
      description: 'Informações sobre a viagem planejada',
      questions: [
        {
          id: 18,
          type: 'select',
          label: 'Motivo da viagem',
          required: true,
          options: [
            { label: 'Turismo', value: 'tourism' },
            { label: 'Negócios', value: 'business' },
            { label: 'Estudos', value: 'studies' },
            { label: 'Tratamento médico', value: 'medical' },
            { label: 'Visita a familiares', value: 'family' },
            { label: 'Outro', value: 'other' },
          ],
        },
        {
          id: 19,
          type: 'date',
          label: 'Data prevista de ida',
          required: true,
        },
        {
          id: 20,
          type: 'text',
          label: 'Duração prevista da viagem',
          required: true,
          placeholder: 'Ex: 15 dias',
        },
        {
          id: 21,
          type: 'boolean',
          label: 'Tem hospedagem confirmada?',
          required: true,
        },
        {
          id: 22,
          type: 'text',
          label: 'Endereço da hospedagem',
          required: true,
          placeholder: 'Nome do hotel ou endereço',
          condition: {
            question_id: 21,
            value: true,
          },
        },
      ],
    },
  ],
}

// Mock Saved Answers
export const mockSavedAnswers: Record<number, string | boolean | number> = {
  1: 'João Silva',
  3: '1990-05-15',
  4: 'male',
  5: 'single',
  6: 'joao@email.com',
  7: '(11) 98765-4321',
}

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    type: 'passport',
    fileName: 'passaporte.pdf',
    fileUrl: '/uploads/passaporte.pdf',
    uploadedAt: '2024-01-18T10:00:00Z',
    status: 'approved',
  },
]

// Mock Admin Applications
export const mockAdminApplications: AdminApplication[] = [
  {
    id: 'app-1',
    userId: '1',
    userName: 'João Silva',
    userEmail: 'joao@email.com',
    status: 'in_progress',
    progress: 35,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'app-2',
    userId: '3',
    userName: 'Maria Santos',
    userEmail: 'maria@email.com',
    status: 'completed',
    progress: 100,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
  },
  {
    id: 'app-3',
    userId: '4',
    userName: 'Pedro Oliveira',
    userEmail: 'pedro@email.com',
    status: 'in_progress',
    progress: 60,
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-18T13:00:00Z',
  },
  {
    id: 'app-4',
    userId: '5',
    userName: 'Ana Costa',
    userEmail: 'ana@email.com',
    status: 'submitted',
    progress: 100,
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
]

// Mock Application Detail
export const mockApplicationDetail: ApplicationDetail = {
  id: 'app-1',
  user: mockUsers[0],
  status: 'in_progress',
  progress: 35,
  sections: [
    {
      title: 'Dados Pessoais',
      answers: [
        { question: 'Nome completo', value: 'João Silva' },
        { question: 'Data de nascimento', value: '15/05/1990' },
        { question: 'Gênero', value: 'Masculino' },
        { question: 'Estado civil', value: 'Solteiro' },
      ],
    },
    {
      title: 'Informações de Contato',
      answers: [
        { question: 'Email', value: 'joao@email.com' },
        { question: 'Telefone', value: '(11) 98765-4321' },
      ],
    },
  ],
  documents: mockDocuments,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
}
