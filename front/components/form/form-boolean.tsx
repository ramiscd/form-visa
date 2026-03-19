'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

interface FormBooleanProps {
  id: string
  label: string
  required?: boolean
  value: boolean | undefined
  onChange: (value: boolean) => void
  error?: string
  className?: string
}

export function FormBoolean({
  id,
  label,
  required,
  value,
  onChange,
  error,
  className,
}: FormBooleanProps) {
  const groupId = `field-${id}`

  return (
    <div className={cn('space-y-3', className)}>
      <Label className="text-base">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      
      <RadioGroup
        value={value === undefined ? undefined : value ? 'yes' : 'no'}
        onValueChange={(val) => onChange(val === 'yes')}
        className="flex gap-4"
      >
        <div className="flex items-center">
          <RadioGroupItem 
            value="yes" 
            id={`${groupId}-yes`} 
            className="peer sr-only" 
          />
          <Label
            htmlFor={`${groupId}-yes`}
            className={cn(
              'cursor-pointer rounded-xl border-2 px-6 py-3 text-base font-medium transition-all',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
              value === true
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground hover:border-primary/50'
            )}
          >
            Sim
          </Label>
        </div>
        
        <div className="flex items-center">
          <RadioGroupItem 
            value="no" 
            id={`${groupId}-no`} 
            className="peer sr-only" 
          />
          <Label
            htmlFor={`${groupId}-no`}
            className={cn(
              'cursor-pointer rounded-xl border-2 px-6 py-3 text-base font-medium transition-all',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
              value === false
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground hover:border-primary/50'
            )}
          >
            Não
          </Label>
        </div>
      </RadioGroup>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
