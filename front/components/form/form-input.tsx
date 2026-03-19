'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormInputProps {
  id: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'textarea'
  placeholder?: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  error?: string
  className?: string
}

export function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  required,
  value,
  onChange,
  error,
  className,
}: FormInputProps) {
  const inputId = `field-${id}`
  const isTextarea = type === 'textarea'

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={inputId} className="text-base">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      
      {isTextarea ? (
        <Textarea
          id={inputId}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'min-h-24 resize-none rounded-xl text-base',
            error && 'border-destructive focus-visible:ring-destructive'
          )}
        />
      ) : (
        <Input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-12 rounded-xl text-base',
            error && 'border-destructive focus-visible:ring-destructive'
          )}
        />
      )}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
