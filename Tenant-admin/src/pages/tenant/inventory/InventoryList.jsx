import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Package, AlertCircle, ShoppingCart, IndianRupee, 
  Search, Plus, Edit2, RotateCcw, History, X, Trash2, Tag, Layers, BarChart3
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { ExportButton } from '@/components/shared/ExportButton';
import { DateFilter } from '@/components/shared/DateFilter';
import { parts as initialParts } from '@/data/dummyData';

const InventoryList = () => {
  const { t } = useTranslation();
  const [partsList, setPartsList] = useState(initialParts);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPart, setNewPart] = useState({
    name: '',
    category: t('inventory:engineParts'),
    stock: '',
    minStock: '5',
    unitPrice: '',
    sku: '',
    location: 'Main Shelf'
  });

  const filteredParts = useMemo(() => {
    return partsList.filter(part => {
      const matchesSearch = 
        part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (dateFilter === 'all') return true;

      // Assuming parts have an 'addedAt' or similar field. 
      // Falling back to true if field is missing for dummy data consistency.
      const partDate = part.addedAt ? new Date(part.addedAt) : new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (dateFilter === 'today') return partDate >= today;
      if (dateFilter === 'yesterday') return partDate >= yesterday && partDate < today;
      if (dateFilter === '7days') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return partDate >= sevenDaysAgo;
      }

      return true;
    });
  }, [partsList, searchQuery, dateFilter]);

  const handleAddPart = (e) => {
    e.preventDefault();
    const part = {
      ...newPart,
      id: (partsList.length + 1).toString(),
      stock: parseInt(newPart.stock),
      minStock: parseInt(newPart.minStock),
      unitPrice: parseInt(newPart.unitPrice),
      sku: newPart.sku || `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };
    setPartsList([part, ...partsList]);
    setIsModalOpen(false);
    setNewPart({ name: '', category: t('inventory:engineParts'), stock: '', minStock: '5', unitPrice: '', sku: '', location: 'Main Shelf' });
  };

  const handleDeletePart = (id) => {
    if (window.confirm(t('inventory:deleteConfirm'))) {
      setPartsList(partsList.filter(p => p.id !== id));
    }
  };

  const handleAdjustStock = (id, amount) => {
    setPartsList(partsList.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p));
  };

  const exportColumns = [
    { header: t('inventory:partName'), accessor: 'name' },
    { header: t('inventory:sku'), accessor: 'sku' },
    { header: t('inventory:category'), accessor: 'category' },
    { header: t('inventory:stock'), accessor: 'stock' },
    { header: t('inventory:unitPrice'), accessor: (item) => `₹${item.unitPrice}` },
  ];

  const stats = [
    { title: t('inventory:totalParts'), value: partsList.length.toString(), icon: Package, color: 'blue' },
    { title: t('inventory:lowStock'), value: partsList.filter(p => p.stock > 0 && p.stock < p.minStock).length.toString(), icon: AlertCircle, color: 'amber' },
    { title: t('inventory:outOfStock'), value: partsList.filter(p => p.stock === 0).length.toString(), icon: ShoppingCart, color: 'red' },
    { title: t('inventory:totalValue'), value: `₹${(partsList.reduce((acc, p) => acc + (p.stock * p.unitPrice), 0) / 100000).toFixed(1)}L`, icon: IndianRupee, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('sidebar:inventory')} 
        breadcrumbs={['GMS', t('sidebar:inventory')]}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            {t('inventory:addPart')}
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
                 placeholder={t('inventory:searchPlaceholder')} 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm w-64 outline-none focus:border-primary transition-smooth" 
               />
             </div>
             <DateFilter onFilterChange={setDateFilter} />
             <ExportButton 
               data={filteredParts} 
               filename="inventory" 
               columns={exportColumns} 
             />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                <th className="p-4">{t('inventory:partName')}</th>
                <th className="p-4">{t('inventory:sku')}</th>
                <th className="p-4">{t('inventory:category')}</th>
                <th className="p-4">{t('inventory:stock')}</th>
                <th className="p-4">{t('inventory:minStock')}</th>
                <th className="p-4">{t('inventory:unitPrice')}</th>
                <th className="p-4">{t('inventory:status')}</th>
                <th className="p-4 text-right">{t('inventory:actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredParts.map((part) => (
                <tr key={part.id} className="hover:bg-white/5 transition-smooth group">
                  <td className="p-4">
                    <p className="text-white font-bold text-sm">{part.name}</p>
                    <p className="text-[10px] text-muted">{part.location}</p>
                  </td>
                  <td className="p-4 text-muted font-mono text-xs">{part.sku}</td>
                  <td className="p-4 text-white text-sm">{part.category}</td>
                  <td className="p-4">
                     <span className={`text-sm font-bold ${part.stock < part.minStock ? 'text-destructive' : 'text-white'}`}>
                        {part.stock}
                     </span>
                  </td>
                  <td className="p-4 text-muted text-sm">{part.minStock}</td>
                  <td className="p-4 text-white font-bold text-sm">₹{part.unitPrice}</td>
                  <td className="p-4">
                     <Badge variant={part.stock === 0 ? 'danger' : part.stock < part.minStock ? 'warning' : 'success'}>
                        {part.stock === 0 ? t('inventory:outOfStockLabel') : part.stock < part.minStock ? t('inventory:lowStockLabel') : t('inventory:inStock')}
                     </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 transition-smooth">
                      <button onClick={() => handleAdjustStock(part.id, 1)} title={t('inventory:addOne')} className="p-1.5 text-muted hover:text-primary"><Plus size={16} /></button>
                      <button onClick={() => handleAdjustStock(part.id, -1)} title={t('inventory:subtractOne')} className="p-1.5 text-muted hover:text-destructive"><RotateCcw size={16} /></button>
                      <button title={t('inventory:edit')} className="p-1.5 text-muted hover:text-warning"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeletePart(part.id)} title={t('inventory:delete')} className="p-1.5 text-muted hover:text-destructive"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Part Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t('inventory:addNewPart')}</h3>
                  <p className="text-xs text-muted">{t('inventory:registerNewPrompt')}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-muted hover:text-white rounded-lg hover:bg-white/5 transition-smooth">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPart} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                  <Tag size={12} className="text-primary" /> {t('inventory:partName')}
                </label>
                <input 
                  required
                  placeholder={t('inventory:partNamePlaceholder')}
                  value={newPart.name}
                  onChange={(e) => setNewPart({...newPart, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-smooth"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                    <Layers size={12} className="text-primary" /> {t('inventory:category')}
                  </label>
                  <select 
                    value={newPart.category}
                    onChange={(e) => setNewPart({...newPart, category: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-smooth appearance-none"
                  >
                    <option value={t('inventory:engineParts')}>{t('inventory:engineParts')}</option>
                    <option value={t('inventory:brakingSystem')}>{t('inventory:brakingSystem')}</option>
                    <option value={t('inventory:suspension')}>{t('inventory:suspension')}</option>
                    <option value={t('inventory:electrical')}>{t('inventory:electrical')}</option>
                    <option value={t('inventory:fluidsOils')}>{t('inventory:fluidsOils')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                    <IndianRupee size={12} className="text-primary" /> {t('inventory:unitPrice')}
                  </label>
                  <input 
                    required
                    type="number"
                    placeholder="2500"
                    value={newPart.unitPrice}
                    onChange={(e) => setNewPart({...newPart, unitPrice: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-smooth"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 size={12} className="text-primary" /> {t('inventory:initialStock')}
                  </label>
                  <input 
                    required
                    type="number"
                    placeholder="20"
                    value={newPart.stock}
                    onChange={(e) => setNewPart({...newPart, stock: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle size={12} className="text-primary" /> {t('inventory:minStockAlert')}
                  </label>
                  <input 
                    required
                    type="number"
                    placeholder="5"
                    value={newPart.minStock}
                    onChange={(e) => setNewPart({...newPart, minStock: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-smooth"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-border text-muted hover:text-white hover:bg-white/5 rounded-xl text-sm font-bold transition-smooth uppercase tracking-widest"
                >
                  {t('common:cancel')}
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth text-sm font-bold shadow-xl shadow-primary/20 uppercase tracking-widest"
                >
                  {t('inventory:savePart')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
