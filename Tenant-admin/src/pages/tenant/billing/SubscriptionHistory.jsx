import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Calendar, Clock, ArrowUpRight, Download, Package } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';

const SubscriptionHistory = () => {
  const { t } = useTranslation();

  // Dummy subscription data
  const subscriptionHistory = [
    {
      id: 'SUB-001',
      plan: 'Premium Plan (Annual)',
      date: '2024-03-15',
      time: '14:30:00',
      amount: '$24,999',
      status: 'Paid',
      paymentMethod: 'UPI'
    },
    {
      id: 'SUB-002',
      plan: 'Add-on: Extra 10 Users',
      date: '2024-02-10',
      time: '11:20:00',
      amount: '$4,999',
      status: 'Paid',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'SUB-003',
      plan: 'Pro Plan (Quarterly)',
      date: '2023-12-15',
      time: '10:15:00',
      amount: '$6,999',
      status: 'Paid',
      paymentMethod: 'Net Banking'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('sidebar:subscriptionHistory') || "Subscription History"}
        breadcrumbs={['GMS', t('sidebar:subscriptionHistory') || "Subscription History"]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="surface-card p-6 border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs text-muted font-bold uppercase tracking-widest">Current Plan</p>
              <h3 className="text-xl font-black text-white">Premium Plan</h3>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Expires on Mar 15, 2025</span>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
      </div>

      <div className="surface-card">
        <div className="p-4 border-b border-border flex items-center justify-between bg-white/5">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <CreditCard size={16} className="text-primary" />
            Purchase History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                <th className="p-4">Reference ID</th>
                <th className="p-4">Plan / Purchase</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptionHistory.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-smooth group">
                  <td className="p-4 text-xs font-mono text-muted">{item.id}</td>
                  <td className="p-4">
                    <p className="text-white font-bold text-sm tracking-tight">{item.plan}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-white text-xs font-bold flex items-center gap-1">
                        <Calendar size={12} className="text-primary" />
                        {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        {item.time}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-white font-bold text-sm">{item.amount}</td>
                  <td className="p-4 text-xs text-muted font-medium">{item.paymentMethod}</td>
                  <td className="p-4">
                    <Badge variant="success">{item.status}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-muted hover:text-primary transition-smooth bg-surface border border-border rounded-lg">
                      <Download size={16} />
                    </button>
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

export default SubscriptionHistory;
