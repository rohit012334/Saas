import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, Search, Filter, Download, 
  ShoppingCart, Clock, CheckCircle, XCircle 
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';

const PurchaseOrders = () => {
  const { t } = useTranslation();

  const pos = [
    { id: 'po1', poNo: 'PO-3001', supplier: 'BOSCH India', items: 12, total: 45000, status: 'Sent', date: '2024-03-10' },
    { id: 'po2', poNo: 'PO-3002', supplier: 'Castrol Ltd', items: 5, total: 18000, status: 'Received', date: '2024-03-08' },
    { id: 'po3', poNo: 'PO-3003', supplier: 'Minda Corp', items: 8, total: 12500, status: 'Draft', date: '2024-03-11' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('inventory:purchaseOrders')} 
        breadcrumbs={['GMS', t('sidebar:inventory'), t('inventory:purchaseOrders')]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm shadow-lg shadow-primary/20">
            <Plus size={18} />
            {t('inventory:createPO')}
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title={t('inventory:purchaseOrders')} value="28" icon={ShoppingCart} color="blue" />
        <StatCard title={t('inventory:pending')} value="12" icon={Clock} color="amber" />
        <StatCard title={t('inventory:received')} value="15" icon={CheckCircle} color="green" />
        <StatCard title={t('inventory:totalValue')} value="₹4.2L" icon={ShoppingCart} color="purple" />
      </div>

      <div className="surface-card">
         <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input placeholder={t('inventory:searchPOs')} className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm w-64 outline-none focus:border-primary transition-smooth" />
              </div>
              <button className="p-2 border border-border rounded-xl text-muted hover:text-white hover:bg-white/5">
                 <Filter size={18} />
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-bold text-muted hover:text-white transition-smooth">
               <Download size={18} />
               {t('common:export')}
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                  <th className="p-4">{t('inventory:poNo')}</th>
                  <th className="p-4">{t('inventory:supplier')}</th>
                  <th className="p-4">{t('inventory:items')}</th>
                  <th className="p-4">{t('inventory:date')}</th>
                  <th className="p-4">{t('inventory:totalValuePO')}</th>
                  <th className="p-4">{t('inventory:status')}</th>
                  <th className="p-4 text-right">{t('inventory:actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pos.map((po) => (
                  <tr key={po.id} className="hover:bg-white/5 transition-smooth group">
                    <td className="p-4 text-white font-mono text-sm">{po.poNo}</td>
                    <td className="p-4 text-white font-bold text-sm">{po.supplier}</td>
                    <td className="p-4 text-muted text-xs">{t('inventory:itemsCount', { count: po.items })}</td>
                    <td className="p-4 text-muted text-xs">{po.date}</td>
                    <td className="p-4 text-white font-black text-sm">₹{po.total.toLocaleString()}</td>
                    <td className="p-4">
                       <Badge variant={po.status === 'Received' ? 'success' : po.status === 'Sent' ? 'info' : 'muted'}>
                          {po.status === 'Received' ? t('inventory:received') : po.status === 'Sent' ? t('inventory:sent') : t('inventory:draft')}
                       </Badge>
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-primary text-xs font-bold hover:underline">{t('inventory:viewDetail')}</button>
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

export default PurchaseOrders;
