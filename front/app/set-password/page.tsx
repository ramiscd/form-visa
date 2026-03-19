'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, Loader2, AlertCircle, Check } from 'lucide-react'

const setPasswordSchema = z.object({
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type SetPasswordForm = z.infer<typeof setPasswordSchema>

function SetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { setPassword } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SetPasswordForm>({
    resolver: zodResolver(setPasswordSchema),
  })

  const password = watch('password', '')

  const passwordRequirements = [
    { label: 'Mínimo 6 caracteres', valid: password.length >= 6 },
    { label: 'Pelo menos uma letra', valid: /[a-zA-Z]/.test(password) },
    { label: 'Pelo menos um número', valid: /[0-9]/.test(password) },
  ]

  const onSubmit = async (data: SetPasswordForm) => {
    if (!token) {
      setError('Token inválido. Solicite um novo link.')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      await setPassword(token, data.password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao definir senha')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Link inválido. Por favor, solicite um novo link de acesso.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <FileText className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">VisaForm</h1>
          <p className="mt-2 text-muted-foreground">
            Defina sua senha de acesso
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Criar senha</CardTitle>
            <CardDescription>
              Defina uma senha segura para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="h-12 rounded-xl"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="h-12 rounded-xl"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="space-y-2 rounded-xl bg-muted p-4">
                <p className="text-sm font-medium text-foreground">Requisitos da senha:</p>
                <ul className="space-y-1">
                  {passwordRequirements.map((req) => (
                    <li
                      key={req.label}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check
                        className={`h-4 w-4 ${
                          req.valid ? 'text-green-600' : 'text-muted-foreground'
                        }`}
                      />
                      <span className={req.valid ? 'text-green-600' : 'text-muted-foreground'}>
                        {req.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando senha...
                  </>
                ) : (
                  'Criar senha e entrar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SetPasswordContent />
    </Suspense>
  )
}
