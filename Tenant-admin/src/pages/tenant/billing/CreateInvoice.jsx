import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
   Plus, Search, User, Car,
   Trash2, FileText, DollarSign,
   Save, Printer, Send
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';

const CreateInvoice = () => {
   const navigate = useNavigate();
   const { t } = useTranslation();
   const [items, setItems] = useState([
      { id: 1, desc: 'Oil Filter Replacement', qty: 1, rate: 850, total: 850 },
      { id: 2, desc: 'Engine Oil (Shell Helix)', qty: 4, rate: 1200, total: 4800 },
   ]);

   const subtotal = items.reduce((acc, item) => acc + item.total, 0);
   const total = subtotal;

   return (
      <div className="space-y-6">
         {/* <PageHeader 
        title="Create New Invoice"
        breadcrumbs={['GMS', t('sidebar:billing'), 'Create Invoice']}
        onBack={() => navigate('/billing/invoices')}
        actions={
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-muted font-bold text-sm">
                <Printer size={18} />
             </button>
             <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20">
                <Save size={18} />
                Generate Invoice
             </button>
          </div>
        }
      /> */}

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
               <div className="surface-card p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h4 className="text-xs font-bold text-muted uppercase flex items-center gap-2">
                        <User size={14} className="text-primary" /> Customer Info
                     </h4>
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                        <input placeholder="Search customer or mobile..." className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-primary transition-smooth" />
                     </div>
                     <div className="p-4 bg-surface/50 border border-border rounded-xl">
                        <p className="text-sm font-bold text-white">Rahul Verma</p>
                        <p className="text-xs text-muted">+91 98765 43210</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-xs font-bold text-muted uppercase flex items-center gap-2">
                        <Car size={14} className="text-primary" /> Linked Job Card
                     </h4>
                     <select className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary transition-smooth">
                        <option>Select Job Card</option>
                        <option>#JC-1002 - UP 32 AX 1111</option>
                        <option>#JC-1005 - DL 1C B 4321</option>
                     </select>
                     <div className="p-4 bg-surface/50 border border-border rounded-xl flex items-center justify-between">
                        <div>
                           <p className="text-sm font-bold text-white uppercase">UP 32 AX 1111</p>
                           <p className="text-xs text-muted font-mono">#JC-1002</p>
                        </div>
                        <Badge variant="purple">In Progress</Badge>
                     </div>
                  </div>
               </div>

               <div className="surface-card overflow-hidden">
                  <div className="p-4 bg-surface border-b border-border flex items-center justify-between">
                     <h3 className="font-bold text-sm">Invoice Items</h3>
                     <button className="flex items-center gap-2 text-primary text-xs font-bold hover:underline">
                        <Plus size={14} /> Add Item
                     </button>
                  </div>
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                           <th className="p-4">Description</th>
                           <th className="p-4">Qty</th>
                           <th className="p-4">Rate</th>
                           <th className="p-4">Total</th>
                           <th className="p-4 text-right"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/50">
                        {items.map(item => (
                           <tr key={item.id} className="hover:bg-white/5 transition-smooth">
                              <td className="p-4">
                                 <input value={item.desc} className="bg-transparent border-none text-sm text-white focus:ring-0 w-full" />
                              </td>
                              <td className="p-4">
                                 <input type="number" value={item.qty} className="bg-surface border border-border rounded-lg px-2 py-1 text-xs text-white w-16" />
                              </td>
                              <td className="p-4">
                                 <input type="number" value={item.rate} className="bg-surface border border-border rounded-lg px-2 py-1 text-xs text-white w-24" />
                              </td>
                              <td className="p-4 text-white font-bold text-sm">${item.total}</td>
                              <td className="p-4 text-right">
                                 <button className="text-muted hover:text-red-500 transition-smooth"><Trash2 size={16} /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <div className="surface-card p-6 space-y-4">
                  <h3 className="font-bold text-sm mb-4 border-b border-border pb-2">Invoice Summary</h3>
                  <div className="space-y-3">
                     <div className="flex justify-between text-sm text-muted">
                        <span>Subtotal</span>
                        <span className="text-white font-bold">${subtotal.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm text-muted">
                        <span>Discount</span>
                        <span className="text-success font-bold">-$0</span>
                     </div>
                     <div className="flex justify-between text-xl font-black text-white pt-4 border-t border-border mt-4">
                        <span>Total Amount</span>
                        <span className="text-primary font-black">${total.toLocaleString()}</span>
                     </div>
                  </div>
               </div>

               <div className="surface-card p-6 space-y-4">
                  <h3 className="font-bold text-sm mb-2">Payment Mode</h3>
                  <div className="grid grid-cols-2 gap-3">
                     {['Cash', 'UPI', 'Card', 'Credit'].map(mode => (
                        <button key={mode} className={`py-2 px-3 border rounded-xl text-xs font-bold transition-smooth ${mode === 'UPI' ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-border text-muted hover:text-white'}`}>
                           {mode}
                        </button>
                     ))}
                  </div>
               </div>

               <button className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-smooth flex items-center justify-center gap-3 group">
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-smooth" />
                  Send to Customer
               </button>
            </div>
         </div>
      </div>
   );
};

export default CreateInvoice;
