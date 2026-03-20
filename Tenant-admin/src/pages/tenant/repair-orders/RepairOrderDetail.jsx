import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
   Printer, MessageSquare, ChevronDown, CheckCircle2,
   Clock, Wrench, User, Car, Image, FileText, Plus, Send
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { repairOrders as initialOrders, employees } from '@/data/dummyData';

const RepairOrderDetail = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { t } = useTranslation();
   const [activeTab, setActiveTab] = useState('Overview');
   const [currentOrder, setCurrentOrder] = useState(
      initialOrders.find(ro => ro.id === id) || initialOrders[0]
   );

   const mechanics = employees.filter(e => e.role === 'Mechanic');
   const statusOptions = [
      t('repairOrders:intake'),
      t('repairOrders:inspection'),
      t('repairOrders:awaitingApproval'),
      t('repairOrders:approved'),
      t('repairOrders:inProgress'),
      t('repairOrders:partsWaiting'),
      t('repairOrders:readyForDelivery'),
      t('repairOrders:completed')
   ];

   const handleStatusChange = (newStatus) => {
      setCurrentOrder(prev => ({ ...prev, status: newStatus }));
   };

   const handleMechanicChange = (mechId) => {
      setCurrentOrder(prev => ({ ...prev, mechanicId: mechId }));
   };

   const tabs = [
      { id: 'Overview', label: t('repairOrders:overview') },
      { id: 'Inspection', label: t('repairOrders:inspection') },
      { id: 'Parts & Labour', label: t('repairOrders:partsLabour') },
      { id: 'Notes', label: t('repairOrders:notes') }
   ];

   return (
      <div className="space-y-6">
         <PageHeader
            title={`${currentOrder.jobNo} - ${currentOrder.vehicleNo}`}
            breadcrumbs={['GMS', t('sidebar:repairOrders'), currentOrder.jobNo]}
            onBack={() => navigate('/repair-orders')}
            actions={
               <div className="flex items-center gap-3">
                  <div className="relative group/status">
                     <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth text-sm font-bold shadow-lg shadow-primary/20">
                        {currentOrder.status}
                        <ChevronDown size={14} />
                     </button>
                     <div className="absolute top-full mt-2 right-0 w-56 bg-surface border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-smooth z-50 overflow-hidden">
                        <div className="p-2 border-b border-border bg-white/5">
                           <p className="text-[10px] font-bold text-muted uppercase px-2">{t('repairOrders:changeStatus')}</p>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                           {statusOptions.map(status => (
                              <button
                                 key={status}
                                 onClick={() => handleStatusChange(status)}
                                 className={`w-full text-left px-4 py-2.5 text-xs transition-smooth ${currentOrder.status === status ? 'text-primary bg-primary/5 font-bold' : 'text-muted hover:text-white hover:bg-white/5'}`}
                              >
                                 {status}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            }
         />

         <div className="flex gap-4 border-b border-border mb-6">
            {tabs.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-bold transition-smooth relative ${activeTab === tab.id ? 'text-primary' : 'text-muted hover:text-white'}`}
               >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
               </button>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
               {activeTab === 'Overview' && (
                  <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="surface-card p-6">
                           <h4 className="text-muted text-xs font-bold uppercase mb-4 flex items-center gap-2">
                              <Car size={14} className="text-primary" /> {t('repairOrders:vehicleDetails')}
                           </h4>
                           <div className="space-y-3">
                              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted text-sm px-px">{t('repairOrders:makeModel')}</span><span className="text-white font-bold">{currentOrder.make} {currentOrder.model}</span></div>
                              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted text-sm px-px">{t('repairOrders:vehicleNo')}</span><span className="text-primary font-bold">{currentOrder.vehicleNo}</span></div>
                              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted text-sm px-px">{t('repairOrders:year')}</span><span className="text-white">{currentOrder.year}</span></div>
                              <div className="flex justify-between"><span className="text-muted text-sm px-px">{t('repairOrders:fuelType')}</span><span className="text-white">{t('repairOrders:petrol')}</span></div>
                           </div>
                        </div>
                        <div className="surface-card p-6">
                           <h4 className="text-muted text-xs font-bold uppercase mb-4 flex items-center gap-2">
                              <User size={14} className="text-primary" /> {t('repairOrders:customerInfo')}
                           </h4>
                           <div className="space-y-3">
                              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted text-sm px-px">{t('common:name')}</span><span className="text-white font-bold">{currentOrder.customerName}</span></div>
                              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted text-sm px-px">{t('common:phone')}</span><span className="text-white">{currentOrder.customerPhone}</span></div>
                              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted text-sm px-px">{t('repairOrders:email')}</span><span className="text-white">rahul@example.com</span></div>
                              <div className="flex justify-between"><span className="text-muted text-sm px-px">{t('repairOrders:type')}</span><span className="text-white">{t('repairOrders:regular')}</span></div>
                           </div>
                        </div>
                     </div>

                     <div className="surface-card p-6">
                        <h4 className="text-muted text-xs font-bold uppercase mb-4">{t('repairOrders:jobSummary')}</h4>
                        <div className="space-y-4">
                           <div>
                              <p className="text-xs text-muted mb-1 font-bold">{t('repairOrders:customerComplaint')}</p>
                              <p className="text-white text-sm bg-surface/50 p-4 rounded-xl border border-border">{currentOrder.complaint}</p>
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <p className="text-xs text-muted mb-1 font-bold">{t('repairOrders:serviceType')}</p>
                                 <Badge variant="purple" className="py-1 px-3 text-xs">{currentOrder.serviceType}</Badge>
                              </div>
                              <div>
                                 <p className="text-xs text-muted mb-1 font-bold">{t('repairOrders:assignedMechanic')}</p>
                                 <div className="relative group/mech">
                                    <button className="flex items-center gap-2 p-1.5 bg-surface/50 border border-border rounded-xl hover:border-primary transition-smooth w-full">
                                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentOrder.mechanicId}`} className="w-8 h-8 rounded-full border border-border" alt="mech" />
                                       <div className="text-left flex-1 min-w-0">
                                          <p className="text-xs font-bold text-white truncate">{employees.find(e => e.id === currentOrder.mechanicId)?.name || t('repairOrders:selectMechanic')}</p>
                                          <p className="text-[10px] text-muted">{t('repairOrders:technician')}</p>
                                       </div>
                                       <ChevronDown size={14} className="text-muted" />
                                    </button>
                                    <div className="absolute top-full mt-2 left-0 w-full bg-surface border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover/mech:opacity-100 group-hover/mech:visible transition-smooth z-50 overflow-hidden">
                                       <div className="p-2 border-b border-border bg-white/5">
                                          <p className="text-[10px] font-bold text-muted uppercase px-2">{t('repairOrders:assignMechanic')}</p>
                                       </div>
                                       <div className="max-h-48 overflow-y-auto">
                                          {mechanics.map(m => (
                                             <button
                                                key={m.id}
                                                onClick={() => handleMechanicChange(m.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 text-xs transition-smooth ${currentOrder.mechanicId === m.id ? 'text-primary bg-primary/5 font-bold' : 'text-muted hover:text-white hover:bg-white/5'}`}
                                             >
                                                <img src={m.avatar} className="w-6 h-6 rounded-full border border-border" alt="avatar" />
                                                {m.name}
                                             </button>
                                          ))}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'Inspection' && (
                  <div className="surface-card p-6">
                     <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold flex items-center gap-2">
                           <CheckCircle2 size={18} className="text-primary" /> {t('repairOrders:preInspectionResults')}
                        </h3>
                        <span className="text-xs text-muted italic">{t('repairOrders:checkedBy')} Suresh R. • 12:30 PM Today</span>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                           { label: t('repairOrders:fuelLevel'), key: 'fuel' },
                           { label: t('repairOrders:spareTyre'), key: 'spare' },
                           { label: t('repairOrders:toolKit'), key: 'toolkit' },
                           { label: t('repairOrders:jack'), key: 'jack' },
                           { label: t('repairOrders:documents'), key: 'docs' },
                           { label: t('repairOrders:scratches'), key: 'scratches' },
                           { label: t('repairOrders:acWorking'), key: 'ac' },
                           { label: t('repairOrders:lights'), key: 'lights' }
                        ].map(item => (
                           <div key={item.key} className="flex flex-col items-center gap-2 p-4 bg-surface/50 rounded-xl border border-border select-none">
                              <CheckCircle2 size={24} className="text-success" />
                              <span className="text-xs text-white font-bold">{item.label}</span>
                           </div>
                        ))}
                     </div>
                     <div className="mt-8 space-y-4">
                        <h4 className="text-sm font-bold flex items-center gap-2"><Image size={16} className="text-primary" /> {t('repairOrders:photos')} (4)</h4>
                        <div className="grid grid-cols-4 gap-4">
                           {[1, 2, 3, 4].map(i => (
                              <div key={i} className="aspect-video bg-surface rounded-xl border border-border flex items-center justify-center group relative overflow-hidden">
                                 <img src={`https://picsum.photos/seed/${i + 10}/400/225`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-smooth" alt="car" />
                                 <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-smooth">
                                    <p className="text-[10px] text-white">{t('repairOrders:sideProfile')}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'Parts & Labour' && (
                  <div className="space-y-6">
                     <div className="surface-card overflow-hidden">
                        <div className="p-4 bg-surface border-b border-border font-bold text-sm">{t('repairOrders:partsConsumed')}</div>
                        <table className="w-full text-left">
                           <thead>
                              <tr className="text-[10px] text-muted uppercase tracking-widest border-b border-border/50">
                                 <th className="p-4">{t('repairOrders:partName')}</th>
                                 <th className="p-4">{t('repairOrders:qty')}</th>
                                 <th className="p-4">{t('repairOrders:price')}</th>
                                 <th className="p-4 text-right">{t('repairOrders:total')}</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-border/50">
                              {currentOrder.parts.map(p => (
                                 <tr key={p.id} className="text-sm">
                                    <td className="p-4 text-white font-medium">{p.name}</td>
                                    <td className="p-4 text-muted">{p.qty}</td>
                                    <td className="p-4 text-muted">${p.unitPrice}</td>
                                    <td className="p-4 text-right text-white font-bold">${p.total}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>

                     <div className="surface-card overflow-hidden">
                        <div className="p-4 bg-surface border-b border-border font-bold text-sm">{t('repairOrders:labourServices')}</div>
                        <table className="w-full text-left">
                           <thead>
                              <tr className="text-[10px] text-muted uppercase tracking-widest border-b border-border/50">
                                 <th className="p-4">{t('common:description')}</th>
                                 <th className="p-4">{t('repairOrders:hours')}</th>
                                 <th className="p-4">{t('repairOrders:rate')}</th>
                                 <th className="p-4 text-right">{t('repairOrders:total')}</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-border/50">
                              {currentOrder.labour.map(l => (
                                 <tr key={l.id} className="text-sm">
                                    <td className="p-4 text-white font-medium">{l.description}</td>
                                    <td className="p-4 text-muted">{l.hours}</td>
                                    <td className="p-4 text-muted">${l.rate}</td>
                                    <td className="p-4 text-right text-white font-bold">${l.total}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>

                     <div className="flex justify-end">
                        <div className="w-72 surface-card p-6 space-y-3">
                           <div className="flex justify-between text-sm"><span className="text-muted">{t('repairOrders:subtotal')}</span><span className="text-white font-bold">$4,650</span></div>
                           <div className="flex justify-between text-sm"><span className="text-success">{t('repairOrders:discount')}</span><span className="text-success font-bold">-$150</span></div>
                           <div className="flex justify-between text-lg font-bold border-t border-border pt-3 mt-3">
                              <span className="text-white">{t('repairOrders:total')}</span>
                              <span className="text-primary font-black">$5,337</span>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Right Sidebar: Timeline / Status */}
            {/* <div className="lg:col-span-4 space-y-6">
               <div className="surface-card p-6">
                  <h3 className="font-bold text-sm mb-6 flex items-center gap-2">
                     <Clock size={16} className="text-primary" /> Job Timeline
                  </h3>
                  <div className="relative pl-6 border-l-2 border-border/50 space-y-8 ml-2">
                     {[
                        { status: 'In Progress', time: '11:30 AM', date: 'Today', user: 'Suresh R.', desc: 'Mechanic started working on engine.' },
                        { status: 'Approved', time: '10:45 AM', date: 'Today', user: 'Rahul V.', desc: 'Customer approved the estimate via WhatsApp.' },
                        { status: 'Estimate Sent', time: '10:15 AM', date: 'Today', user: 'Priya S.', desc: 'Sent PDF estimate to customer.' },
                        { status: 'Inspection', time: '09:50 AM', date: 'Today', user: 'Suresh R.', desc: 'Vehicle diagnostic check completed.' },
                        { status: 'Intake', time: '09:30 AM', date: 'Today', user: 'Priya S.', desc: 'Job card created at reception.' },
                     ].map((item, idx) => (
                        <div key={idx} className="relative">
                           <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-4 border-background ${idx === 0 ? 'bg-primary ring-4 ring-primary/20 animate-pulse' : 'bg-muted/50'}`}></div>
                           <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                 <span className={`text-xs font-bold ${idx === 0 ? 'text-primary' : 'text-white'}`}>{item.status}</span>
                                 <span className="text-[10px] text-muted">{item.time}</span>
                              </div>
                              <p className="text-[11px] text-white/70">{item.desc}</p>
                              <p className="text-[10px] text-muted italic">By {item.user}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="surface-card p-6">
                  <h3 className="font-bold text-sm mb-4">Internal Notes</h3>
                  <div className="space-y-4 mb-6">
                     <div className="bg-surface/50 p-3 rounded-xl border border-border">
                        <p className="text-xs text-white">Left rear tail light is slightly dim, should check wiring.</p>
                        <p className="text-[10px] text-muted text-right mt-1">— Suresh, 11:45 AM</p>
                     </div>
                  </div>
                  <div className="relative">
                     <textarea placeholder="Add a note..." className="w-full bg-surface border border-border rounded-xl px-4 py-2 pr-12 text-sm outline-none focus:border-primary transition-smooth resize-none h-20"></textarea>
                     <button className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth">
                        <Send size={16} />
                     </button>
                  </div>
               </div>
            </div> */}
         </div>
      </div>
   );
};

export default RepairOrderDetail;
