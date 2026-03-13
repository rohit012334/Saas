import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserPlus } from 'lucide-react'
import { adminUsers } from '../../data/dummyData'
import { PageHeader } from '../../components/shared/PageHeader'
import { StatCard } from '../../components/shared/StatCard'
import { Badge } from '../../components/shared/Badge'
import { DataTable } from '../../components/shared/DataTable'
import { toast } from '../../utils/toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const roleVariant = {
  'Super Admin': 'superAdmin',
  'Subscription Manager': 'supportManager',
  'Support Specialist': 'billingAdmin',
  'Banner Admin': 'technicalAdmin',
  'Content Manager': 'default',
  'Billing Admin': 'billingAdmin',
  'Account Executive': 'superAdmin'
}

export function AdminUsers() {
  const { t } = useTranslation('users')
  const [data, setData] = useState([...adminUsers])
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)

  const handleDelete = (id) => {
    setData(data.filter(u => u.id !== id))
    toast.success('Admin removed')
  }

  const columns = [
    {
      id: 'avatar',
      header: t('table.avatar'),
      cell: ({ row }) => (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
          {row.original.name?.charAt(0)}
        </div>
      ),
      enableSorting: false,
    },
    { id: 'name', header: t('table.name'), accessorKey: 'name' },
    { id: 'email', header: t('table.email'), accessorKey: 'email' },
    {
      id: 'permissions',
      header: 'Access / Permissions',
      accessorKey: 'permissions',
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1">
          {getValue()?.map((p, i) => (
            <Badge key={i} variant="outline" className="text-[9px] font-bold px-1.5 py-0 border-primary/20 bg-primary/5 uppercase tracking-tighter">
              {p}
            </Badge>
          ))}
        </div>
      )
    },
    {
      id: 'status',
      header: t('table.status'),
      accessorKey: 'status',
      cell: ({ getValue }) => <Badge variant={getValue() === 'Active' ? 'active' : 'inactive'}>{getValue()}</Badge>,
    },
    { id: 'lastLogin', header: t('table.lastLogin'), accessorKey: 'lastLogin' },
    {
      id: 'actions',
      header: t('table.actions'),
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setEditUser(row.original)}>Edit</Button>
          <Button variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={() => handleDelete(row.original.id)}>Delete</Button>
        </div>
      ),
    },
  ]

  const activeCount = adminUsers.filter((u) => u.status === 'Active').length

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title={t('title')}
        actions={
          <Button onClick={() => setAddModalOpen(true)}>
            <UserPlus className="h-4 w-4" />
            {t('addAdmin')}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t('statsTotalAdmins')} value={data.length} />
        <StatCard label={t('statsActiveNow')} value={data.filter(u => u.status === 'Active').length} />
        <StatCard label={t('statsRolesCount')} value={5} />
      </div>

      <DataTable columns={columns} data={data} pageSize={10} />

      {/* Edit/Invite Modal */}
      <Dialog
        open={addModalOpen || !!editUser}
        onOpenChange={(open) => {
          if (!open) {
            setAddModalOpen(false)
            setEditUser(null)
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editUser ? 'Edit Admin Access' : 'Invite New Admin'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('modal.fullName')}</Label>
              <Input defaultValue={editUser?.name || ''} placeholder={t('modal.fullName')} />
            </div>
            <div className="space-y-2">
              <Label>{t('modal.email')}</Label>
              <Input defaultValue={editUser?.email || ''} type="email" placeholder={t('modal.email')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  defaultValue={editUser?.status || 'Active'}
                  className={cn('h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Banned / Inactive</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t('modal.phone')}</Label>
                <Input type="tel" placeholder={t('modal.phone')} />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold">Granular Access / Permissions</Label>
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/50 bg-muted/20 p-4">
                {[
                  { id: 'tenants', label: 'Tenant Management' },
                  { id: 'subs', label: 'Subscriptions & Plans' },
                  { id: 'banners', label: 'Banner Management' },
                  { id: 'announcements', label: 'Announcements' },
                  { id: 'support', label: 'Tickets & Support' },
                  { id: 'cms', label: 'CMS (FAQ, Terms)' },
                ].map((perm) => (
                  <label key={perm.id} className="flex items-center gap-2 group cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary transition-all group-hover:scale-110"
                      defaultChecked={editUser ? Math.random() > 0.5 : perm.id === 'tenants'}
                    />
                    <span className="text-xs font-medium text-text-secondary group-hover:text-text transition-colors">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {!editUser && (
              <div className="space-y-2">
                <Label>{t('modal.tempPassword')}</Label>
                <Input type="password" placeholder={t('modal.tempPassword')} />
              </div>
            )}

            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-input" />
              {editUser ? 'Send update notification' : t('modal.sendInvite')}
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddModalOpen(false); setEditUser(null); }}>Cancel</Button>
            <Button onClick={() => {
              toast.success(editUser ? 'Permissions updated' : 'Invite sent');
              setAddModalOpen(false);
              setEditUser(null);
            }}>
              {editUser ? 'Save Changes' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
