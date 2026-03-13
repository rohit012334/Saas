import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from './locales/en/common.json'
import enSidebar from './locales/en/sidebar.json'
import enDashboard from './locales/en/dashboard.json'
import enTenants from './locales/en/tenants.json'
import enSubscriptions from './locales/en/subscriptions.json'
import enApiManagement from './locales/en/apiManagement.json'
import enUsers from './locales/en/users.json'
import enAnnouncements from './locales/en/announcements.json'
import enSecurity from './locales/en/security.json'
import enSettings from './locales/en/settings.json'
import enAuth from './locales/en/auth.json'
import enBanners from './locales/en/banners.json'
import enSupport from './locales/en/support.json'
import enCms from './locales/en/cms.json'
import enCustomers from './locales/en/customers.json'


import arCommon from './locales/ar/common.json'
import arSidebar from './locales/ar/sidebar.json'
import arDashboard from './locales/ar/dashboard.json'
import arTenants from './locales/ar/tenants.json'
import arSubscriptions from './locales/ar/subscriptions.json'
import arApiManagement from './locales/ar/apiManagement.json'
import arUsers from './locales/ar/users.json'
import arAnnouncements from './locales/ar/announcements.json'
import arSecurity from './locales/ar/security.json'
import arSettings from './locales/ar/settings.json'
import arAuth from './locales/ar/auth.json'
import arBanners from './locales/ar/banners.json'
import arSupport from './locales/ar/support.json'
import arCms from './locales/ar/cms.json'
import arCustomers from './locales/ar/customers.json'


const resources = {
  en: {
    common: enCommon,
    sidebar: enSidebar,
    dashboard: enDashboard,
    tenants: enTenants,
    subscriptions: enSubscriptions,
    apiManagement: enApiManagement,
    users: enUsers,
    announcements: enAnnouncements,
    security: enSecurity,
    settings: enSettings,
    auth: enAuth,
    banners: enBanners,
    support: enSupport,
    cms: enCms,
    customers: enCustomers,

  },
  ar: {
    common: arCommon,
    sidebar: arSidebar,
    dashboard: arDashboard,
    tenants: arTenants,
    subscriptions: arSubscriptions,
    apiManagement: arApiManagement,
    users: arUsers,
    announcements: arAnnouncements,
    security: arSecurity,
    settings: arSettings,
    auth: arAuth,
    banners: arBanners,
    support: arSupport,
    cms: arCms,
    customers: arCustomers,

  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: 'common',
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
