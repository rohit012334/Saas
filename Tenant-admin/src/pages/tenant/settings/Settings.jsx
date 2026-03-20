import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
   Settings as SettingsIcon, Store, Users, Bell,
   Link, FileText, Shield, Save, Upload,
   Trash2, Plus, Check, ExternalLink, Globe, Mail
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { garageInfo } from '@/data/dummyData';

const Settings = () => {
   const { t } = useTranslation();

   const tabKeys = ['platformSettings', 'usersRoles', 'notifications', 'invoiceSettings', 'dataSecurity'];
   const [activeTab, setActiveTab] = useState(tabKeys[0]);

   const tabIcons = {
      platformSettings: Globe,
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
 
               {activeTab === 'platformSettings' && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                     {/* General Settings */}
                     <div className="surface-card p-6">
                        <h3 className="font-bold text-lg mb-6 border-b border-border pb-4 uppercase tracking-widest text-primary/80">{t('settings:general')}</h3>
                        
                        <div className="flex items-center gap-8 mb-8">
                           <div className="w-24 h-24 rounded-2xl bg-surface border-2 border-dashed border-border flex flex-col items-center justify-center text-muted group hover:border-primary transition-smooth cursor-pointer">
                              <Upload size={24} className="mb-2 group-hover:text-primary transition-smooth" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{t('settings:logo')}</span>
                           </div>
                           <div className="flex-1 space-y-2">
                              <h4 className="font-bold text-white text-lg">{t('settings:platformBranding')}</h4>
                              <p className="text-sm text-muted">Customize your platform logo and name for your customers and reports.</p>
                              <button className="text-xs font-bold text-primary hover:underline transition-smooth">{t('settings:changeLogo')}</button>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('settings:garageName')}</label>
                              <input defaultValue={garageInfo.name} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth shadow-inner" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('settings:ownerName')}</label>
                              <input defaultValue={garageInfo.owner} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth shadow-inner" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('settings:phoneNumber')}</label>
                              <input defaultValue={garageInfo.phone} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth shadow-inner" />
                           </div>
                           <div className="col-span-1 md:col-span-2 space-y-2">
                              <label className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('settings:address')}</label>
                              <textarea rows={2} defaultValue="12/A, Industrial Area, Phase 1, Near Metro Station" className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth resize-none shadow-inner"></textarea>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('settings:defaultLanguage')}</label>
                              <div className="relative">
                                 <select className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth appearance-none cursor-pointer text-sm">
                                    <option value="en">English (US)</option>
                                    <option value="ar">Arabic (العربية)</option>
                                 </select>
                                 <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('settings:currency')}</label>
                              <select className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth appearance-none cursor-pointer text-sm">
                                 <option value="USD">USD ($)</option>
                                 <option value="AED">AED (د.إ)</option>
                                 <option value="SAR">SAR (ر.س)</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     {/* Email Configuration */}
                     <div className="surface-card p-6">
                        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                           <h3 className="font-bold text-lg flex items-center gap-2 uppercase tracking-widest text-primary/80">
                              <Mail size={20} className="text-primary" />
                              {t('settings:emailConfig')}
                           </h3>
                           <Badge variant="success">SMTP Connected</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('settings:smtpHost')}</label>
                              <input placeholder="smtp.gmail.com" className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth shadow-inner" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('settings:smtpPort')}</label>
                              <input placeholder="587" className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth shadow-inner" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('settings:smtpUser')}</label>
                              <input placeholder="notifications@yourdomain.com" className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth shadow-inner" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] text-muted font-bold uppercase tracking-widest">{t('settings:smtpPass')}</label>
                              <input type="password" placeholder="••••••••••••" className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth shadow-inner" />
                           </div>
                        </div>
                        
                        <div className="mt-8 flex justify-end">
                           <button className="text-xs font-bold text-primary flex items-center gap-2 hover:bg-primary/5 px-6 py-3 rounded-xl transition-smooth border border-primary/20 hover:border-primary shadow-lg shadow-primary/5 group">
                              Send Test Email
                              <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-smooth" />
                           </button>
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
