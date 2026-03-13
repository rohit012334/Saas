import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from './locales/en/common.json';
import sidebarEn from './locales/en/sidebar.json';
import dashboardEn from './locales/en/dashboard.json';
import repairOrdersEn from './locales/en/repairOrders.json';
import diagnosticsEn from './locales/en/diagnostics.json';
import inventoryEn from './locales/en/inventory.json';
import fleetEn from './locales/en/fleet.json';
import hrEn from './locales/en/hr.json';
import customersEn from './locales/en/customers.json';
import billingEn from './locales/en/billing.json';
import reportsEn from './locales/en/reports.json';

import sidebarAr from './locales/ar/sidebar.json';
import commonAr from './locales/ar/common.json';
import repairOrdersAr from './locales/ar/repairOrders.json';
import dashboardAr from './locales/ar/dashboard.json';
import inventoryAr from './locales/ar/inventory.json';
import hrAr from './locales/ar/hr.json';
import diagnosticsAr from './locales/ar/diagnostics.json';
import customersAr from './locales/ar/customers.json';
import billingAr from './locales/ar/billing.json';
import fleetAr from './locales/ar/fleet.json';
import reportsAr from './locales/ar/reports.json';
import servicesEn from './locales/en/services.json';
import servicesAr from './locales/ar/services.json';
import authEn from './locales/en/auth.json';
import authAr from './locales/ar/auth.json';
import settingsEn from './locales/en/settings.json';
import settingsAr from './locales/ar/settings.json';
import partsSourcingEn from './locales/en/partsSourcing.json';
import partsSourcingAr from './locales/ar/partsSourcing.json';

// Use English as fallback for missing keys to keep it fast
const resources = {
  en: {
    common: commonEn,
    sidebar: sidebarEn,
    dashboard: dashboardEn,
    repairOrders: repairOrdersEn,
    diagnostics: diagnosticsEn,
    inventory: inventoryEn,
    fleet: fleetEn,
    hr: hrEn,
    customers: customersEn,
    billing: billingEn,
    reports: reportsEn,
    services: servicesEn,
    auth: authEn,
    settings: settingsEn,
    partsSourcing: partsSourcingEn,
  },
  ar: {
    common: commonAr,
    sidebar: sidebarAr,
    dashboard: dashboardAr,
    repairOrders: repairOrdersAr,
    diagnostics: diagnosticsAr,
    inventory: inventoryAr,
    fleet: fleetAr,
    hr: hrAr,
    customers: customersAr,
    billing: billingAr,
    reports: reportsAr,
    services: servicesAr,
    auth: authAr,
    settings: settingsAr,
    partsSourcing: partsSourcingAr,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('gms-language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    ns: [
      'common', 'sidebar', 'dashboard', 'repairOrders', 
      'diagnostics', 'inventory', 'fleet', 'hr', 
      'customers', 'billing', 'reports', 'services', 'auth', 'settings', 'partsSourcing'
    ],
    defaultNS: 'common',
  });

export default i18n;
