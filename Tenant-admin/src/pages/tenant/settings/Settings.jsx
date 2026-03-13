import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
   Settings as SettingsIcon, Store, Users, Bell,
   Link, FileText, Shield, Save, Upload,
   Trash2, Plus, Check, ExternalLink
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { garageInfo } from '@/data/dummyData';

const Settings = () => {
   const { t } = useTranslation();

   const tabKeys = ['garageProfile', 'usersRoles', 'notifications', 'invoiceSettings', 'dataSecurity'];
   const [activeTab, setActiveTab] = useState(tabKeys[0]);

   const tabIcons = {
      garageProfile: Store,
      usersRoles: Users,
      notifications: Bell,
      invoiceSettings: FileText,
      dataSecurity: Shield
   };

   const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

   return (
      <div className="space-y-6">
         <PageHeader
            title={t('sidebar:settings')}
            breadcrumbs={['GMS', t('sidebar:settings')]}
            actions={
               <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm shadow-xl shadow-primary/20 uppercase tracking-widest">
                  <Save size={18} />
                  {t('common:save')}
               </button>
            }
         />

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Settings Navigation */}
            <div className="lg:col-span-3 surface-card p-4 space-y-1">
               {tabKeys.map(tabKey => {
                  const Icon = tabIcons[tabKey];
                  return (
                     <button
                        key={tabKey}
                        onClick={() => setActiveTab(tabKey)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth text-sm font-bold ${activeTab === tabKey ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'}`}
                     >
                        <Icon size={18} />
                        {t(`settings:${tabKey}`)}
                     </button>
                  );
               })}
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-9 space-y-8 animate-in slide-in-from-right-4 duration-500">
               {activeTab === 'garageProfile' && (
                  <div className="space-y-6">
                     <div className="surface-card p-6">
                        <h3 className="font-bold text-lg mb-6 border-b border-border pb-4">{t('settings:garageInformation')}</h3>
                        <div className="flex items-center gap-8 mb-8">
                           <div className="w-24 h-24 rounded-2xl bg-surface border-2 border-dashed border-border flex flex-col items-center justify-center text-muted group hover:border-primary transition-smooth cursor-pointer">
                              <Upload size={24} className="mb-2 group-hover:text-primary" />
                              <span className="text-[10px] font-bold uppercase">{t('settings:logo')}</span>
                           </div>
                           <div className="flex-1 space-y-2">
                              <h4 className="font-bold text-white">{t('settings:garageBranding')}</h4>
                              <p className="text-xs text-muted">{t('settings:uploadLogoDesc')}</p>
                              <button className="text-xs font-bold text-primary hover:underline">{t('settings:changeLogo')}</button>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs text-muted font-bold uppercase">{t('settings:garageName')}</label>
                              <input defaultValue={garageInfo.name} className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary transition-smooth" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs text-muted font-bold uppercase">{t('settings:ownerName')}</label>
                              <input defaultValue={garageInfo.owner} className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary transition-smooth" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs text-muted font-bold uppercase">{t('settings:phoneNumber')}</label>
                              <input defaultValue={garageInfo.phone} className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary transition-smooth" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs text-muted font-bold uppercase">{t('settings:gstNumber')}</label>
                              <input defaultValue={garageInfo.gstNo} className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary transition-smooth" />
                           </div>
                           <div className="col-span-2 space-y-2">
                              <label className="text-xs text-muted font-bold uppercase">{t('settings:address')}</label>
                              <textarea rows={3} defaultValue="12/A, Industrial Area, Phase 1, Near Metro Station" className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary transition-smooth resize-none"></textarea>
                           </div>
                        </div>
                     </div>

                     <div className="surface-card p-6">
                        <h3 className="font-bold text-lg mb-6 border-b border-border pb-4">{t('settings:workingHours')}</h3>
                        <div className="space-y-3">
                           {dayKeys.map(dayKey => (
                              <div key={dayKey} className="flex items-center justify-between p-3 bg-surface/30 rounded-xl border border-border">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                                       <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                    <span className="text-sm font-bold text-white">{t(`settings:${dayKey}`)}</span>
                                 </div>
                                 <div className="flex items-center gap-4 text-xs">
                                    <span className="text-muted">09:00 AM</span>
                                    <span className="text-muted">—</span>
                                    <span className="text-muted">07:00 PM</span>
                                    <button className="text-primary hover:underline ml-4">{t('common:edit')}</button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

            </div>
         </div>
      </div>
   );
};

export default Settings;
