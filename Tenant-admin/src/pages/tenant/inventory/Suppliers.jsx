import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, Phone, Mail, MapPin, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';

const Suppliers = () => {
  const { t } = useTranslation();

  const suppliers = [
    { id: 1, name: 'BOSCH India', contact: 'Anil Gupta', phone: '+91 99887 76655', email: 'anil@bosch.in', city: 'Bangalore', parts: 45 },
    { id: 2, name: 'Castrol Ltd', contact: 'Sanjay Jain', phone: '+91 99887 76656', email: 'sanjay@castrol.com', city: 'Mumbai', parts: 12 },
    { id: 3, name: 'Minda Corp', contact: 'Rajesh Mehra', phone: '+91 99887 76657', email: 'rajesh@minda.com', city: 'Delhi', parts: 28 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('inventory:suppliers')} 
        breadcrumbs={['GMS', t('sidebar:inventory'), t('inventory:suppliers')]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm shadow-lg shadow-primary/20">
            <Plus size={18} />
            {t('inventory:addSupplier')}
          </button>
        }
      />

      <div className="surface-card">
         <div className="p-4 border-b border-border">
            <div className="relative w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
               <input placeholder={t('inventory:searchSuppliers')} className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm w-full outline-none focus:border-primary transition-smooth" />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                  <th className="p-4">{t('inventory:supplierName')}</th>
                  <th className="p-4">{t('inventory:contact')}</th>
                  <th className="p-4">{t('inventory:location')}</th>
                  <th className="p-4">{t('inventory:partsSupplied')}</th>
                  <th className="p-4">{t('inventory:status')}</th>
                  <th className="p-4 text-right">{t('inventory:actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-smooth group">
                    <td className="p-4">
                       <p className="text-white font-bold text-sm">{s.name}</p>
                       <div className="flex items-center gap-2 mt-1">
                          <Phone size={10} className="text-muted" />
                          <span className="text-[10px] text-muted">{s.phone}</span>
                       </div>
                    </td>
                    <td className="p-4">
                       <p className="text-white text-sm">{s.contact}</p>
                       <p className="text-[10px] text-muted">{s.email}</p>
                    </td>
                    <td className="p-4 text-muted text-xs">
                       <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {s.city}
                       </div>
                    </td>
                    <td className="p-4 text-white font-bold text-sm">{s.parts}</td>
                    <td className="p-4">
                       <Badge variant="success">{t('inventory:active')}</Badge>
                    </td>
                    <td className="p-4 text-right border-border/50">
                       <div className="flex items-center justify-end gap-2 transition-smooth">
                          <button className="p-1.5 text-muted hover:text-warning"><Edit2 size={16} /></button>
                          <button className="p-1.5 text-muted hover:text-danger"><Trash2 size={16} /></button>
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

export default Suppliers;
