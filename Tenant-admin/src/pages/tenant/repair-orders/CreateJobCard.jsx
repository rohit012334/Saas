import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Search, UserPlus, Car, User,
  Wrench, ClipboardCheck, Calculator, Trash2
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useNavigate } from 'react-router-dom';

import { employees } from '@/data/dummyData';

const CreateJobCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [labour, setLabour] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);

  // Filter only mechanics
  const mechanics = employees.filter(e => e.role === 'Mechanic');

  const addPart = () => setParts([...parts, { id: Date.now(), name: '', qty: 1, price: 0, total: 0 }]);
  const addLabour = () => setLabour([...labour, { id: Date.now(), desc: '', hours: 1, rate: 500, total: 500 }]);

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title={t('repairOrders:createJobCard')}
        breadcrumbs={['GMS', t('sidebar:repairOrders'), t('repairOrders:createJobCard')]}
        onBack={() => navigate('/repair-orders')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Vehicle Info */}
        <div className="surface-card p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Car size={20} />
            <h3 className="font-bold">{t('repairOrders:vehicleInfo')}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted font-bold uppercase">{t('repairOrders:vehicleNo')}</label>
              <input placeholder="Ex: DL 1CA 1234" className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted font-bold uppercase">{t('repairOrders:make')}</label>
              <input placeholder="Ex: Honda" className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted font-bold uppercase">{t('repairOrders:model')}</label>
              <input placeholder="Ex: City" className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted font-bold uppercase">{t('repairOrders:year')}</label>
              <input placeholder="Ex: 2021" className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted font-bold uppercase">{t('repairOrders:vin')}</label>
              <input placeholder="17-digit VIN" className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted font-bold uppercase">{t('repairOrders:mileage')}</label>
              <input placeholder="Ex: 12000" className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth" />
            </div>
          </div>
        </div>

        {/* Section 2: Customer Info */}
        <div className="surface-card p-6 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-primary">
              <User size={20} />
              <h3 className="font-bold">{t('repairOrders:customerInfo')}</h3>
            </div>
            <button className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1">
              <UserPlus size={12} /> {t('repairOrders:newCustomer')}
            </button>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input placeholder={t('repairOrders:searchCustomer')} className="w-full bg-surface/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted font-bold uppercase">{t('common:name')}</label>
                <input className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted font-bold uppercase">{t('common:phone')}</label>
                <input className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted font-bold uppercase">{t('common:address')}</label>
              <textarea rows={2} className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Section 3: Service Info & Assignment */}
        <div className="surface-card p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Wrench size={20} />
            <h3 className="font-bold">{t('repairOrders:serviceInfo')}</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted font-bold uppercase">{t('repairOrders:complaint')}</label>
              <textarea rows={3} placeholder={t('repairOrders:complaintsPlaceholder')} className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth resize-none"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted font-bold uppercase">{t('repairOrders:serviceType')}</label>
                <select className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth appearance-none">
                  <option>{t('repairOrders:generalService')}</option>
                  <option>{t('repairOrders:repair')}</option>
                  <option>{t('repairOrders:electrical')}</option>
                  <option>{t('repairOrders:bodyWork')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted font-bold uppercase">{t('repairOrders:priority')}</label>
                <div className="flex gap-2">
                  {[
                    { label: t('repairOrders:normal'), value: 'Normal' },
                    { label: t('repairOrders:urgent'), value: 'Urgent' },
                    { label: t('repairOrders:express'), value: 'Express' }
                  ].map(p => (
                    <button key={p.value} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-smooth ${p.value === 'Normal' ? 'bg-primary text-white border-primary' : 'border-border text-muted hover:text-white'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h4 className="text-xs font-bold text-muted uppercase flex items-center gap-2">
                <User size={14} className="text-primary" /> {t('repairOrders:mechanic')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <select className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth" onChange={(e) => setSelectedMechanic(mechanics.find(m => m.id === e.target.value))}>
                    <option value="">{t('repairOrders:assignMechanic')}</option>
                    {mechanics.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                {selectedMechanic && (
                  <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl animate-in fade-in slide-in-from-left duration-300">
                    <img src={selectedMechanic.avatar} className="w-10 h-10 rounded-full border border-primary/20" alt="avatar" />
                    <div>
                      <p className="text-xs font-bold text-white">{selectedMechanic.name}</p>
                      <p className="text-[10px] text-primary">{selectedMechanic.skills.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted font-bold uppercase">{t('common:delivery')}</label>
              <input type="datetime-local" className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth" />
            </div>
          </div>
        </div>

        {/* Section 4: Pre-inspection */}
        <div className="surface-card p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <ClipboardCheck size={20} />
            <h3 className="font-bold">{t('repairOrders:preInspection')}</h3>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
            {[
              { label: t('repairOrders:fuelLevel'), key: 'fuelLevel' },
              { label: t('repairOrders:spareTyre'), key: 'spareTyre' },
              { label: t('repairOrders:toolKit'), key: 'toolKit' },
              { label: t('repairOrders:jack'), key: 'jack' },
              { label: t('repairOrders:documents'), key: 'documents' },
              { label: t('repairOrders:scratchesDents'), key: 'scratchesDents' },
              { label: t('repairOrders:acCheck'), key: 'acCheck' },
              { label: t('repairOrders:lightsCheck'), key: 'lightsCheck' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-2 bg-surface/30 rounded-lg border border-border/50">
                <span className="text-sm text-balance">{item.label}</span>
                <div className="w-10 h-5 bg-surface border border-border rounded-full relative cursor-pointer group">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-muted rounded-full group-hover:bg-primary transition-smooth"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted font-bold uppercase">{t('common:remarks')}</label>
            <textarea rows={2} className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-smooth resize-none"></textarea>
          </div>
        </div>
      </div>

      {/* Section 5: Initial Estimate */}
      <div className="surface-card p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-primary">
            <Calculator size={20} />
            <h3 className="font-bold">{t('repairOrders:initialEstimate')}</h3>
          </div>
          <div className="flex gap-4">
            <button onClick={addPart} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              <Plus size={14} /> {t('repairOrders:parts')}
            </button>
            <button onClick={addLabour} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              <Plus size={14} /> {t('repairOrders:labour')}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 text-xs font-bold text-muted uppercase px-4">
            <div className="col-span-6">{t('common:description')}</div>
            <div className="col-span-2">{t('common:quantity')} / {t('common:hours')}</div>
            <div className="col-span-2">{t('common:price')} / {t('common:rate')}</div>
            <div className="col-span-1">{t('repairOrders:total')}</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-surface/30">
            {parts.map(p => (
              <div key={p.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-6"><input placeholder={t('repairOrders:partNamePlaceholder')} className="w-full bg-transparent border-none outline-none text-sm text-white" /></div>
                <div className="col-span-2"><input type="number" defaultValue={1} className="w-full bg-transparent border-none outline-none text-sm text-white" /></div>
                <div className="col-span-2"><input type="number" placeholder="0.00" className="w-full bg-transparent border-none outline-none text-sm text-white" /></div>
                <div className="col-span-1 text-sm font-bold">₹0</div>
                <div className="col-span-1 flex justify-end">
                  <button className="text-muted hover:text-danger"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {labour.map(l => (
              <div key={l.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-4"><input placeholder={t('repairOrders:labourTaskPlaceholder')} className="w-full bg-transparent border-none outline-none text-sm text-white" value={l.desc} onChange={(e) => setLabour(labour.map(item => item.id === l.id ? { ...item, desc: e.target.value } : item))} /></div>
                <div className="col-span-3">
                  <select
                    className="w-full bg-surface border border-border/50 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-primary"
                    value={l.mechanicId}
                    onChange={(e) => setLabour(labour.map(item => item.id === l.id ? { ...item, mechanicId: e.target.value } : item))}
                  >
                    <option value="">{t('repairOrders:assignMechanic')}</option>
                    {mechanics.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2"><input type="number" value={l.hours} onChange={(e) => setLabour(labour.map(item => item.id === l.id ? { ...item, hours: e.target.value, total: e.target.value * item.rate } : item))} className="w-full bg-transparent border-none outline-none text-sm text-white" /></div>
                <div className="col-span-2 text-sm font-bold text-white">₹{l.total}</div>
                <div className="col-span-1 flex justify-end">
                  <button onClick={() => setLabour(labour.filter(item => item.id !== l.id))} className="text-muted hover:text-danger"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {(parts.length === 0 && labour.length === 0) && (
              <div className="p-8 text-center text-muted text-sm italic">
                {t('repairOrders:addItemsPrompt')}
              </div>
            )}
          </div>
        </div>

        {/* <div className="flex justify-end pt-6 border-t border-border">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="text-white font-medium">₹0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">GST (18%)</span>
              <span className="text-white font-medium">₹0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
              <span className="text-white">Estimate Total</span>
              <span className="text-primary font-bold">₹0.00</span>
            </div>
          </div>
        </div> */}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border z-30 ml-[260px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-border bg-surface text-primary" />
              <span className="text-xs text-muted">{t('repairOrders:sendToCustomer')}</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/repair-orders')} className="px-6 py-2 text-sm font-bold text-muted hover:text-white transition-smooth uppercase tracking-wider">{t('common:cancel')}</button>
            <button className="px-8 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm shadow-xl shadow-primary/20 uppercase tracking-widest">
              {t('repairOrders:createJobCard')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobCard;
