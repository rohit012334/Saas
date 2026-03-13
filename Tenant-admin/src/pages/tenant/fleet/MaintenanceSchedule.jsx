import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar as CalendarIcon, List, Clock, 
  ChevronLeft, ChevronRight, Plus, Filter 
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';

const MaintenanceSchedule = () => {
  const { t } = useTranslation();
  const [view, setView] = useState('calendar'); // calendar or list

  const events = [
    { date: '12 Mar', vehicle: 'UP 32 AX 1111', type: 'Oil Change', status: 'Scheduled' },
    { date: '14 Mar', vehicle: 'DL 1C B 4321', type: 'Full Inspection', status: 'Pending' },
    { date: '15 Mar', vehicle: 'HR 26 DQ 9999', type: 'Brake Check', status: 'Scheduled' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('fleet:maintenanceSchedule')} 
        breadcrumbs={['GMS', t('sidebar:fleetManagement'), t('fleet:maintenanceSchedule')]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm">
             <Plus size={18} />
             Schedule New
          </button>
        }
      />

      <div className="surface-card">
         <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-4 bg-surface/50 border border-border p-1 rounded-xl">
               <button 
                 onClick={() => setView('calendar')}
                 className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-smooth text-sm font-medium ${view === 'calendar' ? 'bg-primary text-white' : 'text-muted hover:text-white'}`}
               >
                 <CalendarIcon size={16} /> Calendar
               </button>
               <button 
                 onClick={() => setView('list')}
                 className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-smooth text-sm font-medium ${view === 'list' ? 'bg-primary text-white' : 'text-muted hover:text-white'}`}
               >
                 <List size={16} /> List
               </button>
            </div>
            <div className="flex items-center gap-3">
               <button className="p-2 border border-border rounded-xl text-muted hover:text-white"><ChevronLeft size={20} /></button>
               <span className="text-sm font-bold text-white">March 2024</span>
               <button className="p-2 border border-border rounded-xl text-muted hover:text-white"><ChevronRight size={20} /></button>
               <div className="w-px h-6 bg-border mx-2"></div>
               <button className="p-2 border border-border rounded-xl text-muted hover:text-white"><Filter size={18} /></button>
            </div>
         </div>

         {view === 'calendar' ? (
            <div className="p-4 overflow-x-auto">
               <div className="min-w-[800px]">
                  <div className="grid grid-cols-7 border-b border-border pb-4">
                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                       <div key={d} className="text-center text-xs font-bold text-muted uppercase">{d}</div>
                     ))}
                  </div>
                  <div className="grid grid-cols-7 grid-rows-5 h-[600px]">
                     {Array.from({ length: 35 }).map((_, i) => {
                        const day = i - 3; // Offset for demo
                        return (
                          <div key={i} className={`border border-border/30 p-2 hover:bg-white/5 transition-smooth relative ${day === 12 ? 'bg-primary/5 ring-1 ring-primary/20' : ''}`}>
                             <span className={`text-xs font-bold ${day > 0 && day <= 31 ? (day === 12 ? 'text-primary' : 'text-white') : 'text-muted opacity-30'}`}>
                                {day > 0 && day <= 31 ? day : ''}
                             </span>
                             {day === 12 && (
                                <div className="mt-2 space-y-1">
                                   <div className="bg-primary/20 border-l-2 border-primary p-1.5 rounded-r text-[10px] text-white truncate font-bold">
                                      UP 32 AX...
                                   </div>
                                </div>
                             )}
                          </div>
                        );
                     })}
                  </div>
               </div>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                        <th className="p-4">Date</th>
                        <th className="p-4">Vehicle No</th>
                        <th className="p-4">Service Type</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {events.map((ev, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-smooth">
                           <td className="p-4 text-white font-bold text-sm">{ev.date}</td>
                           <td className="p-4 text-primary font-mono text-sm uppercase">{ev.vehicle}</td>
                           <td className="p-4 text-white text-sm">{ev.type}</td>
                           <td className="p-4">
                              <Badge variant={ev.status === 'Scheduled' ? 'info' : 'warning'}>{ev.status}</Badge>
                           </td>
                           <td className="p-4 text-right">
                              <button className="text-[10px] font-bold text-primary hover:underline">Reschedule</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  );
};

export default MaintenanceSchedule;
