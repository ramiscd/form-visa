'use client'

import type { Question } from '@/types'
import { FormInput } from './form-input'
import { FormSelect } from './form-select'
import { FormBoolean } from './form-boolean'

interface DynamicQuestionProps {
  question: Question
  value: string | boolean | number | undefined
  onChange: (value: string | boolean) => void
  error?: string
}

export function DynamicQuestion({
  question,
  value,
  onChange,
  error,
}: DynamicQuestionProps) {
  switch (question.type) {
    case 'text':
    case 'date':
    case 'textarea':
      return (
        <FormInput
          id={String(question.id)}
          label={question.label}
          type={question.type}
          placeholder={question.placeholder}
          required={question.required}
          value={String(value ?? '')}
          onChange={onChange}
          error={error}
        />
      )

    case 'select':
      return (
        <FormSelect
          id={String(question.id)}
          label={question.label}
          options={question.options || []}
          placeholder={question.placeholder}
          required={question.required}
          value={String(value ?? '')}
          onChange={onChange}
          error={error}
        />
      )

    case 'boolean':
      return (
        <FormBoolean
          id={String(question.id)}
          label={question.label}
          required={question.required}
          value={typeof value === 'boolean' ? value : undefined}
          onChange={onChange}
          error={error}
        />
      )

    default:
      return null
  }
}
