import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, UserCheck, UserMinus, Wrench, 
  Search, Plus, Eye, Edit2, Calendar, 
  X, Check
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { ExportButton } from '@/components/shared/ExportButton';
import { DateFilter } from '@/components/shared/DateFilter';
import { employees as initialEmployees } from '@/data/dummyData';
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'Mechanic',
    address: '',
    skills: '',
    documents: []
  });

  const filteredEmployees = useMemo(() => {
    return employeeList.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone.includes(searchQuery);
      
      if (!matchesSearch) return false;

      if (dateFilter === 'all') return true;
      
      const joinDate = new Date(emp.joinDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (dateFilter === 'today') return joinDate >= today;
      if (dateFilter === 'yesterday') return joinDate >= yesterday && joinDate < today;
      if (dateFilter === '7days') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return joinDate >= sevenDaysAgo;
      }

      return true;
    });
  }, [employeeList, searchQuery, dateFilter]);

  const handleOpenModal = (emp = null) => {
    if (emp) {
      setEditingEmployee(emp);
      setFormData({
        name: emp.name,
        phone: emp.phone,
        email: emp.email || '',
        role: emp.role,
        address: emp.address || '',
        skills: emp.skills.join(', '),
        documents: emp.documents || []
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        role: t('hr:mechanic'),
        address: '',
        skills: '',
        documents: []
      });
    }
    setIsModalOpen(true);
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (editingEmployee) {
      setEmployeeList(employeeList.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...formData, skills: formData.skills.split(',').map(s => s.trim()) } 
          : emp
      ));
    } else {
      const id = (employeeList.length + 1).toString();
      const addedEmployee = {
        id,
        ...formData,
        status: t('hr:active'),
        joinDate: new Date().toISOString().split('T')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        skills: formData.skills.split(',').map(s => s.trim())
      };
      setEmployeeList([addedEmployee, ...employeeList]);
    }
    
    setIsModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const exportColumns = [
    { header: t('hr:name'), accessor: 'name' },
    { header: t('hr:role'), accessor: 'role' },
    { header: t('hr:phone'), accessor: 'phone' },
    { header: t('hr:joinDate'), accessor: 'joinDate' },
    { header: t('hr:status'), accessor: 'status' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('sidebar:hrManagement')} 
        breadcrumbs={['GMS', t('sidebar:hrManagement')]}
        actions={
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            {t('hr:addEmployee')}
          </button>
        }
      />

      <div className="surface-card">
         <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input 
                  placeholder={t('hr:searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm w-64 outline-none focus:border-primary transition-smooth" 
                />
              </div>
              <DateFilter onFilterChange={setDateFilter} />
              <ExportButton 
                data={filteredEmployees} 
                filename="employees" 
                columns={exportColumns} 
              />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                  <th className="p-4">{t('hr:employee')}</th>
                  <th className="p-4">{t('hr:role')}</th>
                  <th className="p-4">{t('hr:skills')}</th>
                  <th className="p-4">{t('hr:joinDate')}</th>
                  <th className="p-4">{t('hr:status')}</th>
                  <th className="p-4 text-right">{t('hr:actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/5 transition-smooth group cursor-pointer">
                    <td className="p-4" onClick={() => navigate(`/hr/employees/${emp.id}`)}>
                       <div className="flex items-center gap-3">
                         <img src={emp.avatar} className="w-10 h-10 rounded-full border border-border" alt="avatar" />
                         <div>
                            <p className="text-white font-bold text-sm">{emp.name}</p>
                            <p className="text-[10px] text-muted">{emp.phone}</p>
                         </div>
                       </div>
                    </td>
                    <td className="p-4">
                       <Badge variant={emp.role === 'Tenant Admin' ? 'purple' : emp.role === 'Manager' ? 'info' : 'muted'}>
                          {emp.role}
                       </Badge>
                    </td>
                    <td className="p-4">
                       <div className="flex flex-wrap gap-1">
                          {emp.skills.map(skill => (
                            <span key={skill} className="text-[9px] bg-white/5 text-muted px-1.5 py-0.5 rounded border border-border/50">
                               {skill}
                            </span>
                          ))}
                       </div>
                    </td>
                    <td className="p-4 text-muted text-xs">{emp.joinDate}</td>
                    <td className="p-4">
                       <Badge variant="success">{emp.status === 'Active' ? t('hr:active') : emp.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex items-center justify-end gap-2 transition-smooth">
                          <button 
                            className="p-1.5 text-muted hover:text-primary transition-smooth" 
                            title={t('hr:viewProfile')}
                            onClick={() => navigate(`/hr/employees/${emp.id}`)}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="p-1.5 text-muted hover:text-warning" 
                            title={t('inventory:edit')}
                            onClick={() => handleOpenModal(emp)}
                          >
                            <Edit2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right duration-500">
           <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Check size={20} />
              </div>
              {editingEmployee ? t('hr:employeeUpdated') : t('hr:employeeAdded')}
           </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="surface-card w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-white/5">
              <div>
                <h3 className="text-xl font-bold text-white">{editingEmployee ? t('hr:editEmployee') : t('hr:addEmployee')}</h3>
                <p className="text-xs text-muted mt-1">{t('hr:enterDetailsPrompt')}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-white p-2 rounded-lg hover:bg-white/5"><X size={20} /></button>
            </div>
            <form className="p-8 space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar" onSubmit={handleAddEmployee}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('hr:fullName')}</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth" 
                    placeholder={t('hr:namePlaceholder') || "Ex: Rajesh Sharma"} 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('hr:phone')}</label>
                  <input 
                    type="tel" 
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth" 
                    placeholder={t('hr:phonePlaceholder') || "+91-XXXXX-XXXXX"} 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('hr:email')}</label>
                  <input 
                    type="email" 
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth" 
                    placeholder="rajesh@example.com" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('hr:role')}</label>
                  <select 
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary appearance-none transition-smooth"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value={t('hr:mechanic')}>{t('hr:mechanic')}</option>
                    <option value={t('hr:manager')}>{t('hr:manager')}</option>
                    <option value={t('hr:receptionist')}>{t('hr:receptionist')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('hr:address')}</label>
                <textarea 
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth resize-none" 
                  placeholder={t('hr:addressPlaceholder')} 
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('hr:skills')} {t('hr:skillsHelp')}</label>
                <input 
                  type="text" 
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth" 
                  placeholder={t('hr:skillsPlaceholder')} 
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('hr:requiredProofs')}</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Aadhaar Card */}
                  <div className="p-4 border border-border rounded-xl bg-white/5 space-y-2 group hover:border-primary transition-smooth">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{t('hr:aadhaarCard')}</span>
                      <X size={14} className="text-muted cursor-pointer hover:text-red-500" />
                    </div>
                    <label className="block w-full cursor-pointer">
                      <div className="border border-dashed border-border p-3 rounded-lg flex items-center justify-center gap-2 group-hover:border-primary/50 transition-smooth">
                        <Plus size={14} className="text-primary" />
                        <span className="text-[10px] text-muted group-hover:text-white">{t('hr:uploadAadhaar')}</span>
                      </div>
                      <input type="file" className="hidden" />
                    </label>
                  </div>

                  {/* PAN Card */}
                  <div className="p-4 border border-border rounded-xl bg-white/5 space-y-2 group hover:border-primary transition-smooth">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{t('hr:panCard')}</span>
                      <X size={14} className="text-muted cursor-pointer hover:text-red-500" />
                    </div>
                    <label className="block w-full cursor-pointer">
                      <div className="border border-dashed border-border p-3 rounded-lg flex items-center justify-center gap-2 group-hover:border-primary/50 transition-smooth">
                        <Plus size={14} className="text-primary" />
                        <span className="text-[10px] text-muted group-hover:text-white">{t('hr:uploadPan')}</span>
                      </div>
                      <input type="file" className="hidden" />
                    </label>
                  </div>

                  {/* ITI Certification */}
                  <div className="p-4 border border-border rounded-xl bg-white/5 space-y-2 group hover:border-primary transition-smooth">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{t('hr:itiCertification')}</span>
                      <X size={14} className="text-muted cursor-pointer hover:text-red-500" />
                    </div>
                    <label className="block w-full cursor-pointer">
                      <div className="border border-dashed border-border p-3 rounded-lg flex items-center justify-center gap-2 group-hover:border-primary/50 transition-smooth">
                        <Plus size={14} className="text-primary" />
                        <span className="text-[10px] text-muted group-hover:text-white">{t('hr:uploadCertificate')}</span>
                      </div>
                      <input type="file" className="hidden" />
                    </label>
                  </div>

                  {/* Driving License */}
                  <div className="p-4 border border-border rounded-xl bg-white/5 space-y-2 group hover:border-primary transition-smooth">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{t('hr:drivingLicense')}</span>
                      <X size={14} className="text-muted cursor-pointer hover:text-red-500" />
                    </div>
                    <label className="block w-full cursor-pointer">
                      <div className="border border-dashed border-border p-3 rounded-lg flex items-center justify-center gap-2 group-hover:border-primary/50 transition-smooth">
                        <Plus size={14} className="text-primary" />
                        <span className="text-[10px] text-muted group-hover:text-white">{t('hr:uploadDl')}</span>
                      </div>
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-muted font-bold hover:bg-white/5 rounded-xl transition-smooth"
                >
                  {t('hr:cancel')}
                </button>
                <button type="submit" className="flex-1 bg-primary text-white font-black py-3 rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-smooth uppercase tracking-widest">
                  {editingEmployee ? t('hr:updateEmployee') : t('hr:confirmCreate')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
