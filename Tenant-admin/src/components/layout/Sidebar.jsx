import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Settings, Wrench, Search, Package,
  Truck, Users, UserCog, Users2, CreditCard, PieChart,
  LogOut, ChevronRight, ChevronLeft, Menu
} from 'lucide-react';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useRoleStore } from '@/store/useRoleStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTenantStore } from '@/store/useTenantStore';
import { clsx } from 'clsx';
import { garageInfo } from '@/data/dummyData';

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const { isExpanded, toggleSidebar } = useSidebarStore();
  const { user } = useAuthStore();
  const { settings } = useTenantStore();
  const permissions = user?.permissions || [];
  const hasFullAccess = permissions.includes('full_access');
  const isRTL = i18n.dir() === 'rtl';

  const menuItems = [
    { icon: LayoutDashboard, label: t('sidebar:dashboard'), path: '/dashboard', permission: 'dashboard' },
    { icon: Wrench, label: t('sidebar:repairOrders'), path: '/repair-orders', permission: 'repair_orders' },
    { icon: Search, label: t('sidebar:diagnostics'), path: '/diagnostics', permission: 'diagnostics' },
    { icon: Package, label: t('sidebar:inventory'), path: '/inventory', permission: 'inventory' },
    { icon: Search, label: t('sidebar:partsSourcing'), path: '/parts-sourcing', permission: 'parts_sourcing' },
    { icon: Truck, label: t('sidebar:fleetManagement'), path: '/fleet', permission: 'fleet' },
    { icon: Users2, label: t('sidebar:hrManagement'), path: '/hr', permission: 'hr' },
    { icon: Users, label: t('sidebar:customers'), path: '/customers', permission: 'customers' },
    { icon: Wrench, label: t('sidebar:services'), path: '/services', permission: 'services' },
    { icon: PieChart, label: t('sidebar:reports'), path: '/reports', permission: 'reports' },
    { icon: CreditCard, label: t('sidebar:subscriptionHistory'), path: '/billing/subscription-history', permission: 'billing' },
    { icon: Settings, label: t('sidebar:settings'), path: '/settings', permission: 'settings' },
  ];

  const filteredMenu = menuItems.filter(item =>
    hasFullAccess || permissions.includes(item.permission)
  );

  return (
    <aside className={clsx(
      "fixed top-0 bottom-0 z-50 bg-surface border-border transition-all duration-300 flex flex-col shadow-xl",
      isRTL ? "right-0 border-l" : "left-0 border-r",
      isExpanded ? "w-[260px]" : "w-[72px]"
    )}>
      {/* Logo & Garage Info */}
      <div className="h-20 flex items-center px-4 border-b border-border overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shrink-0 overflow-hidden">
            {settings.garageLogoUrl ? (
                <img src={settings.garageLogoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
                settings.garageName?.charAt(0) || 'G'
            )}
          </div>
          {isExpanded && (
            <div className="flex flex-col">
              <span className="font-bold text-white leading-tight">{settings.garageName || garageInfo.name}</span>
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded w-fit mt-1 uppercase font-bold tracking-wider">
                {garageInfo.plan}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-6 overflow-y-auto no-scrollbar px-3 space-y-1">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-smooth group",
              isActive ? "bg-primary/10 text-primary" : "text-muted hover:text-white hover:bg-white/5",
              !isExpanded && "justify-center"
            )}
          >
            <item.icon size={22} className={clsx("shrink-0", !isExpanded && "mx-auto")} />
            {isExpanded && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile */}
      <div className="p-4 border-t border-border overflow-hidden">
        <div className={clsx("flex items-center gap-3", !isExpanded && "justify-center")}>
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}`}
            alt="user"
            className="w-10 h-10 rounded-full border border-border"
          />
          {isExpanded && (
            <div className="flex-1 truncate">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-muted truncate">{user?.role?.replace('_', ' ') || 'Staff'}</p>
            </div>
          )}
        </div>

        {isExpanded && (
          <button
            onClick={() => useAuthStore.getState().logout()}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-smooth text-sm font-medium"
          >
            <LogOut size={18} />
            <span>{t('sidebar:logout')}</span>
          </button>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={clsx(
          "absolute -right-3 top-24 w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-white transition-smooth z-50",
          isRTL && "-left-3 right-auto rotate-180"
        )}
      >
        {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;
