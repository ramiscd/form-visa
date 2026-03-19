'use client'

import Link from 'next/link'
import { useCurrentApplication } from '@/hooks/api'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { 
  FileText, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Loader2,
  AlertCircle 
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: application, isLoading, error } = useCurrentApplication()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-4 py-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-medium text-foreground">Erro ao carregar dados</p>
            <p className="text-sm text-muted-foreground">
              Não foi possível carregar sua aplicação. Tente novamente.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const statusConfig = {
    in_progress: {
      label: 'Em andamento',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    completed: {
      label: 'Completo',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    submitted: {
      label: 'Enviado',
      icon: CheckCircle2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  }

  const status = application?.status || 'in_progress'
  const StatusIcon = statusConfig[status].icon

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Olá, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Acompanhe o progresso do seu formulário DS-160
        </p>
      </div>

      {/* Status Card */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Formulário DS-160</CardTitle>
              <CardDescription>
                Solicitação de Visto Americano
              </CardDescription>
            </div>
            <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${statusConfig[status].bgColor}`}>
              <StatusIcon className={`h-4 w-4 ${statusConfig[status].color}`} />
              <span className={`text-sm font-medium ${statusConfig[status].color}`}>
                {statusConfig[status].label}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ProgressBar value={application?.progress || 0} size="lg" />
          
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="flex-1 gap-2 rounded-xl">
              <Link href="/form">
                <FileText className="h-5 w-5" />
                {application?.progress === 0 ? 'Começar formulário' : 'Continuar preenchimento'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="flex-1 gap-2 rounded-xl">
              <Link href="/documents">
                <Upload className="h-5 w-5" />
                Upload de documentos
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Preencher Formulário</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete todas as seções do formulário DS-160 com suas informações pessoais.
              </p>
              <Button asChild variant="link" className="mt-2 h-auto p-0 text-primary">
                <Link href="/form">
                  Continuar <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Enviar Documentos</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Faça upload do seu passaporte, foto e documentos adicionais necessários.
              </p>
              <Button asChild variant="link" className="mt-2 h-auto p-0 text-primary">
                <Link href="/documents">
                  Enviar <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Section */}
      {application?.progress === 100 && application?.status !== 'submitted' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Formulário completo!</h3>
                <p className="text-sm text-green-700">
                  Você pode enviar sua aplicação para análise.
                </p>
              </div>
            </div>
            <Button size="lg" className="rounded-xl bg-green-600 hover:bg-green-700">
              Enviar aplicação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
