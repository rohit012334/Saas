import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
   User, Mail, Phone, Calendar,
   MapPin, Clock, Award, FileText,
   ChevronRight, Edit2, TrendingUp, Plus, ShieldCheck
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { employees } from '@/data/dummyData';

const EmployeeDetail = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { t } = useTranslation();
   const [activeTab, setActiveTab] = useState(t('hr:profile'));

   const emp = employees.find(e => e.id === id) || employees[2]; // Default to mechanic

   const tabs = [t('hr:profile'), t('hr:documents')];

   return (
      <div className="space-y-6">
         <PageHeader
            title={emp.name}
            breadcrumbs={['GMS', t('sidebar:hrManagement'), emp.name]}
            onBack={() => navigate('/hr')}
            actions={
               <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-muted hover:text-white transition-smooth font-bold text-sm">
                  <Edit2 size={18} />
                  {t('hr:editProfile')}
               </button>
            }
         />

         <div className="surface-card p-6 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-primary/5 to-transparent">
            <img src={emp.avatar} className="w-24 h-24 rounded-full border-2 border-primary shadow-xl shadow-primary/10" alt="avatar" />
            <div className="flex-1 text-center md:text-left space-y-2">
               <h2 className="text-2xl font-bold text-white">{emp.name}</h2>
               <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Badge variant="purple" className="px-3 py-1 font-bold">{emp.role}</Badge>
                  <Badge variant="success">{t('hr:active')}</Badge>
                  <span className="text-xs text-muted flex items-center gap-1"><Clock size={12} /> {t('hr:joinDate')}: {emp.joinDate}</span>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="surface-card px-6 py-4 border-white/5 bg-white/5 text-center">
                  <p className="text-xl font-black text-white">4.8</p>
                  <p className="text-[10px] text-muted uppercase">{t('hr:rating')}</p>
               </div>
               <div className="surface-card px-6 py-4 border-white/5 bg-white/5 text-center">
                  <p className="text-xl font-black text-white">124</p>
                  <p className="text-[10px] text-muted uppercase">{t('hr:jobs')}</p>
               </div>
            </div>
         </div>

         <div className="flex gap-4 border-b border-border mb-6">
            {tabs.map(tab => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-bold transition-smooth relative ${activeTab === tab ? 'text-primary' : 'text-muted hover:text-white'}`}
               >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
               </button>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
               {activeTab === t('hr:profile') && (
                  <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="surface-card p-6 space-y-4">
                           <h4 className="text-xs font-bold text-muted uppercase flex items-center gap-2"><User size={14} className="text-primary" /> {t('hr:personalInfo')}</h4>
                           <div className="space-y-3">
                              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-sm text-muted">{t('hr:fullName')}</span><span className="text-sm font-bold text-white">{emp.name}</span></div>
                              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-sm text-muted">{t('hr:phone')}</span><span className="text-sm text-white">{emp.phone}</span></div>
                              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-sm text-muted">{t('hr:email')}</span><span className="text-sm text-white">rajesh@example.com</span></div>
                              <div className="flex justify-between"><span className="text-sm text-muted">{t('hr:joinDate')}</span><span className="text-sm text-white">{emp.joinDate}</span></div>
                           </div>
                        </div>
                        <div className="surface-card p-6 space-y-4">
                           <h4 className="text-xs font-bold text-muted uppercase flex items-center gap-2"><Award size={14} className="text-primary" /> {t('hr:professionalSkills')}</h4>
                           <div className="flex flex-wrap gap-2">
                              {emp.skills.map(skill => (
                                 <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold">
                                    {skill}
                                 </span>
                              ))}
                           </div>
                           <div className="pt-4 space-y-2">
                              <p className="text-[10px] text-muted uppercase font-bold">{t('hr:certificationStatus')}</p>
                              <div className="flex items-center gap-2 text-xs text-success font-bold">
                                 <ShieldCheck size={16} /> {t('hr:verifiedExpert')}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="surface-card p-6">
                        <h4 className="text-xs font-bold text-muted uppercase mb-4">{t('hr:biography')}</h4>
                        <p className="text-sm text-white leading-relaxed bg-surface/50 p-6 rounded-xl border border-border">
                           {t('hr:biographyText')}
                        </p>
                     </div>
                  </div>
               )}

               {activeTab === t('hr:documents') && (
                  <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="surface-card p-6 border-border flex items-center justify-between group hover:border-primary transition-smooth cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-danger/10 text-danger rounded-xl">
                                 <FileText size={24} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white">{t('hr:aadhaarCard')}</p>
                                 <p className="text-[10px] text-muted">{t('hr:uploadedOn')} 12 Jan 2024</p>
                              </div>
                           </div>
                           <button className="text-xs font-bold text-primary hover:underline">{t('common:view')}</button>
                        </div>
                        <div className="surface-card p-6 border-border flex items-center justify-between group hover:border-primary transition-smooth cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-info/10 text-info rounded-xl">
                                 <FileText size={24} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white">{t('hr:panCard')}</p>
                                 <p className="text-[10px] text-muted">{t('hr:uploadedOn')} 12 Jan 2024</p>
                              </div>
                           </div>
                           <button className="text-xs font-bold text-primary hover:underline">{t('common:view')}</button>
                        </div>
                        <div className="surface-card p-6 border-border flex items-center justify-between group hover:border-primary transition-smooth cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-success/10 text-success rounded-xl">
                                 <Award size={24} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white">{t('hr:itiCertification')}</p>
                                 <p className="text-[10px] text-muted">{t('hr:uploadedOn')} 15 Jan 2024</p>
                              </div>
                           </div>
                           <button className="text-xs font-bold text-primary hover:underline">{t('common:view')}</button>
                        </div>
                        <div className="surface-card p-6 border-border flex items-center justify-between group hover:border-primary transition-smooth cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-warning/10 text-warning rounded-xl">
                                 <FileText size={24} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white">{t('hr:drivingLicense')}</p>
                                 <p className="text-[10px] text-muted">{t('hr:uploadedOn')} 12 Jan 2024</p>
                              </div>
                           </div>
                           <button className="text-xs font-bold text-primary hover:underline">{t('common:view')}</button>
                        </div>
                     </div>

                     <div className="surface-card p-8 border-dashed border-border flex flex-col items-center gap-4 justify-center bg-white/5">
                        <div className="p-4 bg-primary/10 text-primary rounded-full">
                           <Plus size={32} />
                        </div>
                        <div className="text-center">
                           <p className="text-sm font-bold text-white">{t('hr:uploadNew')}</p>
                           <p className="text-xs text-muted mt-1">{t('hr:fileFormatLimit')}</p>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab !== t('hr:profile') && activeTab !== t('hr:documents') && (
                  <div className="surface-card p-20 text-center flex flex-col items-center gap-4">
                     <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <TrendingUp size={32} />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white">{activeTab} {t('common:for')} {emp.name}</h3>
                        <p className="text-muted text-sm max-w-sm mx-auto mt-2">{t('hr:loadingPerformance')}</p>
                     </div>
                  </div>
               )}
            </div>

            {/* <div className="lg:col-span-4 space-y-6">
            <div className="surface-card p-6">
               <h3 className="font-bold text-sm mb-6 flex items-center gap-2">
                  <Clock size={16} className="text-primary" /> {t('hr:todaysSchedule')}
               </h3>
               <div className="space-y-4 relative pl-4 border-l-2 border-border/50">
                  <div className="relative">
                     <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-success"></div>
                     <p className="text-xs font-bold text-white">09:00 AM — {t('hr:punchIn')}</p>
                  </div>
                  <div className="relative">
                     <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
                     <p className="text-xs font-bold text-primary">10:30 AM — Engine Service (DL 1C...)</p>
                  </div>
                  <div className="relative">
                     <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-muted"></div>
                     <p className="text-xs text-muted">02:00 PM — {t('hr:scheduledBreak')}</p>
                  </div>
               </div>
            </div>

            <div className="glass-card p-6 border-success/20 bg-success/5">
               <h4 className="text-sm font-bold text-success mb-2">{t('hr:performanceBonus')}</h4>
               <p className="text-xs text-muted mb-4">{t('hr:topTechnicianText')}</p>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted uppercase">{t('hr:potentialBonus')}</span>
                  <span className="text-sm font-black text-success">₹4,500</span>
               </div>
            </div>
         </div> */}
         </div>
      </div>
   );
};

export default EmployeeDetail;
