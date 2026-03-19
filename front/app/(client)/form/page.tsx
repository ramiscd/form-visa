'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useFormStructure, useSavedAnswers, useSaveAnswer } from '@/hooks/api'
import { useDebouncedCallback } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Stepper } from '@/components/ui/stepper'
import { FormSection } from '@/components/ui/form-section'
import { DynamicQuestion } from '@/components/form/dynamic-question'
import { 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Save,
  CheckCircle2 
} from 'lucide-react'
import { toast } from 'sonner'
import type { Question } from '@/types'

export default function FormPage() {
  const { data: formStructure, isLoading: isLoadingForm } = useFormStructure()
  const { data: savedAnswers, isLoading: isLoadingAnswers } = useSavedAnswers()
  const saveAnswer = useSaveAnswer()

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | boolean | number>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Carregar respostas salvas
  useEffect(() => {
    if (savedAnswers) {
      setAnswers(savedAnswers)
    }
  }, [savedAnswers])

  const sections = formStructure?.sections || []
  const currentSection = sections[currentSectionIndex]
  const isFirstSection = currentSectionIndex === 0
  const isLastSection = currentSectionIndex === sections.length - 1

  // Steps para o Stepper
  const steps = useMemo(() => 
    sections.map((section) => ({
      id: section.id,
      title: section.title,
    })),
    [sections]
  )

  // Verificar se uma pergunta deve ser exibida baseado na condição
  const shouldShowQuestion = useCallback((question: Question): boolean => {
    if (!question.condition) return true
    
    const conditionValue = answers[question.condition.question_id]
    return conditionValue === question.condition.value
  }, [answers])

  // Debounced save
  const debouncedSave = useDebouncedCallback(
    useCallback(async (questionId: number, value: string | boolean | number) => {
      setIsSaving(true)
      try {
        await saveAnswer.mutateAsync({ questionId, value })
      } catch {
        toast.error('Erro ao salvar resposta')
      } finally {
        setIsSaving(false)
      }
    }, [saveAnswer]),
    500
  )

  // Handler de mudança de valor
  const handleAnswerChange = useCallback((questionId: number, value: string | boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    debouncedSave(questionId, value)
  }, [debouncedSave])

  // Navegação
  const goToPreviousSection = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToNextSection = () => {
    if (!isLastSection) {
      setCurrentSectionIndex(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToSection = (index: number) => {
    setCurrentSectionIndex(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoadingForm || isLoadingAnswers) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!formStructure || sections.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Formulário não encontrado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link 
            href="/dashboard" 
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Formulário DS-160</h1>
        </div>
        
        {/* Indicador de salvamento */}
        <div className="flex items-center gap-2 text-sm">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-muted-foreground">Salvando...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Salvo automaticamente</span>
            </>
          )}
        </div>
      </div>

      {/* Stepper */}
      <Stepper
        steps={steps}
        currentStep={currentSectionIndex}
        onStepClick={goToSection}
      />

      {/* Form Content */}
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <FormSection
            title={currentSection.title}
            description={currentSection.description}
          >
            <div className="space-y-6">
              {currentSection.questions.map((question) => {
                if (!shouldShowQuestion(question)) return null

                return (
                  <DynamicQuestion
                    key={question.id}
                    question={question}
                    value={answers[question.id]}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                  />
                )
              })}
            </div>
          </FormSection>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="lg"
          className="gap-2 rounded-xl"
          onClick={goToPreviousSection}
          disabled={isFirstSection}
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        <span className="text-sm text-muted-foreground">
          Seção {currentSectionIndex + 1} de {sections.length}
        </span>

        {isLastSection ? (
          <Button
            size="lg"
            className="gap-2 rounded-xl"
            asChild
          >
            <Link href="/documents">
              <CheckCircle2 className="h-4 w-4" />
              Continuar para documentos
            </Link>
          </Button>
        ) : (
          <Button
            size="lg"
            className="gap-2 rounded-xl"
            onClick={goToNextSection}
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
