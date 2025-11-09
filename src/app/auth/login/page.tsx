'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/auth/AuthForm'
import Link from 'next/link'
import { Github, Chrome } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | string[]>('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (data: Record<string, string>) => {
    setError('')
    setIsLoading(true)

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
        setError('Email o contraseña incorrectos')
        setIsLoading(false)
        return
    }

    router.push('/dashboard')
  }

  return (
    <AuthForm
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para continuar aprendiendo"
      fields={[
        { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'juan@ejemplo.com' },
        { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Tu contraseña' },
      ]}
      buttonText="Iniciar sesión"
      onSubmit={handleLogin}
      error={error}
      isLoading={isLoading}
      footer={
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Chrome className="w-5 h-5" />
              Google
            </button>
            <button
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Github className="w-5 h-5" />
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" className="text-purple-600 font-medium hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      }
    />
  )
}