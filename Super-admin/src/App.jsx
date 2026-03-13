import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from './store/useAuthStore'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { Dashboard } from './pages/super-admin/Dashboard'
import { TenantList } from './pages/super-admin/tenants/TenantList'
import { TenantDetail } from './pages/super-admin/tenants/TenantDetail'
import { TenantCreate } from './pages/super-admin/tenants/TenantCreate'
import { Plans } from './pages/super-admin/subscriptions/Plans'
import { PaymentHistory } from './pages/super-admin/subscriptions/PaymentHistory'
import { Banners } from './pages/super-admin/Banners'
import { Support } from './pages/super-admin/Support'
import { CustomerList } from './pages/super-admin/users/CustomerList'
import { AdminUsers } from './pages/super-admin/AdminUsers'
import { Announcements } from './pages/super-admin/Announcements'
import { AuditLogs } from './pages/super-admin/AuditLogs'
import { PlatformSettings } from './pages/super-admin/PlatformSettings'
import { FAQList } from './pages/super-admin/cms/FAQList'
import { PrivacyPolicy } from './pages/super-admin/cms/PrivacyPolicy'
import { TermsConditions } from './pages/super-admin/cms/TermsConditions'

function ProtectedRoute({ children }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tenants" element={<TenantList />} />
        <Route path="tenants/create" element={<TenantCreate />} />
        <Route path="tenants/:id" element={<TenantDetail />} />
        <Route path="tenants/:id/edit" element={<TenantCreate />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="subscriptions" element={<Plans />} />
        <Route path="subscriptions/payments" element={<PaymentHistory />} />
        <Route path="banners" element={<Banners />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="support" element={<Support />} />
        <Route path="faq" element={<FAQList />} />
        <Route path="terms" element={<TermsConditions />} />
        <Route path="privacy" element={<PrivacyPolicy />} />

      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
