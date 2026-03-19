'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Option {
  label: string
  value: string
}

interface FormSelectProps {
  id: string
  label: string
  options: Option[]
  placeholder?: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  error?: string
  className?: string
}

export function FormSelect({
  id,
  label,
  options,
  placeholder = 'Selecione uma opção',
  required,
  value,
  onChange,
  error,
  className,
}: FormSelectProps) {
  const selectId = `field-${id}`

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={selectId} className="text-base">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={selectId}
          className={cn(
            'h-12 rounded-xl text-base',
            error && 'border-destructive focus:ring-destructive',
            !value && 'text-muted-foreground'
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
