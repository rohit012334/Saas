import React from 'react';
import { useTranslation } from 'react-i18next';
import {
   Plus, Search, Filter, IndianRupee,
   TrendingUp, TrendingDown, ShoppingCart,
   Wrench, Home, Briefcase, Eye, Download
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';

const Expenses = () => {
   const { t } = useTranslation();

   const expenses = [
      { id: 1, title: 'Workshop Electricity Bill', cat: 'Utilities', amount: 4500, date: '2024-03-05', status: 'Paid' },
      { id: 2, title: 'Bulk Lubricants Purchase', cat: 'Inventory', amount: 15200, date: '2024-03-08', status: 'Pending' },
      { id: 3, title: 'Shop Assistant Salary', cat: 'Salary', amount: 8000, date: '2024-03-10', status: 'Paid' },
   ];

   return (
      <div className="space-y-6">
         {/* <PageHeader 
        title={t('billing:expenses')} 
        breadcrumbs={['GMS', t('sidebar:billing'), t('billing:expenses')]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20">
             <Plus size={18} />
             Add Expense
          </button>
        }
      /> */}

         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="This Month" value="₹45,200" icon={TrendingUp} color="red" />
            <StatCard title="Inventory Cost" value="₹28,500" icon={ShoppingCart} color="blue" />
            <StatCard title="Operating Costs" value="₹12,400" icon={Home} color="purple" />
            <StatCard title="Net Profit (Est)" value="₹1.8L" icon={TrendingUp} color="green" />
         </div>

         <div className="surface-card">
            <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                     <input placeholder="Search expenses..." className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm w-64 outline-none focus:border-primary transition-smooth" />
                  </div>
                  <button className="p-2 border border-border rounded-xl text-muted hover:text-white"><Filter size={18} /></button>
               </div>
               <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-bold text-muted hover:text-white transition-smooth">
                  <Download size={18} />
                  Download CSV
               </button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                        <th className="p-4">Expense Details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {expenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-white/5 transition-smooth group">
                           <td className="p-4">
                              <p className="text-white font-bold text-sm">{exp.title}</p>
                              <p className="text-[10px] text-muted uppercase">Bill ID: {exp.id + 5000}</p>
                           </td>
                           <td className="p-4">
                              <div className="flex items-center gap-2 text-xs text-muted">
                                 {exp.cat === 'Utilities' ? <Home size={12} /> : exp.cat === 'Inventory' ? <ShoppingCart size={12} /> : <Briefcase size={12} />}
                                 {exp.cat}
                              </div>
                           </td>
                           <td className="p-4 text-muted text-xs">{exp.date}</td>
                           <td className="p-4 text-right">
                              <p className="text-white font-black text-sm">₹{exp.amount.toLocaleString()}</p>
                           </td>
                           <td className="p-4">
                              <Badge variant={exp.status === 'Paid' ? 'success' : 'warning'}>{exp.status}</Badge>
                           </td>
                           <td className="p-4 text-right">
                              <button className="p-1.5 text-muted hover:text-primary transition-smooth"><Eye size={16} /></button>
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

export default Expenses;
