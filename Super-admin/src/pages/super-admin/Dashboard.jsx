import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Building2,
  CreditCard,
  DollarSign,
  UserPlus,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
// Dashboard me dikhne wala sara numerical aur chart data yaha se aa rha hai
import { dashboardStats, revenueChart, topTenants, recentSignups } from '../../data/dummyData'
import { StatCard } from '../../components/shared/StatCard'
import { Badge } from '../../components/shared/Badge'
import { PageHeader } from '../../components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

const PLAN_COLORS = { Basic: '#3B82F6', Pro: '#8B5CF6', Enterprise: '#10B981' }

export function Dashboard() {
  const { t } = useTranslation('dashboard')
  const [loading] = useState(false)
  const [activePlan, setActivePlan] = useState(null)

  const donutData = [
    { name: t('plans.Basic'), value: 1240, profit: 24, color: PLAN_COLORS.Basic },
    { name: t('plans.Pro'), value: 892, profit: 38, color: PLAN_COLORS.Pro },
    { name: t('plans.Enterprise'), value: 209, profit: 54, color: PLAN_COLORS.Enterprise },
  ]
  const totalPlans = donutData.reduce((s, d) => s + d.value, 0)

  // Number ko Rupees format (Lakhs me agar bada ho) me convert karne ka function
  const formatRevenue = (n) => (n >= 1e5 ? `$${(n / 1e5).toFixed(2)}L` : `$${n?.toLocaleString()}`)

  return (
    <div className="space-y-6 animate-in">
      <PageHeader title={t('title')} />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-[120px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Building2}
            label={t('totalTenants')}
            value={dashboardStats.totalTenants.toLocaleString()}
            change={dashboardStats.totalTenantsChange}
            changeLabel={t('thisMonth')}
          />
          <StatCard
            icon={CreditCard}
            label={t('activeSubscriptions')}
            value={dashboardStats.activeSubscriptions.toLocaleString()}
            change={dashboardStats.activeSubscriptionsChange}
            changeLabel={t('thisMonth')}
          />
          <StatCard
            icon={DollarSign}
            label={t('monthlyRevenue')}
            value={formatRevenue(dashboardStats.monthlyRevenue)}
            change={dashboardStats.monthlyRevenueChange}
            changeLabel={t('thisMonth')}
          />
          <StatCard
            icon={UserPlus}
            label={t('newSignupsWeek')}
            value={dashboardStats.newSignupsWeek}
            changeLabel={t('today')}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="min-w-0 lg:col-span-3">
          <CardHeader>
            <CardTitle>{t('revenueVsTarget')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, '']} />
                  <Legend />
                  {/* Revenue aur Target ka line graph data yaha map ho rha hai */}
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6/20" name={t('revenue')} />
                  <Area type="monotone" dataKey="target" stroke="#8B5CF6" fill="#8B5CF6/20" name={t('target')} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0 lg:col-span-2 overflow-visible">
          <CardHeader>
            <CardTitle>{t('planDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActivePlan(index)}
                      onMouseLeave={() => setActivePlan(null)}
                    >
                      {donutData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.color}
                          stroke="transparent"
                          className="cursor-pointer outline-none transition-all duration-300"
                          style={{
                            filter: activePlan === i ? `drop-shadow(0 0 8px ${entry.color}66)` : 'none',
                            opacity: activePlan === null || activePlan === i ? 1 : 0.4,
                            transform: activePlan === i ? 'scale(1.05)' : 'scale(1)',
                            transformOrigin: 'center', fontSize: '20px',
                          }}
                        />
                      ))}
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                      <tspan
                        x="50%"
                        dy={activePlan !== null ? "-0.2em" : "-0.5em"}
                        fill="#94A3B8"
                        fontSize={activePlan !== null ? 14 : 12}
                        fontWeight="500"
                      >
                        {activePlan !== null ? donutData[activePlan].name : 'TOTAL'}
                      </tspan>
                      <tspan
                        x="50%"
                        dy="1.5em"
                        fill={activePlan !== null ? donutData[activePlan].color : "#F1F5F9"}
                        fontSize={24}
                        fontWeight="bold"
                      >
                        {activePlan !== null
                          ? `${((donutData[activePlan].value / totalPlans) * 100).toFixed(1)}%`
                          : totalPlans.toLocaleString()
                        }
                      </tspan>
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="min-w-0 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>{t('recentSignups')}</CardTitle>
            <Button variant="link" asChild className="shrink-0 p-0 text-sm">
              <Link to="/super-admin/tenants">{t('viewAll')}</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('garageName')}</TableHead>
                    <TableHead>{t('city')}</TableHead>
                    <TableHead>{t('plan')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('joined')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSignups.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">{row.city}</TableCell>
                      <TableCell>{t(`plans.${row.plan}`)}</TableCell>
                      <TableCell>
                        <Badge variant={row.status?.toLowerCase()}>{row.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.joinedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('quickStats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {/* <QuickStatRow label={t('avgRevenuePerTenant')} value={`$${dashboardStats.avgRevenuePerTenant?.toLocaleString()}`} /> */}
              <QuickStatRow label={t('openSupportTickets')} value={dashboardStats.openSupportTickets} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>{t('topPerformingTenants')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('rank')}</TableHead>
                  <TableHead>{t('garageName')}</TableHead>
                  <TableHead>{t('city')}</TableHead>
                  <TableHead>{t('plan')}</TableHead>
                  <TableHead>{t('revenueColumn')}</TableHead>
                  <TableHead>{t('jobsPerMonth')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topTenants.map((row) => (
                  <TableRow key={row.rank}>
                    <TableCell>
                      {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : row.rank}
                    </TableCell>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-muted-foreground">{row.city}</TableCell>
                    <TableCell>{t(`plans.${row.plan}`)}</TableCell>
                    <TableCell>{formatRevenue(row.revenue)}</TableCell>
                    <TableCell>{row.jobsPerMonth}</TableCell>
                    <TableCell>
                      <Badge variant={row.status?.toLowerCase()}>{row.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function QuickStatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
