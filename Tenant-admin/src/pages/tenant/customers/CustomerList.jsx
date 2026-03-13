import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserPlus, Star, Clock,
  Search, Plus, Eye, Edit2, MessageSquare,
  ShieldCheck, History
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { ExportButton } from '@/components/shared/ExportButton';
import { DateFilter } from '@/components/shared/DateFilter';
import { customers } from '@/data/dummyData';

const CustomerList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.vehicles.some(v => v.plate.toLowerCase().includes(searchQuery.toLowerCase()) || v.make?.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (dateFilter === 'all') return true;

      const lastVisitDate = new Date(c.lastVisit);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (dateFilter === 'today') return lastVisitDate >= today;
      if (dateFilter === 'yesterday') return lastVisitDate >= yesterday && lastVisitDate < today;

      if (dateFilter === '7days') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return lastVisitDate >= sevenDaysAgo;
      }

      if (dateFilter === '30days') {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return lastVisitDate >= thirtyDaysAgo;
      }

      return true;
    });
  }, [searchQuery, dateFilter]);

  const exportColumns = [
    { header: t('customers:name'), accessor: 'name' },
    { header: t('customers:phone'), accessor: 'phone' },
    { header: t('customers:vehicles'), accessor: (item) => item.vehicles.map(v => v.plate).join(', ') },
    { header: t('customers:lastVisit'), accessor: 'lastVisit' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('sidebar:customers')}
        breadcrumbs={['GMS', t('sidebar:customers')]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title={t('customers:totalCustomers')} value="450" icon={Users} color="blue" />
        <StatCard title={t('customers:newThisMonth')} value="24" icon={UserPlus} color="green" />
        <StatCard title={t('customers:active')} value="128" icon={Star} color="amber" />
      </div>

      <div className="surface-card">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                placeholder={t('customers:searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm w-64 outline-none focus:border-primary transition-smooth"
              />
            </div>
            <DateFilter onFilterChange={setDateFilter} />
            <ExportButton
              data={filteredCustomers}
              filename="customers"
              columns={exportColumns}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                <th className="p-4">{t('customers:customer')}</th>
                <th className="p-4">{t('customers:vehicles')}</th>
                <th className="p-4">{t('customers:lastVisit')}</th>
                <th className="p-4">{t('customers:serviceCount')}</th>
                <th className="p-4 text-right">{t('customers:actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-smooth group cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary font-bold">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{c.name}</p>
                        <p className="text-[10px] text-muted">{c.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {c.vehicles.map(v => (
                        <span key={v.plate} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                          {v.plate}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-muted text-xs">{c.lastVisit}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <History size={12} className="text-primary" />
                      <span className="text-xs font-bold text-white">{c.serviceCount} {t('customers:times')}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 transition-smooth">
                      <button 
                        className="p-1.5 text-muted hover:text-primary"
                        onClick={() => navigate(`/customers/${c.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-muted hover:text-warning"><Edit2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
