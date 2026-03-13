import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Megaphone, MessageSquare, Mail, Users, 
  TrendingUp, Plus, Search, Filter, Eye, BarChart2 
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';

const Campaigns = () => {
  const { t } = useTranslation();

  const campaigns = [
    { name: 'Summer AC Checkup', channel: 'WhatsApp', status: 'Active', reach: '450', conversion: '12%', sentDate: '2024-03-01' },
    { name: 'Loyalty Program Invite', channel: 'Email', status: 'Scheduled', reach: '1,200', conversion: '--', sentDate: '2024-03-15' },
    { name: 'Missed Service Reminder', channel: 'WhatsApp', status: 'Paused', reach: '85', conversion: '5%', sentDate: '2024-02-15' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('customers:campaigns')} 
        breadcrumbs={['GMS', t('sidebar:customers'), t('customers:campaigns')]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20">
             <Plus size={18} />
             Create Campaign
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard title="Total Reach" value="2.4K" icon={Megaphone} color="blue" />
         <StatCard title="Avg. Conversion" value="8.5%" icon={TrendingUp} color="green" />
         <StatCard title="Active Now" value="3" icon={MessageSquare} color="purple" />
         <StatCard title="Credits Used" value="1,240" icon={BarChart2} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8">
            <div className="surface-card">
               <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Recent Campaigns</h3>
                  <button className="text-xs text-primary font-bold hover:underline">View All</button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-muted text-[10px] border-b border-border uppercase tracking-widest font-bold">
                        <th className="p-4">Campaign Name</th>
                        <th className="p-4">Channel</th>
                        <th className="p-4">Reach</th>
                        <th className="p-4">Conversion</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {campaigns.map((c, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-smooth group">
                          <td className="p-4">
                             <p className="text-white font-bold text-sm">{c.name}</p>
                             <p className="text-[10px] text-muted">Sent on {c.sentDate}</p>
                          </td>
                          <td className="p-4">
                             <div className="flex items-center gap-2 text-xs text-white">
                                {c.channel === 'WhatsApp' ? <MessageSquare size={12} className="text-green-500" /> : <Mail size={12} className="text-blue-500" />}
                                {c.channel}
                             </div>
                          </td>
                          <td className="p-4 text-white font-bold text-sm">{c.reach}</td>
                          <td className="p-4 text-success text-sm font-black">{c.conversion}</td>
                          <td className="p-4">
                             <Badge variant={c.status === 'Active' ? 'success' : c.status === 'Scheduled' ? 'info' : 'muted'}>
                                {c.status}
                             </Badge>
                          </td>
                          <td className="p-4 text-right">
                             <button className="p-1.5 text-muted hover:text-primary"><BarChart2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="surface-card p-6">
               <h3 className="font-bold text-sm mb-4">Quick Templates</h3>
               <div className="space-y-4">
                  {[
                    { name: 'Festival Offer', desc: '15% Off on Body Polish', icon: Megaphone },
                    { name: 'Weekend Special', desc: 'Free Wash on Minor Repair', icon: Megaphone },
                    { name: 'Referral Bonus', desc: 'Refer 1 friend, get 100 points', icon: Users },
                  ].map((temp, i) => (
                    <div key={i} className="p-4 bg-surface border border-border rounded-xl group hover:border-primary transition-smooth cursor-pointer">
                       <h4 className="text-sm font-bold text-white mb-1 group-hover:text-primary">{temp.name}</h4>
                       <p className="text-[10px] text-muted">{temp.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Campaigns;
