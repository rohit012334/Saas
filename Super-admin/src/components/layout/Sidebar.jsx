import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Key,
  Users,
  Megaphone,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Headphones,
  HelpCircle,
  FileLock,
  ScrollText,
  FileCode,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '../../store/useAuthStore'
import { LanguageToggle } from '../shared/LanguageToggle'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/super-admin/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  {
    key: 'tenantManagement',
    icon: Building2,
    permission: 'tenants',
    children: [
      { path: '/super-admin/tenants', key: 'allTenants' },
      { path: '/super-admin/tenants/create', key: 'addNewTenant' },
      { path: '/super-admin/customers', key: 'customers' },
    ],
  },
  {
    key: 'subscriptions',
    icon: CreditCard,
    permission: 'subs',
    children: [
      { path: '/super-admin/subscriptions', key: 'plans' },
      { path: '/super-admin/subscriptions/payments', key: 'paymentHistory' },
      { path: '/super-admin/subscriptions/requests', key: 'subscriptionRequests' },
    ],
  },
  { path: '/super-admin/banners', icon: ImageIcon, key: 'banners', permission: 'banners' },
  { path: '/super-admin/users', icon: Users, key: 'adminUsers', role: 'SUPER_ADMIN' },
  { path: '/super-admin/announcements', icon: Megaphone, key: 'announcements', permission: 'announcements' },
  { path: '/super-admin/support', icon: Headphones, key: 'support', permission: 'support' },
  {
    key: 'cms',
    icon: FileCode,
    permission: 'cms',
    children: [
      { path: '/super-admin/faq', key: 'faq' },
      { path: '/super-admin/terms', key: 'terms' },
      { path: '/super-admin/privacy', key: 'privacy' },
    ]
  },
]

export function Sidebar() {
  const { t, i18n } = useTranslation('sidebar')
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const admin = useAuthStore((s) => s.admin)
  const [collapsed, setCollapsed] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const isRtl = i18n.dir() === 'rtl'

  const hasPermission = (item) => {
    // 1. If admin is absolute SUPER_ADMIN, they see everything
    if (admin?.role === 'SUPER_ADMIN') return true

    // 2. If it's the dashboard, everyone sees it (or add more logic)
    if (item.key === 'dashboard') return true
    
    // 3. Check specific permission
    if (item.permission && admin?.permissions?.includes(item.permission)) return true

    // 4. Default to false if restricted
    return false
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const width = collapsed ? 72 : 260
  const borderSide = isRtl ? 'border-r' : 'border-l'

  return (
    <aside
      className={`flex shrink-0 flex-col border-border/50 bg-surface transition-all duration-200 ${borderSide}`}
      style={{ width: `${width}px` }}
    >
      {/* Logo / collapse */}
      <div className="flex h-16 items-center justify-between gap-2 border-b border-border/50 px-4">
        {!collapsed && (
          <span className="truncate text-sm font-bold tracking-tight text-text">{t('adminTitle')}</span>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand' : 'Collapse'}
          className="rounded-lg"
        >
          {collapsed ? (isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />) : isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.filter(hasPermission).map((item) => {

          if (item.path) {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-primary/10 text-primary ' + (isRtl ? 'border-r-2 border-primary pr-3 pl-3' : 'border-l-2 border-primary pl-[14px] pr-3')
                    : 'px-3 text-text-secondary hover:bg-white/5 hover:text-text'
                  } ${collapsed ? 'justify-center px-3' : ''} ${isRtl ? 'flex-row-reverse' : ''}`
                }
              >
                <Icon className="h-5 w-5 shrink-0 opacity-90" />
                {!collapsed && <span>{t(item.key)}</span>}
              </NavLink>
            )
          }
          const Icon = item.icon
          const open = openSubmenu === item.key
          return (
            <div key={item.key}>
              <button
                type="button"
                onClick={() => setOpenSubmenu((k) => (k === item.key ? null : item.key))}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-all hover:bg-white/5 hover:text-text ${collapsed ? 'justify-center' : ''
                  } ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <Icon className="h-5 w-5 shrink-0 opacity-90" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-start">{t(item.key)}</span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''} ${isRtl ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
              {!collapsed && open && (
                <div className={`mt-1 space-y-0.5 ${isRtl ? 'mr-6 border-r border-border/50 pr-3' : 'ml-6 border-l border-border/50 pl-3'}`}>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      end
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text'
                        }`
                      }
                    >
                      {t(child.key)}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* <div className={`mt-auto border-t border-border/50 p-4 ${collapsed ? 'flex flex-col items-center gap-4' : 'space-y-4'}`}>
        <div className={cn(
          "flex items-center gap-3 rounded-xl bg-muted/40 p-2.5",
          collapsed && "justify-center"
        )}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-text leading-tight">{admin?.name || t('adminTitle')}</p>
              <p className="truncate text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{admin?.role || t('superAdminRole')}</p>
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          className={cn(
            "w-full flex items-center gap-3 rounded-xl py-2.5 text-text-secondary transition-all hover:bg-destructive/10 hover:text-destructive",
            collapsed ? "justify-center px-0" : "px-4"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="text-sm font-semibold tracking-wide">{t('logout')}</span>}
        </Button>
      </div> */}
    </aside>
  )
}
