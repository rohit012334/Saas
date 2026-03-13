import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
   User, Mail, Phone, MapPin,
   Car, History, MessageSquare, Star,
   TrendingUp, CreditCard, Plus, ArrowLeft
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { customers } from '@/data/dummyData';

const CustomerDetail = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { t } = useTranslation();
   const [activeTab, setActiveTab] = useState(t('customers:overview'));

   const customer = customers.find(c => c.id === id) || customers[0];

   const tabs = [t('customers:overview')];

   return (
      <div className="space-y-6">
         <PageHeader
            title={customer.name}
            breadcrumbs={['GMS', t('sidebar:customers'), customer.name]}
            onBack={() => navigate('/customers')}
            actions={
               <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20">
                     <Plus size={18} />
                     {t('customers:newBooking')}
                  </button>
               </div>
            }
         />

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-4 space-y-6">
               <div className="surface-card p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-black mx-auto mb-4 border border-primary/20">
                     {customer.name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{customer.name}</h2>
                  <p className="text-xs text-muted mb-4">{t('customers:customerSince')} Jan 2023</p>
                  <div className="flex justify-center gap-2 mb-6">
                     <Badge variant="info" className="flex items-center gap-1">
                        <History size={12} /> {customer.serviceCount} {t('customers:services')}
                     </Badge>
                  </div>
                  <div className="space-y-3 text-left border-t border-border/50 pt-6">
                     <div className="flex items-center gap-3 text-sm text-muted">
                        <Phone size={14} className="text-primary" /> {customer.phone}
                     </div>
                     <div className="flex items-center gap-3 text-sm text-muted">
                        <Mail size={14} className="text-primary" /> rahul@example.com
                     </div>
                     <div className="flex items-center gap-3 text-sm text-muted">
                        <MapPin size={14} className="text-primary" /> Lucknow, Uttar Pradesh
                     </div>
                  </div>
               </div>

               <div className="surface-card p-6">
                  <h3 className="font-bold text-sm mb-4">{t('customers:registeredVehicles')}</h3>
                  <div className="space-y-3">
                     {customer.vehicles.map(v => (
                        <div key={v.plate} className="p-4 bg-surface/50 rounded-xl border border-border group hover:border-primary transition-smooth">
                           <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                 <Car size={20} />
                              </div>
                              <div className="flex-1">
                                 <p className="text-sm font-black text-white uppercase tracking-wider">{v.plate}</p>
                                 <p className="text-[10px] text-muted font-bold uppercase">{v.make} {v.model} • {v.fuel}</p>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/30">
                              <div>
                                 <p className="text-[8px] text-muted uppercase font-bold tracking-widest">{t('customers:variant')}</p>
                                 <p className="text-xs text-white font-medium">{v.variant}</p>
                              </div>
                              <div>
                                 <p className="text-[8px] text-muted uppercase font-bold tracking-widest">{t('customers:year')}</p>
                                 <p className="text-xs text-white font-medium">{v.year}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6">
               <div className="flex gap-4 border-b border-border overflow-x-auto no-scrollbar">
                  {tabs.map(tab => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-bold transition-smooth relative shrink-0 ${activeTab === tab ? 'text-primary' : 'text-muted hover:text-white'}`}
                     >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                     </button>
                  ))}
               </div>

               {activeTab === t('customers:overview') && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                     <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <div className="surface-card p-6">
                           <p className="text-xs text-muted font-bold uppercase mb-4">{t('customers:serviceAnalytics')}</p>
                           <div className="space-y-4">
                              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                                 <span className="text-sm text-muted">{t('customers:totalVisits')}</span>
                                 <span className="text-lg font-black text-white">{customer.serviceCount}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-sm text-muted">{t('customers:lastService')}</span>
                                 <span className="text-lg font-black text-primary">15 Feb 2024</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default CustomerDetail;
