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
import { clsx } from 'clsx';
import { garageInfo } from '@/data/dummyData';

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const { isExpanded, toggleSidebar } = useSidebarStore();
  const { role } = useRoleStore();
  const isRTL = i18n.dir() === 'rtl';

  const menuItems = [
    { icon: LayoutDashboard, label: t('sidebar:dashboard'), path: '/dashboard', roles: ['All'] },
    { icon: Wrench, label: t('sidebar:repairOrders'), path: '/repair-orders', roles: ['All'] },
    { icon: Search, label: t('sidebar:diagnostics'), path: '/diagnostics', roles: ['Tenant Admin', 'Manager', 'Mechanic'] },
    { icon: Package, label: t('sidebar:inventory'), path: '/inventory', roles: ['Tenant Admin', 'Manager'] },
    { icon: Search, label: t('sidebar:partsSourcing'), path: '/parts-sourcing', roles: ['Tenant Admin', 'Manager'] },
    { icon: Truck, label: t('sidebar:fleetManagement'), path: '/fleet', roles: ['Tenant Admin', 'Manager'] },
    { icon: Users2, label: t('sidebar:hrManagement'), path: '/hr', roles: ['Tenant Admin', 'Manager'] },
    {icon: Users, label: t('sidebar:customers'), path: '/customers', roles: ['All'] },
    { icon: Wrench, label: t('sidebar:services'), path: '/services', roles: ['Tenant Admin', 'Manager'] },
    // { icon: CreditCard, label: t('sidebar:billing'), path: '/billing', roles: ['Tenant Admin', 'Manager'] },
    { icon: PieChart, label: t('sidebar:reports'), path: '/reports', roles: ['Tenant Admin', 'Manager'] },
    { icon: Settings, label: t('sidebar:settings'), path: '/settings', roles: ['Tenant Admin'] },
  ];

  const filteredMenu = menuItems.filter(item =>
    item.roles.includes('All') || item.roles.includes(role)
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
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shrink-0">
            G
          </div>
          {isExpanded && (
            <div className="flex flex-col">
              <span className="font-bold text-white leading-tight">{garageInfo.name}</span>
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
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${garageInfo.owner}`}
            alt="owner"
            className="w-10 h-10 rounded-full border border-border"
          />
          {isExpanded && (
            <div className="flex-1 truncate">
              <p className="text-sm font-semibold text-white truncate">{garageInfo.owner}</p>
              <p className="text-xs text-muted truncate">{role}</p>
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
