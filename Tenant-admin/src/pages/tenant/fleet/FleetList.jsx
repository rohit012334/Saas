import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Truck, Calendar, Clock, AlertTriangle, 
  Search, Plus, Eye, Edit2, ShieldCheck, 
  MapPin, Bell 
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { ExportButton } from '@/components/shared/ExportButton';
import { DateFilter } from '@/components/shared/DateFilter';

const FleetList = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const vehicles = [
    { id: 1, no: 'UP 32 AX 1111', model: 'Tata Ace', client: 'Amazon Logistics', lastService: '2024-03-12', nextService: '2024-04-10', status: 'Active', mileage: '45,000' },
    { id: 2, no: 'UP 32 AX 2222', model: 'Mahindra Bolero', client: 'BigBasket', lastService: '2023-12-15', nextService: '2024-03-15', status: 'Service Due', mileage: '32,000' },
    { id: 3, no: 'UP 32 AX 3333', model: 'Maruti Suzuki Eeco', client: 'Zomato', lastService: '2024-02-20', nextService: '2024-05-20', status: 'In Workshop', mileage: '12,000' },
  ];

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = 
        v.no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (dateFilter === 'all') return true;
      
      const lastServiceDate = new Date(v.lastService);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'today') {
        return lastServiceDate >= today;
      }
      
      if (dateFilter === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        return lastServiceDate >= sevenDaysAgo;
      }

      return true;
    });
  }, [searchQuery, dateFilter]);

  const exportColumns = [
    { header: 'Vehicle No', accessor: 'no' },
    { header: 'Model', accessor: 'model' },
    { header: 'Client', accessor: 'client' },
    { header: 'Status', accessor: 'status' },
    { header: 'Mileage', accessor: (item) => `${item.mileage} km` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('sidebar:fleetManagement')} 
        breadcrumbs={['GMS', t('sidebar:fleetManagement')]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm shadow-lg shadow-primary/20">
            <Plus size={18} />
            {t('fleet:addFleetVehicle')}
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title={t('fleet:totalVehicles')} value="15" icon={Truck} color="blue" />
        <StatCard title={t('fleet:dueService')} value="4" icon={Calendar} color="amber" />
        <StatCard title={t('fleet:overdueService')} value="1" icon={AlertTriangle} color="red" />
        <StatCard title={t('fleet:activeJobs')} value="3" icon={Clock} color="purple" />
      </div>

      <div className="surface-card">
         <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input 
                  placeholder="Search fleet..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm w-64 outline-none focus:border-primary transition-smooth" 
                />
              </div>
              <DateFilter onFilterChange={setDateFilter} />
              <ExportButton 
                data={filteredVehicles} 
                filename="fleet" 
                columns={exportColumns} 
              />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                  <th className="p-4">Vehicle No</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Last Service</th>
                  <th className="p-4">Next Service</th>
                  <th className="p-4">Mileage</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-white/5 transition-smooth group cursor-pointer">
                    <td className="p-4">
                      <p className="text-white font-bold text-sm uppercase">{v.no}</p>
                      <p className="text-[10px] text-muted">{v.model}</p>
                    </td>
                    <td className="p-4 text-white text-sm">{v.client}</td>
                    <td className="p-4 text-muted text-xs">{v.lastService}</td>
                    <td className="p-4 text-white font-medium text-xs">
                       <span className={v.status === 'Service Due' ? 'text-warning font-black' : 'text-white'}>{v.nextService}</span>
                    </td>
                    <td className="p-4 text-muted text-xs">{v.mileage} km</td>
                    <td className="p-4">
                      <Badge variant={v.status === 'Active' ? 'success' : v.status === 'Service Due' ? 'warning' : 'info'}>
                        {v.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex items-center justify-end gap-2 transition-smooth">
                          <button className="p-1.5 text-muted hover:text-primary"><Eye size={16} /></button>
                          <button className="p-1.5 text-muted hover:text-warning"><Edit2 size={16} /></button>
                          <button className="p-1.5 text-muted hover:text-primary"><Bell size={16} /></button>
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

export default FleetList;
