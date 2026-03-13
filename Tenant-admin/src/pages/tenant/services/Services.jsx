import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Wrench, Search, Plus, Edit2, X, Trash2, Tag, Truck, Bike, Car
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { ExportButton } from '@/components/shared/ExportButton';

const initialServices = [
  { id: '1', name: 'General Service', vehicleType: 'Both', description: 'Comprehensive checkup and oil change' },
  { id: '2', name: 'Brake Repair', vehicleType: '4 Wheeler', description: 'Brake pad replacement and fluid check' },
  { id: '3', name: 'Chain Lubrication', vehicleType: '2 Wheeler', description: 'Cleaning and lubrication of drive chain' },
  { id: '4', name: 'Wheel Alignment', vehicleType: '4 Wheeler', description: 'Precise wheel alignment for 4 wheelers' },
];

const Services = () => {
  const { t } = useTranslation();
  const [servicesList, setServicesList] = useState(initialServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    vehicleType: 'Both',
    description: ''
  });

  const filteredServices = useMemo(() => {
    return servicesList.filter(service => {
      const matchesSearch = 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.vehicleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSearch;
    });
  }, [servicesList, searchQuery]);

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        vehicleType: service.vehicleType,
        description: service.description || ''
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        vehicleType: 'Both',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData({ name: '', vehicleType: 'Both', description: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingService) {
      setServicesList(servicesList.map(s => s.id === editingService.id ? { ...s, ...formData } : s));
    } else {
      const newService = {
        ...formData,
        id: (servicesList.length + 1).toString(),
      };
      setServicesList([newService, ...servicesList]);
    }
    handleCloseModal();
  };

  const handleDeleteService = (id) => {
    if (window.confirm(t('services:deleteConfirm'))) {
      setServicesList(servicesList.filter(s => s.id !== id));
    }
  };

  const getVehicleIcon = (type) => {
    if (type === '2 Wheeler') return <Bike size={16} className="text-primary" />;
    if (type === '4 Wheeler') return <Car size={16} className="text-secondary" />;
    return (
      <div className="flex -space-x-1">
        <Bike size={14} className="text-primary" />
        <Car size={14} className="text-secondary" />
      </div>
    );
  };

  const getVehicleBadge = (type) => {
    if (type === '2 Wheeler') return <Badge variant="primary">{t('services:twoWheeler')}</Badge>;
    if (type === '4 Wheeler') return <Badge variant="warning">{t('services:fourWheeler')}</Badge>;
    return <Badge variant="success">{t('services:bothCategories')}</Badge>;
  };

  const stats = [
    { title: t('services:totalServices'), value: servicesList.length.toString(), icon: Wrench, color: 'blue' },
    { title: t('services:twoWheeler'), value: servicesList.filter(s => s.vehicleType === '2 Wheeler' || s.vehicleType === 'Both').length.toString(), icon: Bike, color: 'primary' },
    { title: t('services:fourWheeler'), value: servicesList.filter(s => s.vehicleType === '4 Wheeler' || s.vehicleType === 'Both').length.toString(), icon: Car, color: 'warning' },
    { title: t('services:bothCategories'), value: servicesList.filter(s => s.vehicleType === 'Both').length.toString(), icon: Truck, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('services:title')} 
        breadcrumbs={['GMS', t('services:title')]}
        actions={
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            {t('services:addService')}
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <StatCard key={idx} {...s} />
        ))}
      </div>

      <div className="surface-card">
        <div className="p-4 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
               <input 
                 placeholder={t('services:searchPlaceholder')} 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm w-64 outline-none focus:border-primary transition-smooth" 
               />
             </div>
             <ExportButton 
               data={filteredServices} 
               filename="services_list" 
               columns={[
                 { header: t('services:serviceName'), accessor: 'name' },
                 { header: t('services:vehicleType'), accessor: 'vehicleType' },
                 { header: t('services:description'), accessor: 'description' },
               ]} 
             />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                <th className="p-4">{t('services:serviceName')}</th>
                <th className="p-4">{t('services:vehicleType')}</th>
                <th className="p-4">{t('services:description')}</th>
                <th className="p-4 text-right">{t('services:actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-white/5 transition-smooth group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center">
                          {getVehicleIcon(service.vehicleType)}
                        </div>
                        <p className="text-white font-bold text-sm">{service.name}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {getVehicleBadge(service.vehicleType)}
                    </td>
                    <td className="p-4 text-muted text-sm max-w-xs truncate">{service.description || t('services:noDescription')}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-smooth">
                        <button 
                          onClick={() => handleOpenModal(service)}
                          title={t('services:editService')} 
                          className="p-1.5 text-muted hover:text-warning"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteService(service.id)} 
                          title={t('services:delete')} 
                          className="p-1.5 text-muted hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-muted italic">
                    {t('services:noServicesFound')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Wrench size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{editingService ? t('services:editService') : t('services:addService')}</h3>
                  <p className="text-xs text-muted">{editingService ? t('services:updateDetails') : t('services:registerNew')}</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-2 text-muted hover:text-white rounded-lg hover:bg-white/5 transition-smooth">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                  <Tag size={12} className="text-primary" /> {t('services:serviceName')}
                </label>
                <input 
                  required
                  placeholder={t('services:serviceNamePlaceholder')}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-smooth"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                  <Truck size={12} className="text-primary" /> {t('services:vehicleType')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['2 Wheeler', '4 Wheeler', 'Both'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, vehicleType: type})}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-smooth ${
                        formData.vehicleType === type 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-background border-border text-muted hover:border-white/20'
                      }`}
                    >
                      {type === '2 Wheeler' && <Bike size={20} />}
                      {type === '4 Wheeler' && <Car size={20} />}
                      {type === 'Both' && <Truck size={20} />}
                      <span className="text-xs font-medium">
                        {type === '2 Wheeler' ? t('services:twoWheeler') : 
                         type === '4 Wheeler' ? t('services:fourWheeler') : 
                         t('services:bothCategories')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                  {t('services:description')}
                </label>
                <textarea 
                  placeholder={t('services:descriptionPlaceholder')}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-smooth resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-border text-muted hover:text-white hover:bg-white/5 rounded-xl text-sm font-bold transition-smooth uppercase tracking-widest"
                >
                  {t('services:cancel')}
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth text-sm font-bold shadow-xl shadow-primary/20 uppercase tracking-widest"
                >
                  {editingService ? t('services:updateService') : t('services:saveService')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
