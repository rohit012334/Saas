import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, AlertTriangle, FileDown, FileText, FileSpreadsheet, FileBox, Filter } from 'lucide-react'
import { auditLogs } from '../../data/dummyData' // Yeh logs dummyData file se aa rhe hain (Initial Data Source)
import { PageHeader } from '../../components/shared/PageHeader'
import { StatCard } from '../../components/shared/StatCard'
import { Badge } from '../../components/shared/Badge'
import { DataTable } from '../../components/shared/DataTable'
import { toast } from '../../utils/toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const actionColors = {
  TENANT_SUSPENDED: 'danger',
  PLAN_UPDATED: 'primary',
  API_KEY_ROTATED: 'warning',
  ADMIN_LOGIN: 'success',
  ADMIN_CREATED: 'purple',
  TENANT_DELETED: 'danger',
  ANNOUNCEMENT_SENT: 'primary',
  SETTINGS_CHANGED: 'warning',
}

export function AuditLogs() {
  const { t } = useTranslation('security')
  const [timeFilter, setTimeFilter] = useState('all') // Time base filter ke liye state (Today, Yesterday etc)
  const [actionFilter, setActionFilter] = useState('') // Action type filter ke liye state (Login, Create etc)

  // Yaha data filter ho rha hai jo table me show hoga
  const filtered = auditLogs.filter((log) => {
    if (actionFilter && log.action !== actionFilter) return false

    if (timeFilter !== 'all') {
      const logDate = new Date(log.timestamp.split(' ')[0])
      const now = new Date('2026-03-11')
      const diffDays = (now - logDate) / (1000 * 60 * 60 * 24)

      if (timeFilter === 'today') return diffDays < 1 && logDate.getDate() === now.getDate()
      if (timeFilter === 'yesterday') {
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        return logDate.getDate() === yesterday.getDate() && logDate.getMonth() === yesterday.getMonth()
      }
      if (timeFilter === 'week') return diffDays <= 7
    }

    return true
  })

  const columns = [
    { id: 'timestamp', header: t('table.timestamp'), accessorKey: 'timestamp', cell: ({ getValue }) => getValue() },
    { id: 'adminUser', header: t('table.adminUser'), accessorKey: 'adminUser', cell: ({ getValue }) => getValue() },
    {
      id: 'action',
      header: t('table.action'),
      accessorKey: 'action',
      cell: ({ getValue }) => {
        const key = getValue()
        const label = t(`actions.${key}`) || key
        return <Badge variant={actionColors[key] || 'default'}>{label}</Badge>
      },
    },
    { id: 'target', header: t('table.target'), accessorKey: 'target', cell: ({ getValue }) => getValue() },
    { id: 'ipAddress', header: t('table.ipAddress'), accessorKey: 'ipAddress', cell: ({ getValue }) => getValue() },
    { id: 'location', header: t('table.location'), accessorKey: 'location', cell: ({ getValue }) => getValue() },
    {
      id: 'status',
      header: t('table.status'),
      accessorKey: 'status',
      cell: ({ getValue }) => <Badge variant={getValue() === 'Success' ? 'success' : 'failed'}>{getValue()}</Badge>,
    },
  ]

  // Final UI rendering jaha data components me pass ho rha hai
  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title={t('title')}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FileDown className="h-4 w-4" />
                {t('exportCsv')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.success('CSV export started')}>
                <FileText className="mr-2 h-4 w-4" /> CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Excel export started')}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('PDF export started')}>
                <FileBox className="mr-2 h-4 w-4" /> PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Shield} label={t('failedLogins')} value={12} />
        <StatCard icon={Shield} label={t('activeSessions')} value={8} />
        <StatCard icon={AlertTriangle} label={t('suspiciousIps')} value={2} variant="warning" />
        <StatCard icon={Shield} label={t('twoFaEnabled')} value={6} />
      </div>



      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 h-9">
                <Filter className="h-4 w-4" />
                {timeFilter === 'all' ? 'All Time' :
                  timeFilter === 'today' ? 'Today' :
                    timeFilter === 'yesterday' ? 'Yesterday' : 'Last 7 Days'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => setTimeFilter('all')}>All Time</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('today')}>Today</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('yesterday')}>Yesterday</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('week')}>Last 7 Days</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className={cn('h-9 min-w-[160px] rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
          >
            <option value="">{t('filters.actionType')}</option>
            <option value="TENANT_SUSPENDED">Tenant Suspended</option>
            <option value="PLAN_UPDATED">Plan Updated</option>
            <option value="ADMIN_LOGIN">Admin Login</option>
            <option value="SETTINGS_CHANGED">Settings Changed</option>
          </select>
        </CardContent>
      </Card>

      {/* Ye table component filtered data ko properly row me display kar rha hai */}
      <DataTable columns={columns} data={filtered} pageSize={15} />
    </div>
  )
}
