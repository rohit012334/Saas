import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CreditCard, CheckCircle, Clock, AlertTriangle,
  Search, Plus, Eye, Download, Send
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { ExportButton } from '@/components/shared/ExportButton';
import { DateFilter } from '@/components/shared/DateFilter';
import { invoices } from '@/data/dummyData';

const InvoiceList = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch =
        inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.vehicle.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (dateFilter === 'all') return true;

      const invoiceDate = new Date(inv.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (dateFilter === 'today') return invoiceDate >= today;
      if (dateFilter === 'yesterday') return invoiceDate >= yesterday && invoiceDate < today;

      if (dateFilter === '7days') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return invoiceDate >= sevenDaysAgo;
      }

      if (dateFilter === '30days') {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return invoiceDate >= thirtyDaysAgo;
      }

      return true;
    });
  }, [searchQuery, dateFilter]);

  const exportColumns = [
    { header: 'Invoice#', accessor: 'invoiceNo' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Vehicle', accessor: 'vehicle' },
    { header: 'Total', accessor: (item) => `$${item.total}` },
    { header: 'Date', accessor: 'date' },
    { header: 'Status', accessor: 'status' },
  ];

  return (
    <div className="space-y-6">
      {/* <PageHeader 
        title={t('sidebar:billing')} 
        breadcrumbs={['GMS', t('sidebar:billing')]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm shadow-lg shadow-primary/20">
            <Plus size={18} />
            {t('billing:createInvoice')}
          </button>
        }
      /> */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title={t('billing:totalInvoices')} value="1,240" icon={CreditCard} color="blue" />
        <StatCard title={t('billing:paid')} value="$12.4L" icon={CheckCircle} color="green" />
        <StatCard title={t('billing:pending')} value="$2.1L" icon={Clock} color="amber" />
        <StatCard title={t('billing:overdue')} value="$45K" icon={AlertTriangle} color="red" />
      </div>

      <div className="surface-card">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm w-64 outline-none focus:border-primary transition-smooth"
              />
            </div>
            <DateFilter onFilterChange={setDateFilter} />
            <ExportButton
              data={filteredInvoices}
              filename="invoices"
              columns={exportColumns}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                <th className="p-4">Invoice#</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-smooth group cursor-pointer">
                  <td className="p-4 text-white font-mono text-sm">{inv.invoiceNo}</td>
                  <td className="p-4">
                    <p className="text-white font-bold text-sm">{inv.customer}</p>
                    <p className="text-[10px] text-muted uppercase">{inv.vehicle}</p>
                  </td>
                  <td className="p-4 text-white font-bold text-sm">${inv.total.toLocaleString()}</td>
                  <td className="p-4 text-muted text-xs">{inv.date}</td>
                  <td className="p-4">
                    <Badge variant={inv.status === 'Paid' ? 'success' : 'warning'}>{inv.status}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 transition-smooth">
                      <button className="p-1.5 text-muted hover:text-primary"><Eye size={16} /></button>
                      <button className="p-1.5 text-muted hover:text-info"><Download size={16} /></button>
                      <button className="p-1.5 text-muted hover:text-green-500"><Send size={16} /></button>
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

export default InvoiceList;
