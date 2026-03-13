import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Globe, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useRoleStore } from '@/store/useRoleStore';
import LanguageToggle from '@/components/shared/LanguageToggle';
import { clsx } from 'clsx';

const Topbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { role, setRole } = useRoleStore();
  const isRTL = i18n.dir() === 'rtl';

  const roles = ['Tenant Admin', 'Manager', 'Receptionist', 'Mechanic'];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    return t(`sidebar:${path}`) || t('sidebar:dashboard');
  };

  return (
    <header dir={isRTL ? 'rtl' : 'ltr'} className="h-20 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-3 bg-surface/50 border border-border px-4 py-2 rounded-xl w-96 focus-within:border-primary transition-smooth">
        <Search size={18} className="text-muted" />
        <input
          type="text"
          placeholder={t('common:search')}
          className="bg-transparent border-none outline-none text-sm text-white w-full"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Role Switcher (For Testing) */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-surface/80 transition-smooth">
            <span className="text-muted">{t('common:role')}:</span>
            <span className="text-white">{role}</span>
            <ChevronDown size={14} className="text-muted" />
          </button>
          <div className={clsx("absolute top-full mt-2 w-48 min-w-max bg-surface border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth z-50 overflow-hidden", isRTL ? "left-0" : "right-0")}>
            {roles.map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={clsx(
                  "w-full text-left px-4 py-2.5 text-sm hover:bg-primary/10 transition-smooth",
                  role === r ? "text-primary bg-primary/5" : "text-muted hover:text-white"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Language Toggle */}
        <LanguageToggle className="scale-90" />

        {/* Notifications */}
        {/* <button className="relative p-2 text-muted hover:text-white transition-smooth bg-surface/50 border border-border rounded-lg">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-destructive text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-background">
            6
          </span>
        </button> */}

        {/* User Profile */}
        <div className={clsx("flex items-center gap-3 h-8 relative group", isRTL ? "pr-6 border-r border-border" : "pl-6 border-l border-border")}>
          <div className="w-9 h-9 rounded-full bg-surface border border-border p-0.5 cursor-pointer hover:border-primary transition-smooth">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              alt="avatar"
              className="w-full h-full rounded-full"
            />
          </div>

          <div className={clsx("absolute top-full mt-2 w-56 min-w-max bg-surface border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth z-50 overflow-hidden", isRTL ? "left-0" : "right-0")}>
            <div className="p-4 border-b border-border bg-white/5">
              <p className="text-sm font-bold text-white">Rajesh Sharma</p>
              <p className="text-[10px] text-muted">Tenant Admin</p>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted hover:text-white hover:bg-white/5 rounded-lg transition-smooth">
                <User size={16} />
                {t('common:myProfile')}
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted hover:text-white hover:bg-white/5 rounded-lg transition-smooth">
                <Settings size={16} />
                {t('common:settings')}
              </button>
              <div className="h-px bg-border my-2"></div>
              <button 
                onClick={() => useAuthStore.getState().logout()}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-smooth"
              >
                <LogOut size={16} />
                {t('common:logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
