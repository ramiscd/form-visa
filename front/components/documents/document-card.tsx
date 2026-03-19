'use client'

import { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Upload, 
  FileText, 
  Image, 
  Trash2, 
  CheckCircle2,
  Clock,
  XCircle,
  Loader2 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Document, DocumentType } from '@/types'

interface DocumentCardProps {
  type: DocumentType
  title: string
  description: string
  document?: Document
  onUpload: (file: File) => Promise<void>
  onDelete: () => Promise<void>
  isUploading?: boolean
  isDeleting?: boolean
}

const documentIcons: Record<DocumentType, typeof FileText> = {
  passport: FileText,
  photo: Image,
  additional: FileText,
}

const statusConfig = {
  pending: {
    label: 'Pendente revisão',
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  approved: {
    label: 'Aprovado',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  rejected: {
    label: 'Rejeitado',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
}

export function DocumentCard({
  type,
  title,
  description,
  document,
  onUpload,
  onDelete,
  isUploading,
  isDeleting,
}: DocumentCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const Icon = documentIcons[type]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      await onUpload(file)
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUpload(file)
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const status = document?.status ? statusConfig[document.status] : null
  const StatusIcon = status?.icon

  return (
    <Card className={cn(
      'transition-all',
      dragActive && 'border-primary ring-2 ring-primary/20'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          
          {status && StatusIcon && (
            <div className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1', status.bgColor)}>
              <StatusIcon className={cn('h-3.5 w-3.5', status.color)} />
              <span className={cn('text-xs font-medium', status.color)}>
                {status.label}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {document ? (
          // Documento existente
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">{document.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  Enviado em {new Date(document.uploadedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          // Upload area
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            )}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
            />
            
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Enviando...</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  Arraste e solte seu arquivo aqui ou
                </p>
                <Button
                  variant="link"
                  className="mt-1 h-auto p-0 text-primary"
                  onClick={() => inputRef.current?.click()}
                >
                  clique para selecionar
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  PDF, JPG ou PNG (máx. 5MB)
                </p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
