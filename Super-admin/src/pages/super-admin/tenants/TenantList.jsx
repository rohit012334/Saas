import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, Pencil, MoreVertical, Plus, FileDown, FileText, FileSpreadsheet, FileBox, Download, Filter } from 'lucide-react'
import { tenants } from '../../../data/dummyData' // Garages (Tenants) ka dummy data yaha se aa rha hai (Initial Data Source)
import { PageHeader } from '../../../components/shared/PageHeader'
import { Badge } from '../../../components/shared/Badge'
import { DataTable } from '../../../components/shared/DataTable'
import { toast } from '../../../utils/toast'
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const statusMap = { Active: 'active', Suspended: 'suspended', Trial: 'trial', 'Pending Approval': 'pending' }

export function TenantList() {
  const { t } = useTranslation('tenants')
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const [search, setSearch] = useState('') // Search input ke liye state
  const [planFilter, setPlanFilter] = useState('') // Plan (Basic/Pro etc) filter ke liye state
  const [statusFilter, setStatusFilter] = useState('') // Status base filter ke liye
  const [timeFilter, setTimeFilter] = useState('all') // Join hone ka time filter
  const [confirm, setConfirm] = useState({ open: false, type: null, row: null }) // Delete/Block confirmation modal ke liye
  const [docsModal, setDocsModal] = useState({ open: false, tenant: null }) // Documents check karne wali modal state

  const filtered = useMemo(() => {
    let data = [...tenants]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.city?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.ownerName?.toLowerCase().includes(q)
      )
    }
    if (planFilter) data = data.filter((r) => r.plan === planFilter)
    if (statusFilter) data = data.filter((r) => r.status === statusFilter)

    if (timeFilter !== 'all') {
      const now = new Date('2026-03-11')
      data = data.filter((r) => {
        const joined = new Date(r.joinedDate)
        const diffDays = (now - joined) / (1000 * 60 * 60 * 24)

        if (timeFilter === 'today') return diffDays < 1 && joined.getDate() === now.getDate()
        if (timeFilter === 'yesterday') {
          const yesterday = new Date(now)
          yesterday.setDate(now.getDate() - 1)
          return joined.getDate() === yesterday.getDate() && joined.getMonth() === yesterday.getMonth()
        }
        if (timeFilter === 'week') return diffDays <= 7
        return true
      })
    }
    return data
  }, [search, planFilter, statusFilter, timeFilter]) // In sab inputs ke change hone par filtering logic re-run hoga

  const columns = useMemo(
    () => [
      { id: 'index', header: t('table.index'), cell: ({ row }) => row.index + 1, enableSorting: false },
      { id: 'name', header: t('table.garageName'), accessorKey: 'name', cell: ({ getValue }) => getValue() },
      { id: 'ownerName', header: t('table.ownerName'), accessorKey: 'ownerName', cell: ({ getValue }) => getValue() },
      { id: 'city', header: t('table.city'), accessorKey: 'city', cell: ({ getValue }) => getValue() },
      { id: 'plan', header: t('table.plan'), accessorKey: 'plan', cell: ({ getValue }) => getValue() },
      {
        id: 'status',
        header: t('table.status'),
        accessorKey: 'status',
        cell: ({ getValue }) => <Badge variant={statusMap[getValue()] || 'default'}>{getValue()}</Badge>,
      },
      {
        id: 'mrr',
        header: t('table.mrr'),
        accessorKey: 'mrr',
        cell: ({ getValue }) => `$${Number(getValue()).toLocaleString()}`,
      },
      { id: 'staffCount', header: t('table.staffCount'), accessorKey: 'staffCount', cell: ({ getValue }) => getValue() },
      { id: 'joinedDate', header: t('table.joinedDate'), accessorKey: 'joinedDate', cell: ({ getValue }) => getValue() },
      {
        id: 'actions',
        header: t('table.actions'),
        enableSorting: false,
        cell: ({ row }) => (
          <TenantActions
            row={row.original}
            onView={() => navigate(`/super-admin/tenants/${row.original.id}`)}
            onEdit={() => navigate(`/super-admin/tenants/${row.original.id}/edit`)}
            onDocuments={() => setDocsModal({ open: true, tenant: row.original })}
            onSuspend={() => setConfirm({ open: true, type: 'suspend', row: row.original })}
            onActivate={() => setConfirm({ open: true, type: 'activate', row: row.original })}
            onBlock={() => setConfirm({ open: true, type: 'block', row: row.original })}
            onDelete={() => setConfirm({ open: true, type: 'delete', row: row.original })}
            t={t}
          />
        ),
      },
    ],
    [t, navigate]
  )

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <PageHeader
        title={t('listTitle')}
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="default">
                  <FileDown className="h-4 w-4" />
                  {t('export')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => toast.success('CSV export started')}>
                  <FileText className="mr-2 h-4 w-4" />
                  CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Excel export started')}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('PDF export started')}>
                  <FileBox className="mr-2 h-4 w-4" />
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => navigate('/super-admin/tenants/create')}>
              <Plus className="h-4 w-4" />
              {t('addTenant')}
            </Button>
          </>
        }
      />
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <Input
            type="search"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 min-w-[200px] max-w-xs"
          />
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className={cn(
              'h-9 min-w-[120px] rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <option value="">{t('filterPlan')}</option>
            <option value="Basic">Basic</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Trial">Trial</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(
              'h-9 min-w-[140px] rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <option value="">{t('filterStatus')}</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Trial">Trial</option>
            <option value="Pending Approval">Pending</option>
          </select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 h-9 px-3">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {timeFilter === 'all' ? 'All Time' :
                    timeFilter === 'today' ? 'Today' :
                      timeFilter === 'yesterday' ? 'Yesterday' : 'Last 7 Days'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setTimeFilter('all')}>All Time</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('today')}>Today</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('yesterday')}>Yesterday</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter('week')}>Last 7 Days</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
      {/* Data table me filtered data pass ho rha hai display ke liye */}
      <DataTable
        columns={columns}
        data={filtered.map((r, i) => ({ ...r, index: i }))}
        pageSize={10}
        emptyMessage={t('noResults')}
      />
      <ConfirmDialog
        open={confirm.open}
        title={
          confirm.type === 'delete' ? tCommon('deleteConfirm', { name: confirm.row?.name }) :
            confirm.type === 'block' ? 'Block Tenant' :
              confirm.type === 'activate' ? 'Activate Tenant' :
                t('actionSuspend')
        }
        message={tCommon('deleteConfirmMessage')}
        danger={confirm.type === 'delete' || confirm.type === 'block'}
        confirmLabel={
          confirm.type === 'delete' ? tCommon('delete') :
            confirm.type === 'block' ? 'Block' :
              confirm.type === 'activate' ? 'Activate' :
                tCommon('confirm')
        }
        onConfirm={() => {
          toast.success(
            confirm.type === 'delete' ? 'Deleted' :
              confirm.type === 'block' ? 'Blocked' :
                confirm.type === 'activate' ? 'Activated' :
                  'Suspended'
          )
          setConfirm({ open: false, type: null, row: null })
        }}
        onCancel={() => setConfirm({ open: false, type: null, row: null })}
      />

      <DocumentsModal
        open={docsModal.open}
        tenant={docsModal.tenant}
        onClose={() => setDocsModal({ open: false, tenant: null })}
      />
    </div>
  )
}

function TenantActions({ row, onView, onEdit, onDocuments, onSuspend, onActivate, onBlock, onDelete, t }) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon-sm" onClick={onView} title={t('viewDetail')}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onDocuments} title="View Documents">
        <FileText className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onEdit} title={t('edit')}>
        <Pencil className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" title={t('more')}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onActivate}>Active</DropdownMenuItem>
          <DropdownMenuItem onClick={onSuspend}>{t('actionSuspend')}</DropdownMenuItem>
          <DropdownMenuItem onClick={onBlock}>Block</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={onDelete}>{t('actionDelete')}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function DocumentsModal({ open, tenant, onClose }) {
  if (!tenant) return null

  const garageDocs = [
    { name: 'Trade License', status: 'Verified', date: '2024-01-15' },
    { name: 'Rent Agreement', status: 'Pending', date: '2024-03-01' },
    { name: 'Workshop Photos', status: 'Verified', date: '2024-02-10' },
  ]

  const ownerDocs = [
    { name: 'Identity Proof (Owner ID/Passport)', status: 'Verified', date: '2024-01-15' },
    { name: 'Address Proof', status: 'Verified', date: '2024-01-15' },
    { name: 'Owner Photo', status: 'Verified', date: '2024-01-15' },
  ]

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Documents — {tenant.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4 sm:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Garage Documents</h3>
            <div className="space-y-2">
              {garageDocs.map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{doc.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={doc.status === 'Verified' ? 'active' : 'warning'} className="h-4 px-1 text-[10px]">
                        {doc.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{doc.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8" onClick={() => toast.info(`Viewing ${doc.name}`)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8" onClick={() => toast.success(`Downloaded ${doc.name}`)}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Owner Documents</h3>
            <div className="space-y-2">
              {ownerDocs.map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{doc.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={doc.status === 'Verified' ? 'active' : 'warning'} className="h-4 px-1 text-[10px]">
                        {doc.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{doc.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8" onClick={() => toast.info(`Viewing ${doc.name}`)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8" onClick={() => toast.success(`Downloaded ${doc.name}`)}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
