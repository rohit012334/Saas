import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
   Settings as SettingsIcon, Store, Users, Bell,
   FileText, Shield, Save, Upload, Lock,
   ExternalLink, Globe, Mail, Loader2
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import api from '@/lib/axios';
import { useTenantStore } from '@/store/useTenantStore';

const Settings = () => {
   const { t } = useTranslation();
   const logoInputRef = useRef(null);
   const { settings: globalSettings, fetching: globalFetching, updateSettings } = useTenantStore();

   const tabKeys = ['platformSettings', 'usersRoles', 'notifications', 'invoiceSettings', 'dataSecurity'];
   const [activeTab, setActiveTab] = useState(tabKeys[0]);
   const [loading, setLoading] = useState(false);

   // Editable fields only
   const [form, setForm] = useState({
      garageEmail: '',
      garageAddress: '',
   });

   const [logoFile, setLogoFile] = useState(null);
   const [logoPreview, setLogoPreview] = useState('');

   // Sync from global store when it loads
   useEffect(() => {
      if (globalSettings) {
         setForm({
            garageEmail: globalSettings.garageEmail || '',
            garageAddress: globalSettings.garageAddress || '',
         });
         setLogoPreview(globalSettings.garageLogoUrl || '');
      }
   }, [globalSettings]);

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
   };

   const handleLogoChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setLogoFile(file);
         const reader = new FileReader();
         reader.onloadend = () => setLogoPreview(reader.result);
         reader.readAsDataURL(file);
      }
   };

   const handleSave = async () => {
      setLoading(true);
      try {
         const formData = new FormData();
         formData.append('garageEmail', form.garageEmail);
         formData.append('garageAddress', form.garageAddress);
         if (logoFile) {
            formData.append('logo', logoFile);
         }

         const response = await api.patch('/tenant-settings/platform', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         });

         if (response.data.success) {
            alert('Settings saved successfully!');
            updateSettings(response.data.data);
            setLogoFile(null);
         }
      } catch (err) {
         alert(err.response?.data?.message || 'Failed to save settings');
      } finally {
         setLoading(false);
      }
   };

   const tabIcons = {
      platformSettings: Globe,
      usersRoles: Users,
      notifications: Bell,
      invoiceSettings: FileText,
      dataSecurity: Shield
   };

   if (globalFetching && !globalSettings?.garageEmail && !globalSettings?.garageName) {
      return (
         <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 size={40} className="text-primary animate-spin" />
            <p className="text-muted font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Loading Settings...</p>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <PageHeader
            title={t('sidebar:settings')}
            breadcrumbs={['GMS', t('sidebar:settings')]}
            actions={
               <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-smooth font-bold text-sm shadow-xl shadow-primary/20 uppercase tracking-widest disabled:opacity-50"
               >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
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

                     {/* Branding Section */}
                     <div className="surface-card p-6">
                        <h3 className="font-bold text-lg mb-6 border-b border-border pb-4 uppercase tracking-widest text-primary/80">
                           {t('settings:platformBranding')}
                        </h3>

                        {/* Logo + Garage/Owner Info */}
                        <div className="flex items-start gap-8 mb-8">
                           {/* Logo Upload */}
                           <div
                              onClick={() => logoInputRef.current?.click()}
                              className="w-24 h-24 rounded-2xl bg-surface border-2 border-dashed border-border flex flex-col items-center justify-center text-muted group hover:border-primary transition-smooth cursor-pointer overflow-hidden relative shrink-0"
                           >
                              {logoPreview ? (
                                 <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                              ) : (
                                 <>
                                    <Upload size={24} className="mb-2 group-hover:text-primary transition-smooth" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{t('settings:logo')}</span>
                                 </>
                              )}
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                                 <Upload size={20} className="text-white" />
                              </div>
                              <input
                                 type="file"
                                 ref={logoInputRef}
                                 onChange={handleLogoChange}
                                 accept="image/*"
                                 className="hidden"
                              />
                           </div>

                           {/* Read-only Info */}
                           <div className="flex-1 space-y-3">
                              <h4 className="font-bold text-white text-lg">{globalSettings?.garageName || '—'}</h4>
                              <p className="text-sm text-muted">Owner: <span className="text-white font-medium">{globalSettings?.ownerName || '—'}</span></p>
                              <button
                                 onClick={() => logoInputRef.current?.click()}
                                 className="text-xs font-bold text-primary hover:underline transition-smooth"
                              >
                                 {t('settings:changeLogo')}
                              </button>
                              <div className="flex items-center gap-2 text-[10px] text-muted/70 bg-white/5 rounded-lg px-3 py-2 w-fit border border-white/10">
                                 <Lock size={11} />
                                 Garage Name & Owner Name are managed by Super Admin
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Editable Contact Info */}
                     <div className="surface-card p-6">
                        <h3 className="font-bold text-lg mb-6 border-b border-border pb-4 uppercase tracking-widest text-primary/80">
                           {t('settings:general')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {/* Garage Email - editable */}
                           <div className="space-y-2">
                              <label className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center gap-1.5">
                                 <Mail size={11} />
                                 Garage Email
                              </label>
                              <input
                                 name="garageEmail"
                                 type="email"
                                 value={form.garageEmail}
                                 onChange={handleInputChange}
                                 placeholder="e.g. contact@mygarage.com"
                                 className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth shadow-inner"
                              />
                           </div>

                           {/* Garage Name - read-only */}
                           <div className="space-y-2">
                              <label className="text-[10px] text-muted/60 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                 <Lock size={11} />
                                 {t('settings:garageName')} (Read-only)
                              </label>
                              <input
                                 value={globalSettings?.garageName || ''}
                                 readOnly
                                 className="w-full bg-surface/30 border border-border/40 rounded-xl px-4 py-3 text-sm text-muted/60 cursor-not-allowed outline-none"
                              />
                           </div>

                           {/* Owner Name - read-only */}
                           <div className="space-y-2">
                              <label className="text-[10px] text-muted/60 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                 <Lock size={11} />
                                 Owner Name (Read-only)
                              </label>
                              <input
                                 value={globalSettings?.ownerName || ''}
                                 readOnly
                                 className="w-full bg-surface/30 border border-border/40 rounded-xl px-4 py-3 text-sm text-muted/60 cursor-not-allowed outline-none"
                              />
                           </div>

                           {/* Garage Address - editable, full width */}
                           <div className="col-span-1 md:col-span-2 space-y-2">
                              <label className="text-[10px] text-muted font-bold uppercase tracking-widest">
                                 {t('settings:address')}
                              </label>
                              <textarea
                                 rows={3}
                                 name="garageAddress"
                                 value={form.garageAddress}
                                 onChange={handleInputChange}
                                 placeholder="e.g. Shop 12, Industrial Zone, Dubai, UAE"
                                 className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-smooth resize-none shadow-inner"
                              ></textarea>
                           </div>
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
