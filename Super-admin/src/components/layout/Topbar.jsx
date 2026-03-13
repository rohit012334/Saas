import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Bell, User, LogOut, KeyRound, ChevronDown } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '../../store/useAuthStore'
import { LanguageToggle } from '../shared/LanguageToggle'

const routeTitles = {
  '/super-admin/dashboard': 'dashboard',
  '/super-admin/tenants': 'tenants',
  '/super-admin/tenants/create': 'tenants',
  '/super-admin/subscriptions': 'subscriptions',
  '/super-admin/subscriptions/payments': 'subscriptions',
  '/super-admin/api-management': 'apiManagement',
  '/super-admin/users': 'users',
  '/super-admin/announcements': 'announcements',
  '/super-admin/security': 'security',
  '/super-admin/settings': 'settings',
}

const nsByPath = {
  '/super-admin/dashboard': 'dashboard',
  '/super-admin/tenants': 'tenants',
  '/super-admin/tenants/create': 'tenants',
  '/super-admin/subscriptions': 'sidebar',
  '/super-admin/subscriptions/payments': 'subscriptions',
  '/super-admin/api-management': 'apiManagement',
  '/super-admin/users': 'users',
  '/super-admin/announcements': 'announcements',
  '/super-admin/security': 'security',
  '/super-admin/settings': 'settings',
}

export function Topbar() {
  const { t } = useTranslation('sidebar')
  const { t: tDashboard } = useTranslation('dashboard')
  const { t: tTenants } = useTranslation('tenants')
  const { t: tSub } = useTranslation('subscriptions')
  const { t: tApi } = useTranslation('apiManagement')
  const { t: tUsers } = useTranslation('users')
  const { t: tAnn } = useTranslation('announcements')
  const { t: tSec } = useTranslation('security')
  const { t: tSet } = useTranslation('settings')
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const admin = useAuthStore((s) => s.admin)
  const [searchFocused, setSearchFocused] = useState(false)

  const getTitle = () => {
    const path = location.pathname
    if (path.startsWith('/super-admin/tenants/') && path !== '/super-admin/tenants' && path !== '/super-admin/tenants/create') return tTenants('detailTitle')
    if (path === '/super-admin/subscriptions') return t('plans')
    if (path === '/super-admin/subscriptions/payments') return tSub('userSubscriptionsTitle')
    const key = routeTitles[path]
    if (!key) return 'GMS'
    const ns = nsByPath[path]
    if (ns === 'dashboard') return tDashboard('title')
    if (ns === 'tenants') return tTenants('listTitle')
    if (ns === 'subscriptions') return tSub('plansTitle')
    if (ns === 'apiManagement') return tApi('title')
    if (ns === 'users') return tUsers('title')
    if (ns === 'announcements') return tAnn('title')
    if (ns === 'security') return tSec('title')
    if (ns === 'settings') return tSet('title')
    return t(key)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/50 bg-surface/80 px-6 backdrop-blur-sm">
      <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight text-text" title={getTitle()}>
        {getTitle()}
      </h1>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div
          className={`flex w-full min-w-0 items-center gap-2 rounded-xl transition-all duration-200 sm:w-52 md:w-64 ${searchFocused ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : ''
            }`}
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('searchPlaceholder')}
            className="h-9 min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        <LanguageToggle />

        {/* <Button variant="ghost" size="icon" className="group relative rounded-full hover:bg-primary/5 active:scale-95" aria-label={t('notifications')}>
          <Bell className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
        </Button> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 p-0 hover:bg-transparent">
              <div className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 pl-1 pr-3 py-1 transition-all hover:border-primary/30 hover:bg-muted/50 hover:shadow-sm group">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-[13px] text-primary-foreground shadow-sm shadow-primary/20 transition-transform group-hover:scale-105">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden flex-col items-start leading-none md:flex">
                  <span className="text-xs font-bold text-text mb-0.5">{admin?.name || t('adminTitle')}</span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{admin?.role || t('superAdminRole')}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-y-0.5" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem>
              <User className="h-4 w-4" />
              {t('profile')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <KeyRound className="h-4 w-4" />
              {t('changePassword')}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
