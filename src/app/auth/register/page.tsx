'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/auth/AuthForm'
import Link from 'next/link'

export default function RegisterPage() {
  const [error, setError] = useState<string | string[]>('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (data: Record<string, string>) => {
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const responseAPI = await res.json()

      if (!res.ok) {
        setError(responseAPI.message || 'Error en el registro')
        setIsLoading(false)
        return
      }

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Registro exitoso, pero no se pudo iniciar sesión')
        setIsLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
      setIsLoading(false)
    }
  }

  return (
    <AuthForm
      title="Crear cuenta"
      subtitle="Únete a miles de estudiantes"
      fields={[
        { name: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Juan Pérez' },
        { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'juan@ejemplo.com' },
        { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Mínimo 6 caracteres' },
      ]}
      buttonText="Registrarse gratis"
      onSubmit={handleRegister}
      error={error}
      isLoading={isLoading}
      footer={
        <div className="text-center text-sm text-gray-600">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-purple-600 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      }
    />
  )
}