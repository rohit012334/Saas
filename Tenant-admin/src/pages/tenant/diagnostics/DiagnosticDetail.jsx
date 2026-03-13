import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Activity, AlertCircle, CheckCircle, 
  Printer, FileText, ChevronRight, Wrench
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { diagnostics } from '@/data/dummyData';

const DiagnosticDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const diag = diagnostics.find(d => d.id === id) || diagnostics[0];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`${diag.scanNo} - ${diag.vehicleNo}`}
        breadcrumbs={['GMS', t('sidebar:diagnostics'), diag.scanNo]}
        onBack={() => navigate('/diagnostics')}
        actions={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-muted hover:text-white transition-smooth font-bold text-sm">
            <Printer size={18} />
            Print Report
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           <div className="surface-card p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                 <AlertCircle size={20} className="text-destructive" />
                 Fault Codes (DTC)
              </h3>
              <div className="space-y-4">
                 {diag.faultCodes.map((code, idx) => (
                    <div key={idx} className="p-4 bg-surface/50 border border-border rounded-xl">
                       <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                             <span className="text-primary font-mono font-bold text-lg">{code.code}</span>
                             <Badge variant="danger">{code.severity}</Badge>
                          </div>
                          <span className="text-xs text-muted font-bold uppercase">{code.system}</span>
                       </div>
                       <p className="text-sm text-white mb-3">{code.description}</p>
                       <div className="pt-3 border-t border-border/50 text-[11px] text-muted italic">
                          Status: {code.status}
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="surface-card p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Wrench size={20} className="text-primary" />
                Repair Recommendations
              </h3>
              <div className="space-y-4">
                 {diag.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-surface/30 border border-border rounded-xl group hover:border-primary transition-smooth">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                             {idx + 1}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white">{rec.recommendation}</p>
                             <p className="text-[10px] text-muted">Priority: {rec.priority} | Est: ₹{rec.estCost}</p>
                          </div>
                       </div>
                       <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1 transition-smooth">
                          Apply to Job Card <ChevronRight size={14} />
                       </button>
                    </div>
                 ))}
              </div>
           </div>

           <div className="surface-card p-6">
              <h3 className="font-bold text-sm mb-6 flex items-center gap-2 text-warning">
                 <Activity size={18} /> Visual Defects Found (Kharabi)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">Engine Bay</p>
                    <p className="text-sm text-white font-bold">Oil seepage near head gasket</p>
                 </div>
                 <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">Underbody</p>
                    <p className="text-sm text-white font-bold">Exhaust pipe rusted at joint</p>
                 </div>
                 <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">Suspension</p>
                    <p className="text-sm text-white font-bold">LHS Bushing cracked</p>
                 </div>
                 <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">Electrical</p>
                    <p className="text-sm text-white font-bold">Wiring harness insulation peeling</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="surface-card p-6">
              <h3 className="font-bold text-sm mb-4">Mechanic Notes</h3>
              <div className="bg-surface/50 p-4 rounded-xl border border-border text-xs text-white leading-relaxed">
                 {diag.notes}
              </div>
           </div>

           <div className="glass-card p-6 border-primary/20 bg-primary/5">
              <h3 className="font-bold text-sm mb-2 text-primary uppercase">Quick Action</h3>
              <p className="text-xs text-muted mb-4">Create a new repair order based on these diagnostic findings.</p>
              <button className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 transition-smooth">
                 Create Job Card
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticDetail;
