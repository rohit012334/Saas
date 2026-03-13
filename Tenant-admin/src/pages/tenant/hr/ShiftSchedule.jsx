import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/shared/PageHeader';
import { 
  Calendar as CalendarIcon, Clock, Users, 
  ChevronLeft, ChevronRight, Plus 
} from 'lucide-react';

const ShiftSchedule = () => {
  const { t } = useTranslation();

  const shifts = [
    { name: 'Morning Shift', time: '09:00 AM - 06:00 PM', staff: 6 },
    { name: 'Mid Shift', time: '12:00 PM - 09:00 PM', staff: 4 },
    { name: 'Evening Shift', time: '03:00 PM - 12:00 AM', staff: 2 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('hr:shiftSchedule')} 
        breadcrumbs={['GMS', t('sidebar:hrManagement'), t('hr:shiftSchedule')]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm">
             <Plus size={18} />
             Create Shift
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {shifts.map(shift => (
           <div key={shift.name} className="surface-card p-6 border-b-4 border-primary">
              <h4 className="text-lg font-bold text-white mb-2">{shift.name}</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-muted text-sm">
                    <Clock size={16} />
                    {shift.time}
                 </div>
                 <div className="flex items-center gap-2 text-muted text-sm">
                    <Users size={16} />
                    {shift.staff} Staff Members
                 </div>
                 <div className="pt-4 flex gap-2">
                    <button className="flex-1 py-2 bg-surface border border-border rounded-lg text-xs font-bold text-white hover:bg-white/5 transition-smooth">
                       Assign Staff
                    </button>
                    <button className="flex-1 py-2 bg-surface border border-border rounded-lg text-xs font-bold text-white hover:bg-white/5 transition-smooth">
                       View Details
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      <div className="surface-card p-6">
         <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold flex items-center gap-2">
               <CalendarIcon size={18} className="text-primary" />
               Weekly Roster
            </h3>
            <div className="flex items-center gap-3">
               <button className="p-2 border border-border rounded-xl text-muted hover:text-white"><ChevronLeft size={20} /></button>
               <span className="text-sm font-bold text-white">Week of March 11 - 17</span>
               <button className="p-2 border border-border rounded-xl text-muted hover:text-white"><ChevronRight size={20} /></button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
               <thead>
                  <tr className="text-muted text-[10px] uppercase tracking-widest font-bold">
                     <th className="p-4 bg-surface text-left rounded-tl-xl">Employee</th>
                     <th className="p-4 bg-surface">Mon</th>
                     <th className="p-4 bg-surface">Tue</th>
                     <th className="p-4 bg-surface">Wed</th>
                     <th className="p-4 bg-surface text-primary">Thu (Today)</th>
                     <th className="p-4 bg-surface">Fri</th>
                     <th className="p-4 bg-surface">Sat</th>
                     <th className="p-4 bg-surface rounded-tr-xl">Sun</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                  {['Rajesh Verma', 'Suresh Raina', 'Amit Shah'].map((name, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-smooth">
                       <td className="p-4 text-left text-white font-bold text-sm">{name}</td>
                       {Array.from({ length: 7 }).map((_, j) => (
                         <td key={j} className={`p-4 ${j === 3 ? 'bg-primary/5' : ''}`}>
                            <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-[10px] font-bold ${j === 6 ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-primary/20 text-primary border border-primary/20'}`}>
                               {j === 6 ? 'OFF' : 'M'}
                            </div>
                         </td>
                       ))}
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default ShiftSchedule;
