import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, Calendar, CheckCircle, XCircle, 
  Clock, Search, Filter, Download 
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { employees } from '@/data/dummyData';

const Attendance = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('hr:attendance')} 
        breadcrumbs={['GMS', t('sidebar:hrManagement'), t('hr:attendance')]}
        actions={
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-muted text-sm font-bold">
                <Download size={18} />
                Export
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm">
                Mark Bulk Attendance
             </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard title="Present Today" value="10" icon={CheckCircle} color="green" />
         <StatCard title="Absent Today" value="1" icon={XCircle} color="red" />
         <StatCard title="On Leave" value="1" icon={Calendar} color="amber" />
         <StatCard title="Late Check-ins" value="2" icon={Clock} color="purple" />
      </div>

      <div className="surface-card">
         <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input placeholder="Search employee..." className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm w-64 outline-none focus:border-primary transition-smooth" />
               </div>
               <input type="date" defaultValue="2024-03-11" className="bg-surface border border-border rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-primary transition-smooth" />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Check In</th>
                  <th className="p-4">Check Out</th>
                  <th className="p-4">Working Hours</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/5 transition-smooth">
                    <td className="p-4">
                       <div className="flex items-center gap-3">
                          <img src={emp.avatar} className="w-8 h-8 rounded-full" alt="avatar" />
                          <span className="text-white font-bold text-sm">{emp.name}</span>
                       </div>
                    </td>
                    <td className="p-4 text-muted text-xs">{emp.role}</td>
                    <td className="p-4 text-white text-xs font-mono">09:12 AM</td>
                    <td className="p-4 text-white text-xs font-mono">--:-- --</td>
                    <td className="p-4 text-muted text-xs">--</td>
                    <td className="p-4">
                       <Badge variant={emp.id === 'emp4' ? 'warning' : 'success'}>
                          {emp.id === 'emp4' ? 'Late' : 'Present'}
                       </Badge>
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-primary text-[10px] font-bold hover:underline">Edit Entry</button>
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

export default Attendance;
