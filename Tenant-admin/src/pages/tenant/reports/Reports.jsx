import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
   BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon,
   Download, Calendar, TrendingUp, TrendingDown, Users, Package,
   DollarSign, Wrench
} from 'lucide-react';
import {
   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
   ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';

const Reports = () => {
   const { t } = useTranslation();

   const tabKeys = ['revenue'];
   const [activeTab, setActiveTab] = useState(tabKeys[0]);

   const revenueData = [
      { name: 'Mon', revenue: 45000 },
      { name: 'Tue', revenue: 52000 },
      { name: 'Wed', revenue: 48000 },
      { name: 'Thu', revenue: 61000 },
      { name: 'Fri', revenue: 55000 },
      { name: 'Sat', revenue: 72000 },
      { name: 'Sun', revenue: 40000 },
   ];

   return (
      <div className="space-y-6">
         <PageHeader
            title={t('sidebar:reports')}
            breadcrumbs={['GMS', t('sidebar:reports')]}
            actions={
               <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-surface px-4 py-2 border border-border rounded-xl text-muted text-sm cursor-pointer hover:bg-white/5 transition-smooth">
                     <Calendar size={18} />
                     <span>{t('reports:lastThirtyDays')}</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm">
                     <Download size={18} />
                     {t('reports:downloadReport')}
                  </button>
               </div>
            }
         />

         <div className="flex gap-4 border-b border-border overflow-x-auto no-scrollbar mb-6">
            {tabKeys.map(tabKey => (
               <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`px-4 py-4 text-sm font-bold transition-smooth relative shrink-0 ${activeTab === tabKey ? 'text-primary' : 'text-muted hover:text-white'}`}
               >
                  {t(`reports:${tabKey}`)}
                  {activeTab === tabKey && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
               </button>
            ))}
         </div>

         <div className="space-y-8 animate-in fade-in duration-500">
            {activeTab === 'revenue' && (
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <StatCard title={t('reports:totalRevenue')} value="$12,45,000" icon={DollarSign} trend="up" trendValue="15" color="green" />
                     <StatCard title={t('reports:avgTransaction')} value="$4,200" icon={TrendingUp} trend="up" trendValue="5" color="blue" />
                     <StatCard title={t('reports:bestDayRevenue')} value="$72,000" icon={Calendar} color="purple" />
                     <StatCard title={t('reports:projectedMonth')} value="$15.2L" icon={BarChart2} color="amber" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <div className="surface-card p-6">
                        <h3 className="font-bold mb-6 flex items-center gap-2"><LineChartIcon size={18} className="text-primary" /> {t('reports:dailyRevenueTrend')}</h3>
                        <div className="h-80">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={revenueData}>
                                 <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                       <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                 <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                 <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                                 <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px' }} />
                                 <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                     <div className="surface-card p-6">
                        <h3 className="font-bold mb-6 flex items-center gap-2"><BarChart2 size={18} className="text-primary" /> {t('reports:revenueByServiceType')}</h3>
                        <div className="h-80">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                 { name: 'General', val: 450000 },
                                 { name: 'Repair', val: 320000 },
                                 { name: 'Electrical', val: 180000 },
                                 { name: 'Body', val: 240000 },
                                 { name: 'AC', val: 55000 },
                              ]}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                 <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                                 <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                                 <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px' }} />
                                 <Bar dataKey="val" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </div>

                  <div className="surface-card overflow-hidden">
                     <div className="p-4 bg-surface border-b border-border font-bold">{t('reports:topCustomersBySpending')}</div>
                     <table className="w-full text-left">
                        <thead>
                           <tr className="text-[10px] text-muted uppercase tracking-widest border-b border-border/50 font-bold">
                              <th className="p-4">{t('reports:customerName')}</th>
                              <th className="p-4 text-center">{t('reports:visits')}</th>
                              <th className="p-4 text-center">{t('reports:vehicles')}</th>
                              <th className="p-4 text-right">{t('reports:totalSpent')}</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                           {[
                              { name: 'Rahul Verma', visits: 12, cars: 2, spent: 85400 },
                              { name: 'Amit Shah', visits: 8, cars: 1, spent: 62000 },
                              { name: 'Priya Patel', visits: 6, cars: 3, spent: 54000 },
                           ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-white/5 transition-smooth">
                                 <td className="p-4 text-white font-bold">{row.name}</td>
                                 <td className="p-4 text-center text-muted">{row.visits}</td>
                                 <td className="p-4 text-center text-muted">{row.cars}</td>
                                 <td className="p-4 text-right text-white font-black">${row.spent.toLocaleString()}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab !== 'revenue' && (
               <div className="flex flex-col items-center justify-center p-20 surface-card text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <BarChart2 size={32} />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white">{t('reports:comingSoon', { tab: t(`reports:${activeTab}`) })}</h3>
                     <p className="text-muted text-sm max-w-sm mx-auto mt-2">{t('reports:calculatingMetrics')}</p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default Reports;
