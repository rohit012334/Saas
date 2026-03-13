import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Activity, AlertCircle, CheckCircle, Info, Eye, Search, Car, User, FileText } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { ExportButton } from '@/components/shared/ExportButton';
import { DateFilter } from '@/components/shared/DateFilter';
import { diagnostics as initialScans } from '@/data/dummyData';

const DiagnosticsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scanList, setScanList] = useState(initialScans);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newScan, setNewScan] = useState({
    vehicleNo: '',
    customerName: '',
    severity: 'Warning',
    faults: ''
  });

  const stats = [
    { title: t('diagnostics:totalScans'), value: scanList.length.toString(), icon: Activity, color: 'blue' },
    { title: t('diagnostics:issuesFound'), value: '28', icon: AlertCircle, color: 'red' },
    { title: t('diagnostics:resolved'), value: '114', icon: CheckCircle, color: 'green' },
    { title: t('diagnostics:pendingReview'), value: '6', icon: Info, color: 'amber' },
  ];

  const handleAddScan = (e) => {
    e.preventDefault();
    const scan = {
      id: (scanList.length + 1).toString(),
      scanNo: `SCN-${2026}${800 + scanList.length}`,
      vehicleNo: newScan.vehicleNo,
      customerName: newScan.customerName,
      severity: newScan.severity,
      date: new Date().toISOString().split('T')[0],
      faultCodes: newScan.faults.split(',').map(f => ({ code: f.trim(), description: 'Detected via manual scan', status: 'Active' })),
      systemHealth: 65,
      summary: 'Manual diagnostic entry created by user.'
    };
    setScanList([scan, ...scanList]);
    setIsModalOpen(false);
    setNewScan({ vehicleNo: '', customerName: '', severity: 'Warning', faults: '' });
  };

  const filteredScans = useMemo(() => {
    return scanList.filter(diag => {
      const matchesSearch = 
        diag.scanNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        diag.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        diag.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const diagDate = new Date(diag.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let matchesDate = true;
      if (dateFilter === 'today') matchesDate = diagDate >= today;
      else if (dateFilter === 'yesterday') matchesDate = diagDate >= yesterday && diagDate < today;
      else if (dateFilter === '7days') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchesDate = diagDate >= sevenDaysAgo;
      }

      return matchesSearch && matchesDate;
    });
  }, [scanList, searchQuery, dateFilter]);

  const exportColumns = [
    { header: 'Scan#', accessor: 'scanNo' },
    { header: 'Vehicle No', accessor: 'vehicleNo' },
    { header: 'Customer', accessor: 'customerName' },
    { header: 'DTCs', accessor: (item) => item.faultCodes.length.toString() },
    { header: 'Severity', accessor: 'severity' },
    { header: 'Date', accessor: 'date' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('sidebar:diagnostics')} 
        breadcrumbs={['GMS', t('sidebar:diagnostics')]}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            New Scan
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <StatCard key={idx} {...s} />
        ))}
      </div>

      <div className="surface-card">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
               <input 
                 placeholder="Search scans..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm w-64 outline-none focus:border-primary transition-smooth" 
               />
             </div>
             <DateFilter onFilterChange={setDateFilter} />
             <ExportButton 
               data={filteredScans} 
               filename="diagnostic_scans" 
               columns={exportColumns} 
             />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                <th className="p-4">Scan#</th>
                <th className="p-4">Vehicle No</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Fault Codes</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredScans.map((diag) => (
                <tr key={diag.id} className="hover:bg-white/5 transition-smooth group cursor-pointer" onClick={() => navigate(`/diagnostics/${diag.id}`)}>
                  <td className="p-4 text-white font-mono text-sm">{diag.scanNo}</td>
                  <td className="p-4 text-white font-bold text-sm uppercase">{diag.vehicleNo}</td>
                  <td className="p-4 text-white text-sm">{diag.customerName}</td>
                  <td className="p-4">
                     <span className="text-xs text-white bg-surface px-2 py-1 rounded border border-border">
                        {diag.faultCodes.length} DTC Found
                     </span>
                  </td>
                  <td className="p-4">
                     <Badge variant={diag.severity === 'Critical' ? 'danger' : 'warning'}>{diag.severity}</Badge>
                  </td>
                  <td className="p-4 text-muted text-xs">{diag.date}</td>
                  <td className="p-4 text-right">
                     <button className="flex items-center justify-end gap-1 text-primary text-xs font-bold hover:underline">
                        {t('diagnostics:viewReport')} <Eye size={14} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Scan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Manual Diagnostic Scan</h3>
                  <p className="text-xs text-muted">Enter vehicle faults manually</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-muted hover:text-white rounded-lg hover:bg-white/5 transition-smooth">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddScan} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                    <Car size={12} className="text-primary" /> Vehicle Number
                  </label>
                  <input 
                    required
                    placeholder="DL 9C AB 1234"
                    value={newScan.vehicleNo}
                    onChange={(e) => setNewScan({...newScan, vehicleNo: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                    <User size={12} className="text-primary" /> Customer Name
                  </label>
                  <input 
                    required
                    placeholder="Arun Kumar"
                    value={newScan.customerName}
                    onChange={(e) => setNewScan({...newScan, customerName: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-smooth"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle size={12} className="text-primary" /> Severity Level
                </label>
                <div className="flex gap-3">
                  {['Normal', 'Warning', 'Critical'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setNewScan({...newScan, severity: level})}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-smooth ${
                        newScan.severity === level 
                        ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5' 
                        : 'bg-background border-border text-muted hover:text-white hover:border-white/20'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                  <FileText size={12} className="text-primary" /> Fault Codes (Comma separated)
                </label>
                <textarea 
                  rows={3}
                  placeholder="P0300, P0171, P0420"
                  value={newScan.faults}
                  onChange={(e) => setNewScan({...newScan, faults: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-smooth resize-none"
                />
                <p className="text-[10px] text-muted italic">Example: Enter P0300 for Random Engine Misfire</p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-border text-muted hover:text-white hover:bg-white/5 rounded-xl text-sm font-bold transition-smooth uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth text-sm font-bold shadow-xl shadow-primary/20 uppercase tracking-widest"
                >
                  Save Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticsList;
