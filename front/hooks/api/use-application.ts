'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationService } from '@/services/applications'
import type { SaveAnswerPayload } from '@/types'

// Query Keys
export const applicationKeys = {
  all: ['application'] as const,
  current: () => [...applicationKeys.all, 'current'] as const,
  form: () => [...applicationKeys.all, 'form'] as const,
  answers: () => [...applicationKeys.all, 'answers'] as const,
  documents: () => [...applicationKeys.all, 'documents'] as const,
}

// Hook para buscar aplicação atual
export function useCurrentApplication() {
  return useQuery({
    queryKey: applicationKeys.current(),
    queryFn: () => applicationService.getCurrentApplication(),
    staleTime: 1000 * 60, // 1 minuto
  })
}

// Hook para buscar estrutura do formulário
export function useFormStructure() {
  return useQuery({
    queryKey: applicationKeys.form(),
    queryFn: () => applicationService.getFormStructure(),
    staleTime: 1000 * 60 * 5, // 5 minutos (estrutura muda pouco)
  })
}

// Hook para buscar respostas salvas
export function useSavedAnswers() {
  return useQuery({
    queryKey: applicationKeys.answers(),
    queryFn: () => applicationService.getSavedAnswers(),
    staleTime: 1000 * 30, // 30 segundos
  })
}

// Hook para salvar resposta (com debounce no componente)
export function useSaveAnswer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SaveAnswerPayload) => 
      applicationService.saveAnswer(payload),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: applicationKeys.answers() })
      queryClient.invalidateQueries({ queryKey: applicationKeys.current() })
    },
  })
}

// Hook para submeter aplicação
export function useSubmitApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => applicationService.submitApplication(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.current() })
    },
  })
}

// Hook para buscar documentos
export function useDocuments() {
  return useQuery({
    queryKey: applicationKeys.documents(),
    queryFn: () => applicationService.getDocuments(),
    staleTime: 1000 * 60, // 1 minuto
  })
}

// Hook para upload de documento
export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ type, file }: { type: 'passport' | 'photo' | 'additional'; file: File }) =>
      applicationService.uploadDocument(type, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.documents() })
    },
  })
}

// Hook para deletar documento
export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (documentId: string) => 
      applicationService.deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.documents() })
    },
  })
}
