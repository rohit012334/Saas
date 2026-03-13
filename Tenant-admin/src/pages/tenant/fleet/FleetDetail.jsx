import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Truck, Calendar, ShieldCheck, FileText, 
  Settings, History, AlertTriangle, Plus, 
  ArrowLeft, Download
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';

const FleetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Service History', 'Maintenance Schedule', 'Documents'];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="UP 32 AX 1111"
        breadcrumbs={['GMS', t('sidebar:fleetManagement'), 'UP 32 AX 1111']}
        onBack={() => navigate('/fleet')}
        actions={
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm">
                Schedule Service
             </button>
          </div>
        }
      />

      <div className="flex gap-4 border-b border-border mb-6 overflow-x-auto no-scrollbar">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8">
            {activeTab === 'Overview' && (
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="surface-card p-6">
                        <h4 className="text-xs font-bold text-muted uppercase mb-4">Vehicle Information</h4>
                        <div className="space-y-4">
                           <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-sm text-muted">Make / Model</span><span className="text-sm font-bold text-white">Tata Ace Gold</span></div>
                           <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-sm text-muted">Fuel Type</span><span className="text-sm text-white">CNG</span></div>
                           <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-sm text-muted">Current Mileage</span><span className="text-sm text-white font-mono">45,210 KM</span></div>
                           <div className="flex justify-between"><span className="text-sm text-muted">Insurance Expiry</span><span className="text-sm text-destructive font-bold">12 Jun 2024</span></div>
                        </div>
                     </div>
                     <div className="surface-card p-6">
                        <h4 className="text-xs font-bold text-muted uppercase mb-4">Client / Owner</h4>
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center">
                              <ShieldCheck size={24} className="text-primary" />
                           </div>
                           <div>
                              <p className="text-white font-bold">Amazon Logistics</p>
                              <p className="text-xs text-muted">Contract ID: #AMZ-452</p>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-sm text-muted">Assigned Driver</span><span className="text-sm text-white">Manish Singh</span></div>
                           <div className="flex justify-between"><span className="text-sm text-muted">Contact</span><span className="text-sm text-white">+91 99887 74422</span></div>
                        </div>
                     </div>
                  </div>

                  <div className="surface-card p-6">
                     <h4 className="text-xs font-bold text-muted uppercase mb-4">Cost Analytics</h4>
                     <div className="grid grid-cols-3 gap-6">
                        <div className="p-4 bg-surface/50 rounded-xl border border-border">
                           <p className="text-[10px] text-muted uppercase">Total Spent</p>
                           <p className="text-xl font-black text-white">₹1.2L</p>
                        </div>
                        <div className="p-4 bg-surface/50 rounded-xl border border-border">
                           <p className="text-[10px] text-muted uppercase">Avg / Service</p>
                           <p className="text-xl font-black text-white">₹8.5K</p>
                        </div>
                        <div className="p-4 bg-surface/50 rounded-xl border border-border">
                           <p className="text-[10px] text-muted uppercase">Maintenance / KM</p>
                           <p className="text-xl font-black text-white">₹2.6</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab !== 'Overview' && (
               <div className="surface-card p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <History size={32} />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white">{activeTab} for UP 32 AX 1111</h3>
                     <p className="text-muted text-sm max-w-sm mx-auto mt-2">Loading historical data and scheduled events for this vehicle...</p>
                  </div>
               </div>
            )}
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="surface-card p-6">
               <h3 className="font-bold text-sm mb-4">Vehicle Status</h3>
               <div className="flex items-center justify-between mb-6">
                  <Badge variant="success" className="px-4 py-1.5 text-xs">Active</Badge>
                  <span className="text-[10px] text-muted italic">Last updated: 10 mins ago</span>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-success"></div>
                     <span className="text-sm text-white">Engine Performance: Good</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-warning"></div>
                     <span className="text-sm text-white">Tyre Wear: 65% (Check soon)</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-success"></div>
                     <span className="text-sm text-white">Brakes: Recently Serviced</span>
                  </div>
               </div>
            </div>

            <div className="glass-card p-6 bg-amber-500/5 border-amber-500/20">
               <h3 className="font-bold text-sm mb-2 text-amber-500 flex items-center gap-2">
                  <AlertTriangle size={16} /> Maintenance Alert
               </h3>
               <p className="text-xs text-muted leading-relaxed mb-4">This vehicle is approaching its 50,000 KM major service interval. Recommend scheduling for next week.</p>
               <button className="w-full bg-amber-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-amber-600 transition-smooth">
                  Book Priority Slot
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FleetDetail;
