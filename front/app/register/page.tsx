'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email(),
  password: z.string().min(6),
  password_confirmation: z.string()
}).refine(data => data.password === data.password_confirmation, {
  message: 'Senhas não conferem',
  path: ['password_confirmation']
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    setLoading(true)

    try {
      await authService.register(data)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label>Nome</Label>
                <Input {...register('name')} />
                {errors.name && <p>{errors.name.message}</p>}
              </div>

              <div>
                <Label>Email</Label>
                <Input {...register('email')} />
                {errors.email && <p>{errors.email.message}</p>}
              </div>

              <div>
                <Label>Senha</Label>
                <Input type="password" {...register('password')} />
              </div>

              <div>
                <Label>Confirmar senha</Label>
                <Input type="password" {...register('password_confirmation')} />
                {errors.password_confirmation && (
                  <p>{errors.password_confirmation.message}</p>
                )}
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Cadastrar'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              Já tem conta? <Link href="/login">Entrar</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}