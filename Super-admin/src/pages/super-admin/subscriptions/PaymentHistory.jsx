import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { userSubscriptions } from '../../../data/dummyData'
import { PageHeader } from '../../../components/shared/PageHeader'
import { StatCard } from '../../../components/shared/StatCard'
import { Badge } from '../../../components/shared/Badge'
import { DataTable } from '../../../components/shared/DataTable'
import { UserCheck, UserX, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const statusVariant = { Active: 'active', Expired: 'inactive', Cancelled: 'suspended' }

export function PaymentHistory() {
  const { t } = useTranslation('subscriptions')
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = useMemo(() => {
    let data = [...userSubscriptions]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (r) =>
          r.userName?.toLowerCase().includes(q) ||
          r.userEmail?.toLowerCase().includes(q) ||
          r.planName?.toLowerCase().includes(q)
      )
    }
    if (planFilter) data = data.filter((r) => r.planName === planFilter)
    if (statusFilter) data = data.filter((r) => r.status === statusFilter)
    return data
  }, [search, planFilter, statusFilter])

  const activeCount = userSubscriptions.filter((s) => s.status === 'Active').length
  const expiredCount = userSubscriptions.filter((s) => s.status === 'Expired').length
  const cancelledCount = userSubscriptions.filter((s) => s.status === 'Cancelled').length
  const planNames = [...new Set(userSubscriptions.map((s) => s.planName))].sort()

  const columns = [
    {
      id: 'user',
      header: t('userSubscriptions.table.user'),
      accessorKey: 'userName',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-foreground">{row.original.userName}</p>
          <p className="text-xs text-muted-foreground">{row.original.userEmail}</p>
        </div>
      ),
    },
    {
      id: 'subscription',
      header: t('userSubscriptions.table.subscription'),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.planName}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.vehicleType} · {row.original.duration}
          </p>
        </div>
      ),
    },
    {
      id: 'purchaseDate',
      header: t('userSubscriptions.table.purchaseDate'),
      accessorKey: 'purchaseDate',
      cell: ({ getValue }) => getValue(),
    },
    {
      id: 'expiryDate',
      header: t('userSubscriptions.table.expiryDate'),
      accessorKey: 'expiryDate',
      cell: ({ getValue }) => getValue(),
    },
    {
      id: 'status',
      header: t('userSubscriptions.table.status'),
      accessorKey: 'status',
      cell: ({ getValue }) => (
        <Badge variant={statusVariant[getValue()] || 'default'}>{getValue()}</Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title={t('userSubscriptionsTitle')}
        subtitle="Kis user ne konsa subscription buy kiya, kab buy kiya, kab expiry, status Active / Expired."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={UserCheck}
          label={t('userSubscriptions.stats.active')}
          value={activeCount}
        />
        <StatCard
          icon={UserX}
          label={t('userSubscriptions.stats.expired')}
          value={expiredCount}
        />
        <StatCard
          icon={Users}
          label={t('userSubscriptions.stats.cancelled')}
          value={cancelledCount}
        />
        <StatCard
          icon={Users}
          label={t('userSubscriptions.stats.total')}
          value={userSubscriptions.length}
        />
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <Input
            type="search"
            placeholder={t('userSubscriptions.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 min-w-[200px] max-w-xs"
          />
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className={cn(
              'h-9 min-w-[160px] rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <option value="">{t('userSubscriptions.filters.plan')}</option>
            {planNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(
              'h-9 min-w-[120px] rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <option value="">{t('userSubscriptions.filters.status')}</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filtered}
        pageSize={10}
        emptyMessage={t('userSubscriptions.empty')}
      />
    </div>
  )
}
