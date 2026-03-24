import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Wrench, BarChart3, Cpu, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { LanguageToggle } from '../../components/shared/LanguageToggle'
import { toast } from '../../utils/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

export function LoginPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (await login(email, password)) {
      toast.success('Welcome back!')
      navigate('/super-admin/dashboard', { replace: true })
    } else {
      toast.error(t('invalidCredentials'))
    }
  }


  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left: Branding */}
      <div className="hidden min-h-screen w-[52%] flex-col justify-between border-e border-border bg-gradient-to-br from-card via-card to-background p-12 lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-glow-sm">
              <Wrench className="h-7 w-7" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">GMS</span>
          </div>
          <p className="mt-16 max-w-sm text-2xl font-semibold leading-snug text-foreground xl:text-3xl">
            {t('tagline')}
          </p>
          <ul className="mt-12 space-y-4">
            {[
              { icon: Wrench, text: t('feature1') },
              { icon: BarChart3, text: t('feature2') },
              { icon: Cpu, text: t('feature3') },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-4 text-muted-foreground">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">© Garage Management System</p>
      </div>

      {/* Right: Login form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-[48%]">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center justify-between gap-4">
            <span className="rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary">
              {t('superAdminPortal')}
            </span>
            <LanguageToggle />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your admin account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('passwordPlaceholder')}
                  required
                  className="h-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-sm text-muted-foreground">{t('rememberMe')}</span>
              </label>
              <Button type="button" variant="link" className="text-sm">
                {t('forgotPassword')}
              </Button>
            </div>
            <Button type="submit" className="h-10 w-full" size="lg">
              {t('login')}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Demo: admin@gmail.com / Admin@123
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
