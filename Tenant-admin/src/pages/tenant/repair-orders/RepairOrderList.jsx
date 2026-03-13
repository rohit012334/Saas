import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, Search, List, LayoutGrid, FileText, 
  Eye, Edit2, Trash2, Printer 
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { ExportButton } from '@/components/shared/ExportButton';
import { DateFilter } from '@/components/shared/DateFilter';
import { repairOrders as initialOrders, employees } from '@/data/dummyData';
import { useNavigate } from 'react-router-dom';

const RepairOrderList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orderList, setOrderList] = useState(initialOrders);
  const [view, setView] = useState('table'); // 'table' or 'kanban'
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const mechanics = employees.filter(e => e.role === 'Mechanic');

  const handleUpdateStatus = (id, newStatus) => {
    setOrderList(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleUpdateMechanic = (id, mechId) => {
    setOrderList(prev => prev.map(o => o.id === id ? { ...o, mechanicId: mechId } : o));
  };

  const stats = [
    { title: t('repairOrders:totalToday'), value: '24', icon: FileText, color: 'blue' },
    { title: t('repairOrders:inProgress'), value: '12', icon: List, color: 'amber' },
    { title: t('repairOrders:pendingApproval'), value: '5', icon: FileText, color: 'purple' },
    { title: t('repairOrders:completedToday'), value: '8', icon: Plus, color: 'green' },
  ];

  const filteredOrders = useMemo(() => {
    return orderList.filter(ro => {
      const matchesSearch = 
        ro.jobNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ro.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ro.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (dateFilter === 'all') return true;
      
      const orderDate = new Date(ro.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (dateFilter === 'today') return orderDate >= today && orderDate < tomorrow;
      if (dateFilter === 'tomorrow') return orderDate >= tomorrow && orderDate < new Date(tomorrow.getTime() + 86400000);
      if (dateFilter === 'yesterday') return orderDate >= yesterday && orderDate < today;
      
      if (dateFilter === '7days') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return orderDate >= sevenDaysAgo;
      }

      if (dateFilter === '30days') {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return orderDate >= thirtyDaysAgo;
      }

      return true;
    });
  }, [orderList, searchQuery, dateFilter]);

  const exportColumns = [
    { header: 'Job#', accessor: 'jobNo' },
    { header: 'Vehicle No', accessor: 'vehicleNo' },
    { header: 'Customer', accessor: 'customerName' },
    { header: 'Status', accessor: 'status' },
    { header: 'Cost', accessor: (item) => `₹${item.estimatedCost}` },
    { header: 'Date', accessor: (item) => new Date(item.createdAt).toLocaleDateString() },
  ];

  const kanbanColumns = [
    t('repairOrders:intake'), 
    t('repairOrders:inspection'), 
    t('repairOrders:awaitingApproval'), 
    t('repairOrders:approved'), 
    t('repairOrders:inProgress'), 
    t('repairOrders:partsWaiting'), 
    t('repairOrders:readyForDelivery')
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('sidebar:repairOrders')} 
        breadcrumbs={['GMS', t('sidebar:repairOrders')]}
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm shadow-lg shadow-primary/20" onClick={() => navigate('/repair-orders/create')}>
              <Plus size={18} />
              {t('repairOrders:createJobCard')}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <StatCard key={idx} {...s} />
        ))}
      </div>

      <div className="surface-card">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 bg-surface/50 border border-border p-1 rounded-xl w-fit">
            <button 
              onClick={() => setView('table')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-smooth text-sm font-medium ${view === 'table' ? 'bg-primary text-white' : 'text-muted hover:text-white'}`}
            >
              <List size={16} />
              {t('repairOrders:tableView')}
            </button>
            <button 
              onClick={() => setView('kanban')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-smooth text-sm font-medium ${view === 'kanban' ? 'bg-primary text-white' : 'text-muted hover:text-white'}`}
            >
              <LayoutGrid size={16} />
              {t('repairOrders:kanbanView')}
            </button>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
               <input 
                 type="text" 
                 placeholder={t('repairOrders:searchPlaceholder')} 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm w-64 outline-none focus:border-primary transition-smooth"
               />
             </div>
             <DateFilter onFilterChange={setDateFilter} />
             <ExportButton 
               data={filteredOrders} 
               filename="repair_orders" 
               columns={exportColumns} 
             />
          </div>
        </div>

        {view === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-muted text-xs border-b border-border uppercase tracking-widest font-semibold">
                  <th className="p-4">{t('repairOrders:jobNo')}</th>
                  <th className="p-4">{t('repairOrders:vehicleNo')}</th>
                  <th className="p-4">{t('repairOrders:customer')}</th>
                  <th className="p-4">{t('repairOrders:mechanic')}</th>
                  <th className="p-4">{t('repairOrders:status')}</th>
                  <th className="p-4 text-right">{t('repairOrders:estCost')}</th>
                  <th className="p-4 text-right">{t('common:actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((ro) => (
                  <tr key={ro.id} className="hover:bg-white/5 transition-smooth group cursor-pointer" onClick={() => navigate(`/repair-orders/${ro.id}`)}>
                    <td className="p-4 text-white font-mono text-sm">{ro.jobNo}</td>
                    <td className="p-4">
                      <p className="text-white font-bold text-sm uppercase">{ro.vehicleNo}</p>
                      <p className="text-[10px] text-muted">{ro.make} {ro.model}</p>
                    </td>
                    <td className="p-4 text-white text-sm">{ro.customerName}</td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ro.mechanicId}`} className="w-6 h-6 rounded-full" alt="mech" />
                         <select 
                           value={ro.mechanicId} 
                           onChange={(e) => handleUpdateMechanic(ro.id, e.target.value)}
                           className="bg-transparent border-none outline-none text-xs text-muted cursor-pointer hover:text-white transition-smooth"
                         >
                           {mechanics.map(m => (
                             <option key={m.id} value={m.id} className="bg-surface text-white">{m.name}</option>
                           ))}
                         </select>
                      </div>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={ro.status} 
                        onChange={(e) => handleUpdateStatus(ro.id, e.target.value)}
                        className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-surface border border-border outline-none cursor-pointer hover:border-primary transition-smooth ${
                          ro.status === 'In Progress' ? 'text-info' : ro.status === 'Completed' ? 'text-success' : 'text-warning'
                        }`}
                      >
                        {kanbanColumns.map(col => (
                          <option key={col} value={col} className="bg-surface text-white">{col}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right text-white font-bold text-sm">₹{ro.estimatedCost.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-smooth">
                        <button className="p-1.5 text-muted hover:text-primary"><Eye size={16} /></button>
                        <button className="p-1.5 text-muted hover:text-warning"><Edit2 size={16} /></button>
                        <button className="p-1.5 text-muted hover:text-danger"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 overflow-x-auto flex gap-6 pb-4">
            {kanbanColumns.map(col => (
              <div key={col} className="min-w-[300px] flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {col}
                    <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-muted">
                        {filteredOrders.filter(ro => ro.status === col).length || 0}
                    </span>
                  </h4>
                  <Plus size={14} className="text-muted cursor-pointer hover:text-white" />
                </div>
                <div className="flex-1 min-h-[500px] space-y-4">
                  {filteredOrders.filter(ro => ro.status === col || (col === 'In Progress' && ro.status === 'In Progress')).map(ro => (
                      <div key={ro.id} className="glass-card p-4 hover:border-primary transition-smooth cursor-pointer active:scale-95 group/kanban">
                         <div className="flex justify-between mb-2">
                            <span className="text-[10px] text-muted font-mono">{ro.jobNo}</span>
                            <Badge variant={ro.priority === 'Urgent' ? 'danger' : 'info'} className="text-[8px] px-1.5">
                              {ro.priority === 'Urgent' ? t('repairOrders:urgent') : t('repairOrders:normal')}
                            </Badge>
                         </div>
                         <p className="text-sm font-bold text-white uppercase" onClick={() => navigate(`/repair-orders/${ro.id}`)}>{ro.vehicleNo}</p>
                         <p className="text-xs text-muted mb-4">{ro.customerName}</p>
                         <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                            <div className="flex items-center gap-2 relative group/mech-kanban">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ro.mechanicId}`} className="w-6 h-6 rounded-full border border-background" alt="mech" />
                               <select 
                                 value={ro.mechanicId} 
                                 onChange={(e) => {
                                   e.stopPropagation();
                                   handleUpdateMechanic(ro.id, e.target.value);
                                 }}
                                 className="bg-transparent border-none outline-none text-[10px] text-muted cursor-pointer hover:text-white transition-smooth max-w-[80px]"
                               >
                                 {mechanics.map(m => (
                                   <option key={m.id} value={m.id} className="bg-surface text-white">{m.name}</option>
                                 ))}
                               </select>
                            </div>
                            <span className="text-xs font-bold text-white">₹{ro.estimatedCost.toLocaleString()}</span>
                         </div>
                      </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairOrderList;
