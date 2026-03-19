'use client'

import { useQuery } from '@tanstack/react-query'
import { applicationService } from '@/services/applications'
import type { ApplicationStatus } from '@/types'

// Query Keys
export const adminKeys = {
  all: ['admin'] as const,
  applications: (status?: ApplicationStatus) => 
    [...adminKeys.all, 'applications', status] as const,
  detail: (id: string) => [...adminKeys.all, 'detail', id] as const,
}

// Hook para listar aplicações (admin)
export function useAdminApplications(status?: ApplicationStatus) {
  return useQuery({
    queryKey: adminKeys.applications(status),
    queryFn: () => applicationService.getAdminApplications(status),
    staleTime: 1000 * 30, // 30 segundos
  })
}

// Hook para buscar detalhe de uma aplicação (admin)
export function useApplicationDetail(id: string) {
  return useQuery({
    queryKey: adminKeys.detail(id),
    queryFn: () => applicationService.getApplicationDetail(id),
    staleTime: 1000 * 60, // 1 minuto
    enabled: !!id,
  })
}
