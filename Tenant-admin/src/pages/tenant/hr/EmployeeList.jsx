import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, UserCheck, UserMinus, Wrench, 
  Search, Plus, Eye, Edit2, Calendar, 
  X, Check, Trash2
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { ExportButton } from '@/components/shared/ExportButton';
import { DateFilter } from '@/components/shared/DateFilter';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { staffApi } from '@/utils/api';

const EmployeeList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  const initialFormData = {
    name: '',
    phone: '',
    email: '',
    role: 'MECHANIC',
    password: '',
    address: '',
    skills: '',
    canAccessDashboard: false,
    canAccessRepairOrders: false,
    canAccessDiagnostics: false,
    canAccessInventory: false,
    canAccessPartsSourcing: false,
    canAccessFleet: false,
    canAccessHr: false,
    canAccessCustomers: false,
    canAccessServices: false,
    canAccessReports: false,
    canAccessBilling: false,
    canAccessSettings: false,
    isActive: true,
    idCardFront: null,
    idCardBack: null,
    contract: null,
    otherDoc: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const res = await staffApi.getAll();
      if (res.data.success) {
        setEmployeeList(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const modules = [
    { id: 'canAccessDashboard', label: t('sidebar:dashboard') },
    { id: 'canAccessRepairOrders', label: t('sidebar:repairOrders') },
    { id: 'canAccessDiagnostics', label: t('sidebar:diagnostics') },
    { id: 'canAccessInventory', label: t('sidebar:inventory') },
    { id: 'canAccessPartsSourcing', label: t('sidebar:partsSourcing') },
    { id: 'canAccessFleet', label: t('sidebar:fleetManagement') },
    { id: 'canAccessHr', label: t('sidebar:hrManagement') },
    { id: 'canAccessCustomers', label: t('sidebar:customers') },
    { id: 'canAccessServices', label: t('sidebar:services') },
    { id: 'canAccessReports', label: t('sidebar:reports') },
    { id: 'canAccessBilling', label: t('sidebar:subscriptionHistory') },
    { id: 'canAccessSettings', label: t('sidebar:settings') },
  ];

  const filteredEmployees = useMemo(() => {
    return employeeList.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.phone && emp.phone.includes(searchQuery));
      
      if (!matchesSearch) return false;
      return true;
    });
  }, [employeeList, searchQuery]);

  const handleOpenModal = (emp = null) => {
    if (emp) {
      setEditingEmployee(emp);
      setFormData({
        name: emp.name,
        phone: emp.phone || '',
        email: emp.email || '',
        role: emp.role,
        password: '',
        address: emp.address || '',
        skills: emp.skills || '',
        canAccessDashboard: emp.canAccessDashboard,
        canAccessRepairOrders: emp.canAccessRepairOrders,
        canAccessDiagnostics: emp.canAccessDiagnostics,
        canAccessInventory: emp.canAccessInventory,
        canAccessPartsSourcing: emp.canAccessPartsSourcing,
        canAccessFleet: emp.canAccessFleet,
        canAccessHr: emp.canAccessHr,
        canAccessCustomers: emp.canAccessCustomers,
        canAccessServices: emp.canAccessServices,
        canAccessReports: emp.canAccessReports,
        canAccessBilling: emp.canAccessBilling,
        canAccessSettings: emp.canAccessSettings,
        isActive: emp.isActive,
        idCardFront: null,
        idCardBack: null,
        contract: null,
        otherDoc: null,
      });
    } else {
      setEditingEmployee(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingEmployee) {
        res = await staffApi.update(editingEmployee.id, formData);
      } else {
        res = await staffApi.create(formData);
      }
      
      if (res.data.success) {
        fetchEmployees();
        setIsModalOpen(false);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm(t('common:confirmDelete') || "Are you sure you want to delete this employee?")) {
      try {
        const res = await staffApi.delete(id);
        if (res.data.success) {
          fetchEmployees();
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete");
      }
    }
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
                    <td className="p-4" onClick={() => navigate(`/hr/${emp.id}`)}>
                       <div className="flex items-center gap-3">
                         <img 
                           src={emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} 
                           className="w-10 h-10 rounded-full border border-border" 
                           alt="avatar" 
                         />
                         <div>
                            <p className="text-white font-bold text-sm">{emp.name}</p>
                            <p className="text-[10px] text-muted">{emp.phone}</p>
                         </div>
                       </div>
                    </td>
                    <td className="p-4">
                       <Badge variant={emp.role === 'TENANT_ADMIN' ? 'purple' : emp.role === 'MANAGER' ? 'info' : 'muted'}>
                          {emp.role}
                       </Badge>
                    </td>
                    <td className="p-4">
                       <div className="flex flex-wrap gap-1">
                          {(emp.skills || []).map(skill => (
                            <span key={skill} className="text-[9px] bg-white/5 text-muted px-1.5 py-0.5 rounded border border-border/50">
                               {skill}
                            </span>
                          ))}
                       </div>
                    </td>
                    <td className="p-4 text-muted text-xs">{new Date(emp.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                       <Badge variant={emp.isActive ? 'success' : 'danger'}>
                          {emp.isActive ? t('hr:active') : (t('hr:inactive') || 'Inactive')}
                       </Badge>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex items-center justify-end gap-2 transition-smooth">
                          <button 
                            className="p-1.5 text-muted hover:text-primary transition-smooth" 
                            title={t('hr:viewProfile')}
                            onClick={(e) => { e.stopPropagation(); navigate(`/hr/${emp.id}`); }}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="p-1.5 text-muted hover:text-warning" 
                            title={t('inventory:edit')}
                            onClick={(e) => { e.stopPropagation(); handleOpenModal(emp); }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="p-1.5 text-muted hover:text-red-500 transition-smooth" 
                            title={t('common:delete') || "Delete"}
                            onClick={(e) => { e.stopPropagation(); handleDeleteEmployee(emp.id); }}
                          >
                            <Trash2 size={16} />
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
                    <option value="MECHANIC">{t('hr:mechanic')}</option>
                    <option value="MANAGER">{t('hr:manager')}</option>
                    <option value="RECEPTIONIST">{t('hr:receptionist')}</option>
                    <option value="TENANT_ADMIN">{t('hr:admin') || "Admin"}</option>
                    <option value="STAFF">{t('hr:staff') || "Staff"}</option>
                  </select>
                </div>
                {editingEmployee && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('hr:status') || "Status"}</label>
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-border rounded-xl">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                        className={clsx(
                          "w-10 h-5 rounded-full transition-smooth relative",
                          formData.isActive ? "bg-green-500" : "bg-muted"
                        )}
                      >
                        <div className={clsx(
                          "absolute top-1 w-3 h-3 bg-white rounded-full transition-smooth",
                          formData.isActive ? "right-1" : "left-1"
                        )} />
                      </button>
                      <span className={clsx("text-xs font-bold", formData.isActive ? "text-green-500" : "text-muted")}>
                        {formData.isActive ? t('hr:active') : t('hr:inactive') || "Inactive"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Module Access Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('hr:moduleAccess') || "Module Access"}</label>
                  {formData.role === 'TENANT_ADMIN' && (
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{t('hr:fullAccessGranted') || "Full Access Granted"}</span>
                  )}
                </div>
                
                <div className={clsx(
                  "grid grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-xl border border-border bg-white/5",
                  formData.role === 'TENANT_ADMIN' && "opacity-50 pointer-events-none"
                )}>
                  {modules.map(module => (
                    <label key={module.id} className="flex items-center gap-2 cursor-pointer group">
                      <div className={clsx(
                        "w-5 h-5 rounded border flex items-center justify-center transition-smooth",
                        formData[module.id] ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"
                      )}>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={formData[module.id]} 
                          onChange={(e) => setFormData({...formData, [module.id]: e.target.checked})}
                        />
                        {formData[module.id] && <Check size={14} className="text-white" />}
                      </div>
                      <span className="text-xs text-muted group-hover:text-white transition-smooth">{module.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">{editingEmployee ? t('hr:changePassword') || "Change Password" : t('hr:password') || "Password"}</label>
                  <input 
                    type="password" 
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required={!editingEmployee}
                  />
                  {editingEmployee && <p className="text-[10px] text-muted italic">Leave blank to keep current password</p>}
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
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('hr:requiredProofs') || "Required Documents"}</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ID Card Front */}
                  <div className="p-4 border border-border rounded-xl bg-white/5 space-y-2 group hover:border-primary transition-smooth">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-tighter">{t('hr:idCardFront') || "ID Card Front"}</span>
                    </div>
                    <label className="block w-full cursor-pointer">
                      <div className="border border-dashed border-border p-3 rounded-lg flex items-center justify-center gap-2 group-hover:border-primary/50 transition-smooth">
                        <Plus size={14} className={formData.idCardFront ? "text-green-500" : "text-primary"} />
                        <span className="text-[10px] text-muted group-hover:text-white">
                          {formData.idCardFront ? formData.idCardFront.name : t('hr:uploadFront') || "Upload Front"}
                        </span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => setFormData({...formData, idCardFront: e.target.files[0]})} 
                      />
                    </label>
                  </div>

                  {/* ID Card Back */}
                  <div className="p-4 border border-border rounded-xl bg-white/5 space-y-2 group hover:border-primary transition-smooth">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-tighter">{t('hr:idCardBack') || "ID Card Back"}</span>
                    </div>
                    <label className="block w-full cursor-pointer">
                      <div className="border border-dashed border-border p-3 rounded-lg flex items-center justify-center gap-2 group-hover:border-primary/50 transition-smooth">
                        <Plus size={14} className={formData.idCardBack ? "text-green-500" : "text-primary"} />
                        <span className="text-[10px] text-muted group-hover:text-white">
                          {formData.idCardBack ? formData.idCardBack.name : t('hr:uploadBack') || "Upload Back"}
                        </span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => setFormData({...formData, idCardBack: e.target.files[0]})} 
                      />
                    </label>
                  </div>

                  {/* Contract */}
                  <div className="p-4 border border-border rounded-xl bg-white/5 space-y-2 group hover:border-primary transition-smooth">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-tighter">{t('hr:employmentContract') || "Employment Contract"}</span>
                    </div>
                    <label className="block w-full cursor-pointer">
                      <div className="border border-dashed border-border p-3 rounded-lg flex items-center justify-center gap-2 group-hover:border-primary/50 transition-smooth">
                        <Plus size={14} className={formData.contract ? "text-green-500" : "text-primary"} />
                        <span className="text-[10px] text-muted group-hover:text-white">
                          {formData.contract ? formData.contract.name : t('hr:uploadContract') || "Upload Contract"}
                        </span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => setFormData({...formData, contract: e.target.files[0]})} 
                      />
                    </label>
                  </div>

                  {/* Other */}
                  <div className="p-4 border border-border rounded-xl bg-white/5 space-y-2 group hover:border-primary transition-smooth">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-tighter">{t('hr:otherDocs') || "Other Documents"}</span>
                    </div>
                    <label className="block w-full cursor-pointer">
                      <div className="border border-dashed border-border p-3 rounded-lg flex items-center justify-center gap-2 group-hover:border-primary/50 transition-smooth">
                        <Plus size={14} className={formData.otherDoc ? "text-green-500" : "text-primary"} />
                        <span className="text-[10px] text-muted group-hover:text-white">
                          {formData.otherDoc ? formData.otherDoc.name : t('hr:uploadOther') || "Upload Other"}
                        </span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => setFormData({...formData, otherDoc: e.target.files[0]})} 
                      />
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
