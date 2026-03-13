import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

const TenantLayout = () => {
  const { isExpanded } = useSidebarStore();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-x-hidden">
      <Sidebar />

      <main className={clsx(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        isRTL
          ? (isExpanded ? "mr-[260px]" : "mr-[72px]")
          : (isExpanded ? "ml-[260px]" : "ml-[72px]")
      )}>
        <Topbar />

        <div className="flex-1 p-8 overflow-y-auto overflow-x-hidden">
          <React.Suspense fallback={
            <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
               <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
               </div>
               <p className="text-muted text-sm font-bold tracking-widest uppercase">Loading {t(`sidebar:${location.pathname.split('/')[1]}` || 'Content')}...</p>
            </div>
          }>
            <Outlet />
          </React.Suspense>
        </div>

        {/* Footer */}
        <footer className="p-8 border-t border-border mt-auto">
          <div className="flex justify-between items-center text-muted text-xs">
            <p>© 2026 GMS Tenant Panel. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary">Support</a>
              <a href="#" className="hover:text-primary">Privacy</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default TenantLayout;
