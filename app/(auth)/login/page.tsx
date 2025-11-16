'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { registerUser, loginUser, verifyEmail, sendVerificationCode } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [tempEmail, setTempEmail] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    fullName: '',
    username: '',
    verificationCode: ''
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (needsVerification) {
      const success = verifyEmail(tempEmail, formData.verificationCode)
      if (success) {
        toast({
          title: 'Verificación exitosa',
          description: 'Ahora puedes iniciar sesión',
        })
        setNeedsVerification(false)
        setIsLogin(true)
        setFormData({ ...formData, verificationCode: '' })
      } else {
        toast({
          title: 'Código incorrecto',
          description: 'Verifica el código e intenta nuevamente',
          variant: 'destructive'
        })
      }
      return
    }

    if (isLogin) {
      const success = loginUser(formData.email, formData.password)
      if (success) {
        toast({
          title: 'Bienvenido',
          description: 'Has iniciado sesión correctamente',
        })
        router.push('/')
      } else {
        toast({
          title: 'Error',
          description: 'Credenciales incorrectas o email no verificado',
          variant: 'destructive'
        })
      }
    } else {
      const result = registerUser({
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        fullName: formData.fullName,
        username: formData.username
      })

      if (result.success) {
        setTempEmail(formData.email)
        setNeedsVerification(true)
        toast({
          title: 'Registro exitoso',
          description: `Código de verificación: ${result.verificationCode}`,
        })
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 sm:gap-3">
            <div className="flex h-12 w-12 items-center justify-center bg-primary sm:h-16 sm:w-16">
              <span className="text-2xl font-light text-primary-foreground sm:text-3xl">E</span>
            </div>
          </Link>
          <h2 className="mt-4 text-2xl font-light tracking-tight text-foreground sm:mt-6 sm:text-3xl">
            {needsVerification ? 'Verificar Email' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            {needsVerification
              ? 'Ingresa el código enviado a tu email'
              : isLogin
                ? 'Accede a tu cuenta'
                : 'Regístrate para comenzar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {needsVerification ? (
            <div className="space-y-2">
              <Label htmlFor="code" className="font-light">Código de verificación</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={formData.verificationCode}
                onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                required
                className="font-light"
              />
            </div>
          ) : (
            <>
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-light">Nombre completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="font-light"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="font-light">Nombre de usuario</Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      className="font-light"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-light">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="font-light"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="font-light">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="font-light"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-light">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="font-light"
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full rounded-md bg-primary py-5 font-light text-primary-foreground hover:opacity-80 sm:py-6">
            {needsVerification ? 'Verificar' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </Button>
        </form>

        {!needsVerification && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-light text-muted-foreground hover:text-foreground"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-sm font-light text-muted-foreground hover:text-foreground">
            Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}

