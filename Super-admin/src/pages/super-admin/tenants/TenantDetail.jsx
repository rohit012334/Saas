import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { tenants } from '../../../data/dummyData'
import { Badge } from '../../../components/shared/Badge'
import { toast } from '../../../utils/toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const statusMap = { Active: 'active', Suspended: 'suspended', Trial: 'trial', 'Pending Approval': 'pending' }

export function TenantDetail() {
  const { id } = useParams()
  const { t } = useTranslation('tenants')
  const [activeTab, setActiveTab] = useState('overview')

  const tenant = tenants.find((x) => x.id === id) || tenants[0]
  const revenueByMonth = [
    { month: 'Sep', revenue: (tenant.mrr || 0) * 0.9 },
    { month: 'Oct', revenue: tenant.mrr || 0 },
    { month: 'Nov', revenue: (tenant.mrr || 0) * 1.1 },
    { month: 'Dec', revenue: (tenant.mrr || 0) * 0.95 },
    { month: 'Jan', revenue: (tenant.mrr || 0) * 1.05 },
    { month: 'Feb', revenue: tenant.mrr || 0 },
  ]

  const tabs = [
    { id: 'overview', key: 'tabs.overview' },
    { id: 'subscriptionHistory', key: 'tabs.subscriptionHistory' },
    { id: 'staffMembers', key: 'tabs.staffMembers' },
    { id: 'activityLog', key: 'tabs.activityLog' },
  ]

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/super-admin/tenants" className="gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {t('backToList')}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">{tenant.name}</h1>
        <Badge variant={statusMap[tenant.status] || 'default'}>{tenant.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('garageInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-border bg-muted/50 text-xs text-muted-foreground">
              Logo
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('contactEmail')}: {tenant.email}</p>
              <p className="text-sm text-muted-foreground">{t('contactPhone')}: {tenant.phone}</p>
              <p className="text-sm text-muted-foreground">{t('country')}: {tenant.country}</p>
              <p className="text-sm text-muted-foreground">{t('gst')}: {tenant.gstNumber || '—'}</p>
              <p className="text-sm text-muted-foreground">{t('joined')}: {tenant.joinedDate}</p>
              <p className="text-sm text-muted-foreground">{t('subscriptionPlan')}: <Badge>{tenant.plan}</Badge></p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox label={t('statsRevenue')} value={`₹${(tenant.mrr || 0).toLocaleString()}`} />
        <StatBox label={t('statsJobsThisMonth')} value={tenant.jobsThisMonth} />
        <StatBox label={t('statsStaffCount')} value={tenant.staffCount} />
        <StatBox label={t('statsVehicles')} value={tenant.vehiclesRegistered} />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 border-b border-border pb-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                type="button"
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={cn(activeTab !== tab.id && 'text-muted-foreground')}
              >
                {t(tab.key)}
              </Button>
            ))}
          </div>
          <div className="mt-4">
            {activeTab === 'overview' && (
              <>
                <h3 className="mb-3 text-sm font-medium">Monthly revenue (last 6 months)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={revenueByMonth}>
                    <XAxis dataKey="month" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="mt-2 text-sm text-muted-foreground">Recent activity: Plan viewed, Invoice paid, Job created.</p>
              </>
            )}
            {activeTab === 'subscriptionHistory' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{tenant.plan}</TableCell>
                    <TableCell>{tenant.joinedDate}</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>₹{(tenant.mrr || 0).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="paid">Active</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
            {activeTab === 'staffMembers' && (
              <p className="text-sm text-muted-foreground">Staff list would load here. Dummy: 5 staff.</p>
            )}
            {activeTab === 'activityLog' && (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>2026-03-10 09:00 — Login — admin@garage.com — 192.168.1.1</li>
                <li>2026-03-09 14:30 — Invoice paid — system</li>
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}
