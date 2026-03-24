import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users, Wrench, CheckCircle, AlertTriangle, DollarSign,
  ArrowRight, MoreVertical, CreditCard
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { StatCard } from '@/components/shared/StatCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { revenueChartData, jobsChartData, repairOrders, parts, invoices, employees } from '@/data/dummyData';
import { commonApi } from '@/utils/api';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { t } = useTranslation();
  const [banners, setBanners] = React.useState([]);
  const [currentBanner, setCurrentBanner] = React.useState(0);

  React.useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await commonApi.getBanners('TENANT');
        if (res.data.success) {
          setBanners(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      }
    };
    fetchBanners();
  }, []);

  React.useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title={t('sidebar:dashboard')}
        breadcrumbs={['GMS', t('sidebar:dashboard')]}
      />

      {/* Banner Carousel */}
      {banners.length > 0 && (
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl group border border-primary/20">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {banners.map((banner, idx) => (
              <div key={banner.id} className="min-w-full h-full relative">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-8 md:p-12">
                  <Badge className="w-fit mb-3 bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[9px] font-bold">
                    Announcement
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 drop-shadow-lg">
                    {banner.title}
                  </h2>
                  {/* <p className="text-sm md:text-base text-white/80 max-w-md line-clamp-2 font-medium">
                    New update for your dashboard is live. Explore features.
                  </p> */}
                  {banner.linkUrl && (
                    <a
                      href={banner.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-2 text-primary font-bold text-xs bg-white/10 hover:bg-white/20 w-fit px-4 py-2 rounded-full transition-all border border-white/10"
                    >
                      Learn More <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  currentBanner === idx ? "w-8 bg-primary" : "w-1.5 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Row 1: Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard
          title={t('dashboard:activeJobsToday')}
          value="12"
          icon={Wrench}
          trend="up"
          trendValue="8"
          color="blue"
        />
        <StatCard
          title={t('dashboard:revenueToday')}
          value="$45,200"
          icon={DollarSign}
          trend="up"
          trendValue="12"
          color="green"
        />
        <StatCard
          title={t('dashboard:pendingApprovals')}
          value="5"
          icon={CheckCircle}
          color="amber"
        />
        <StatCard
          title={t('dashboard:lowStockAlerts')}
          value="8"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title={t('dashboard:pendingInvoices')}
          value="$1.2L"
          icon={CreditCard}
          color="purple"
        />
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-6 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">{t('dashboard:revenueTrend')}</h3>
            <select className="bg-surface border border-border text-xs p-1.5 rounded-lg text-muted">
              <option>{t('dashboard:last30Days')}</option>
              <option>{t('dashboard:last7Days')}</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#F1F5F9' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 glass-card p-6">
          <h3 className="font-bold text-lg mb-6">{t('dashboard:jobStatusDistribution')}</h3>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobsChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {jobsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold">50</span>
              <span className="text-muted text-xs">{t('dashboard:totalJobs')}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {jobsChartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-xs text-muted">{item.status}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Tables/Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Today's Job Cards */}
        <div className="lg:col-span-4 glass-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-bold">{t('dashboard:todaysJobCards')}</h3>
            <button className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline">
              {t('dashboard:viewAll')} <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {repairOrders.slice(0, 5).map((ro) => (
              <div key={ro.id} className="p-4 hover:bg-white/5 transition-smooth cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-sm text-white">{ro.vehicleNo}</p>
                    <p className="text-xs text-muted">{ro.customerName} • {ro.make} {ro.model}</p>
                  </div>
                  <Badge variant={ro.status === 'In Progress' ? 'info' : 'success'}>{ro.status}</Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ro.mechanicId}`} className="w-5 h-5 rounded-full" alt="mech" />
                    <span className="text-[10px] text-muted">Suresh Raina</span>
                  </div>
                  <p className="text-[10px] text-muted">{ro.jobNo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-3 glass-card flex flex-col">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold">{t('dashboard:lowStockAlerts')}</h3>
          </div>
          <div className="flex-1 divide-y divide-border">
            {parts.filter(p => p.stock < p.minStock || p.status === 'Low Stock').map((part) => (
              <div key={part.id} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{part.name}</span>
                  <span className="text-xs text-destructive font-bold">{part.stock} {t('dashboard:left')}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted">Min: {part.minStock}</span>
                  <button className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-smooth font-bold">
                    {t('dashboard:orderNow')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Services */}
        <div className="lg:col-span-3 glass-card">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold">{t('dashboard:upcomingServices')}</h3>
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                  <DollarSign size={18} className="text-muted" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">UP 32 BK 9999</p>
                  <p className="text-xs text-muted">Amit Shah • Periodic Service</p>
                  <p className="text-[10px] text-primary mt-1">{t('dashboard:due')}: {t('dashboard:tomorrow')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Final sections */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-5 glass-card overflow-x-auto">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-lg">{t('dashboard:recentInvoices')}</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-muted text-xs border-b border-border">
                <th className="p-4 font-medium uppercase tracking-wider">{t('dashboard:invoiceNo')}</th>
                <th className="p-4 font-medium uppercase tracking-wider">{t('dashboard:customer')}</th>
                <th className="p-4 font-medium uppercase tracking-wider">{t('dashboard:amount')}</th>
                <th className="p-4 font-medium uppercase tracking-wider">{t('dashboard:status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-white/5 transition-smooth">
                  <td className="p-4 font-mono text-xs">{inv.invoiceNo}</td>
                  <td className="p-4 text-white font-medium">{inv.customer}</td>
                  <td className="p-4 text-white">${inv.total.toLocaleString()}</td>
                  <td className="p-4">
                    <Badge variant={inv.status === 'Paid' ? 'success' : 'warning'}>{inv.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-5 glass-card p-6">
          <h3 className="font-bold text-lg mb-6">{t('dashboard:technicianUtilization')}</h3>
          <div className="space-y-6">
            {employees.filter(e => e.role === 'Mechanic').map(mech => (
              <div key={mech.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src={mech.avatar} className="w-8 h-8 rounded-full" alt="mech" />
                    <span className="text-sm font-bold">{mech.name}</span>
                  </div>
                  <span className="text-xs text-muted">5/8 {t('dashboard:jobsToday')}</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[70%]"></div>
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-muted">
                  <span>{t('dashboard:utilization')}: 70%</span>
                  <span className="text-success font-bold">{t('dashboard:good')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
