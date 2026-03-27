'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useDocuments, useUploadDocument, useDeleteDocument } from '@/hooks/api'
import { DocumentCard } from '@/components/documents/document-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import type { DocumentType } from '@/types'

const documentTypes: { type: DocumentType; title: string; description: string }[] = [
  {
    type: 'passport',
    title: 'Passaporte',
    description: 'Página de identificação do passaporte válido',
  },
  {
    type: 'photo',
    title: 'Foto 5x7',
    description: 'Foto recente com fundo branco (formato para visto)',
  },
  {
    type: 'additional',
    title: 'Documento Adicional',
    description: 'Comprovantes de vínculo, renda ou outros documentos',
  },
]

export default function DocumentsPage() {
  const { data: documents, isLoading } = useDocuments()
  const uploadDocument = useUploadDocument()
  const deleteDocument = useDeleteDocument()

  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleUpload = async (type: DocumentType, file: File) => {
    // Validação de tamanho
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 5MB.')
      return
    }

    // Validação de tipo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido. Use PDF, JPG ou PNG.')
      return
    }

    setUploadingType(type)
    try {
      await uploadDocument.mutateAsync({ type, file })
      toast.success('Documento enviado com sucesso!')
    } catch {
      toast.error('Erro ao enviar documento')
    } finally {
      setUploadingType(null)
    }
  }

  const handleDelete = async (documentId: number) => {
    setDeletingId(documentId)
    try {
      await deleteDocument.mutateAsync(documentId)
      toast.success('Documento removido')
    } catch {
      toast.error('Erro ao remover documento')
    } finally {
      setDeletingId(null)
    }
  }

  const getDocumentByType = (type: DocumentType) => {
    return documents?.find(d => d.type === type)
  }

  const allDocumentsUploaded = documentTypes.every(
    ({ type }) => getDocumentByType(type)
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Upload de Documentos</h1>
        <p className="mt-1 text-muted-foreground">
          Envie os documentos necessários para sua solicitação de visto
        </p>
      </div>

      {/* Document Cards */}
      <div className="grid gap-4">
        {documentTypes.map(({ type, title, description }) => (
          <DocumentCard
            key={type}
            type={type}
            title={title}
            description={description}
            document={getDocumentByType(type)}
            onUpload={(file) => handleUpload(type, file)}
            onDelete={async () => {
              const doc = getDocumentByType(type)
              if (doc) await handleDelete(doc.id)
            }}
            isUploading={uploadingType === type}
            isDeleting={deletingId === getDocumentByType(type)?.id}
          />
        ))}
      </div>

      {/* Success Message */}
      {allDocumentsUploaded && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center gap-4 py-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Todos os documentos enviados!</h3>
              <p className="text-sm text-green-700">
                Você pode voltar ao dashboard para revisar ou enviar sua aplicação.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="lg"
          className="gap-2 rounded-xl"
          asChild
        >
          <Link href="/form">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao formulário
          </Link>
        </Button>

        <Button
          size="lg"
          className="gap-2 rounded-xl"
          asChild
        >
          <Link href="/dashboard">
            Ir para Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
