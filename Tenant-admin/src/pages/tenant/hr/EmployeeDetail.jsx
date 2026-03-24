import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
   User, Mail, Phone, Calendar,
   MapPin, Clock, Award, FileText,
   ChevronRight, Edit2, TrendingUp, Plus, ShieldCheck, Download, ExternalLink, ArrowLeft, X
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { staffApi } from '@/utils/api';

const TABS = {
   PROFILE: 'profile',
   DOCUMENTS: 'documents',
   PERFORMANCE: 'performance'
};

const EmployeeDetail = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { t } = useTranslation();
   const [activeTab, setActiveTab] = useState(TABS.PROFILE);
   const [emp, setEmp] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [viewerDoc, setViewerDoc] = useState(null);

   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
   const UPLOADS_BASE_URL = API_BASE_URL.replace('/api', '');

   useEffect(() => {
      const fetchEmployee = async () => {
         try {
            setIsLoading(true);
            const res = await staffApi.getById(id);
            if (res.data.success) {
               setEmp(res.data.data);
            }
         } catch (err) {
            console.error("Failed to fetch employee:", err);
         } finally {
            setIsLoading(false);
         }
      };
      fetchEmployee();
   }, [id]);

   if (isLoading) return <div className="h-96 flex items-center justify-center text-primary font-bold">Loading...</div>;
   if (!emp) return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
         <p className="text-red-500 font-bold">Employee not found</p>
         <button onClick={() => navigate('/hr')} className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft size={16} /> {t('common:backToList') || "Back to list"}
         </button>
      </div>
   );

   const tabs = [
     { id: TABS.PROFILE, label: t('hr:profile') },
     { id: TABS.DOCUMENTS, label: t('hr:documents') },
   ];

   const getDocUrl = (url) => {
     if (!url) return null;
     // Extract just the filename to avoid issues with stale URLs stored in the DB
     const parts = url.split('/');
     const filename = parts[parts.length - 1];
     return `${UPLOADS_BASE_URL}/uploads/${filename}`;
   };

   const documentItems = [
     { id: 'idCardFront', label: t('hr:idCardFront') || 'ID Card Front', url: getDocUrl(emp.idCardFrontUrl), icon: FileText, color: 'danger' },
     { id: 'idCardBack', label: t('hr:idCardBack') || 'ID Card Back', url: getDocUrl(emp.idCardBackUrl), icon: FileText, color: 'danger' },
     { id: 'contract', label: t('hr:contract') || 'Employment Contract', url: getDocUrl(emp.contractUrl), icon: Award, color: 'success' },
     { id: 'otherDoc', label: t('hr:otherDoc') || 'Other Documents', url: getDocUrl(emp.otherDocUrl), icon: FileText, color: 'warning' },
   ].filter(doc => doc.url);

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
            <img 
               src={emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} 
               className="w-24 h-24 rounded-full border-2 border-primary shadow-xl shadow-primary/10" 
               alt="avatar" 
            />
            <div className="flex-1 text-center md:text-left space-y-2">
               <h2 className="text-2xl font-bold text-white">{emp.name}</h2>
               <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Badge variant="purple" className="px-3 py-1 font-bold">{emp.role}</Badge>
                  <Badge variant={emp.isActive ? "success" : "danger"}>{emp.isActive ? t('hr:active') : (t('hr:inactive') || 'Inactive')}</Badge>
                  <span className="text-xs text-muted flex items-center gap-1">
                    <Clock size={12} /> {t('hr:joinDate')}: {new Date(emp.createdAt).toLocaleDateString()}
                  </span>
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
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-bold transition-smooth relative ${activeTab === tab.id ? 'text-primary' : 'text-muted hover:text-white'}`}
               >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
               </button>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
               {activeTab === TABS.PROFILE && (
                  <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="surface-card p-6 space-y-4">
                           <h4 className="text-xs font-bold text-muted uppercase flex items-center gap-2">
                             <User size={14} className="text-primary" /> {t('hr:personalInfo')}
                           </h4>
                           <div className="space-y-3">
                              <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-sm text-muted">{t('hr:fullName')}</span>
                                <span className="text-sm font-bold text-white">{emp.name}</span>
                              </div>
                              <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-sm text-muted">{t('hr:phone')}</span>
                                <span className="text-sm text-white">{emp.phone}</span>
                              </div>
                              <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-sm text-muted">{t('hr:email')}</span>
                                <span className="text-sm text-white">{emp.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted">{t('hr:joinDate')}</span>
                                <span className="text-sm text-white">{new Date(emp.createdAt).toLocaleDateString()}</span>
                              </div>
                           </div>
                        </div>
                        <div className="surface-card p-6 space-y-4">
                           <h4 className="text-xs font-bold text-muted uppercase flex items-center gap-2">
                             <Award size={14} className="text-primary" /> {t('hr:professionalSkills')}
                           </h4>
                           <div className="flex flex-wrap gap-2">
                              {(emp.skills || []).map(skill => (
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
                        <h4 className="text-xs font-bold text-muted uppercase mb-4">{t('hr:address') || "Address"}</h4>
                        <p className="text-sm text-white leading-relaxed bg-surface/50 p-6 rounded-xl border border-border min-h-[100px]">
                           {emp.address || t('hr:noAddressProvided') || "No address provided."}
                        </p>
                     </div>
                  </div>
               )}

               {activeTab === TABS.DOCUMENTS && (
                  <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {documentItems.length > 0 ? (
                          documentItems.map(doc => {
                            const Icon = doc.icon;
                            return (
                              <div key={doc.id} className="surface-card p-6 border-border flex items-center justify-between group hover:border-primary transition-smooth">
                                 <div className="flex items-center gap-4">
                                    <div className={`p-3 bg-${doc.color}/10 text-${doc.color} rounded-xl`}>
                                       <Icon size={24} />
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-white">{doc.label}</p>
                                       <p className="text-[10px] text-muted">{t('hr:verifiedDocument') || "Verified Document"}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <button 
                                     onClick={() => setViewerDoc(doc)}
                                     className="p-2 text-muted hover:text-primary transition-smooth"
                                     title={t('common:view')}
                                   >
                                      <ExternalLink size={16} />
                                   </button>
                                   <a 
                                     href={doc.url} 
                                     download 
                                     className="p-2 text-muted hover:text-primary transition-smooth"
                                     title={t('common:download')}
                                   >
                                      <Download size={16} />
                                   </a>
                                 </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-2 surface-card p-12 text-center text-muted italic">
                            {t('hr:noDocumentsUploaded') || "No documents uploaded for this employee."}
                          </div>
                        )}
                     </div>

                     <div className="surface-card p-8 border-dashed border-border flex flex-col items-center gap-4 justify-center bg-white/5 cursor-pointer hover:bg-white/10 transition-smooth">
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
            </div>
         </div>

         {/* Document Viewer Modal */}
         {viewerDoc && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="relative max-w-4xl w-full bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
               <div className="flex items-center justify-between p-4 border-b border-border bg-white/5">
                 <h3 className="text-sm font-bold text-white uppercase tracking-wider">{viewerDoc.label}</h3>
                 <button 
                   onClick={() => setViewerDoc(null)}
                   className="p-2 text-muted hover:text-white hover:bg-white/10 rounded-full transition-smooth"
                 >
                   <X size={20} />
                 </button>
               </div>
               <div className="p-4 flex items-center justify-center bg-black/20 min-h-[300px]">
                 {viewerDoc.url.toLowerCase().endsWith('.pdf') ? (
                   <iframe src={viewerDoc.url} className="w-full h-[600px] rounded-xl border border-border" />
                 ) : (
                   <img src={viewerDoc.url} alt={viewerDoc.label} className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg" />
                 )}
               </div>
               <div className="p-4 border-t border-border flex justify-end">
                 <a 
                   href={viewerDoc.url} 
                   download 
                   className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:brightness-110 transition-smooth"
                 >
                   <Download size={18} />
                   {t('common:download')}
                 </a>
               </div>
             </div>
           </div>
         )}
      </div>
   );
};

export default EmployeeDetail;
