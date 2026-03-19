'use client'

import { use } from 'react'
import Link from 'next/link'
import { useApplicationDetail } from '@/hooks/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { 
  ArrowLeft, 
  Loader2, 
  Download,
  User,
  Mail,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/types'

const statusConfig: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  in_progress: {
    label: 'Em andamento',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  completed: {
    label: 'Completo',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  submitted: {
    label: 'Enviado',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
}

const documentStatusConfig = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-amber-600',
  },
  approved: {
    label: 'Aprovado',
    icon: CheckCircle2,
    color: 'text-green-600',
  },
  rejected: {
    label: 'Rejeitado',
    icon: XCircle,
    color: 'text-red-600',
  },
}

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: application, isLoading, error } = useApplicationDetail(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="space-y-6">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Aplicação não encontrada</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusInfo = statusConfig[application.status]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link 
            href="/admin" 
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Detalhes da Aplicação
          </h1>
        </div>
        <span className={cn(
          'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium',
          statusInfo.bgColor,
          statusInfo.color
        )}>
          {statusInfo.label}
        </span>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium text-foreground">{application.user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{application.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Criado em</p>
                <p className="font-medium text-foreground">
                  {new Date(application.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progresso</p>
                <p className="font-medium text-foreground">{application.progress}%</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <ProgressBar value={application.progress} size="md" />
          </div>
        </CardContent>
      </Card>

      {/* Answers by Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Respostas do Formulário</h2>
        
        {application.sections.length > 0 ? (
          application.sections.map((section, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {section.answers.map((answer, answerIndex) => (
                    <div 
                      key={answerIndex} 
                      className="flex items-start justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <span className="text-muted-foreground">{answer.question}</span>
                      <span className="ml-4 font-medium text-foreground text-right">
                        {typeof answer.value === 'boolean' 
                          ? (answer.value ? 'Sim' : 'Não')
                          : answer.value || '-'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Nenhuma resposta registrada ainda</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Documents */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Documentos Anexados</h2>
        
        {application.documents.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {application.documents.map((doc) => {
              const docStatus = documentStatusConfig[doc.status]
              const StatusIcon = docStatus.icon

              return (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doc.fileName}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {doc.type === 'passport' ? 'Passaporte' : 
                             doc.type === 'photo' ? 'Foto' : 'Adicional'}
                          </p>
                        </div>
                      </div>
                      <div className={cn('flex items-center gap-1', docStatus.color)}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">{docStatus.label}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={doc.fileUrl} download>
                          <Download className="mr-1 h-4 w-4" />
                          Baixar
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Nenhum documento anexado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
