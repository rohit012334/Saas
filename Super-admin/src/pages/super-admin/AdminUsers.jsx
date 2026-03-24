import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { UserPlus, Loader2 } from 'lucide-react'
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
import { useAuthStore } from '../../store/useAuthStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export function AdminUsers() {
  const { t } = useTranslation('users')
  const { token } = useAuthStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)

  const ROLES = [
    { id: 'SUPER_ADMIN', label: 'Super Admin' },
    { id: 'SUPPORT_MANAGER', label: 'Support Manager' },
    { id: 'BILLING_ADMIN', label: 'Billing Admin' },
    { id: 'TECHNICAL_ADMIN', label: 'Technical Admin' },
  ]

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
    role: 'SUPPORT_MANAGER',
    password: '',
    permissions: []
  })

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/admin/staff`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (err) {
      toast.error('Failed to fetch admins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  useEffect(() => {
    if (editUser) {
      setFormData({
        name: editUser.name || '',
        email: editUser.email || '',
        phone: editUser.phone || '',
        status: editUser.status || 'Active',
        role: editUser.role || 'SUPPORT_MANAGER',
        password: '',
        permissions: editUser.permissions || []
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'Active',
        role: 'SUPPORT_MANAGER',
        password: '',
        permissions: ['tenants']
      })
    }
  }, [editUser, addModalOpen])

  const handleTogglePermission = (id) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter(p => p !== id)
        : [...prev.permissions, id]
    }))
  }

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.email) {
        return toast.error('Name and Email are required')
      }
      
      setActionLoading(true)
      const url = editUser 
        ? `${API_URL}/admin/staff/${editUser.id}` 
        : `${API_URL}/admin/staff`
      
      const method = editUser ? 'PUT' : 'POST'
      
      const payload = { ...formData }
      if (!payload.password) delete payload.password
      if (payload.phone === '') delete payload.phone
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      
      const result = await res.json()
      if (result.success) {
        toast.success(editUser ? 'Admin updated' : 'Admin invited successfully')
        setAddModalOpen(false)
        setEditUser(null)
        fetchAdmins()
      } else {
        toast.error(result.message || 'Something went wrong')
      }
    } catch (err) {
      toast.error('Operation failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return
    
    try {
      const res = await fetch(`${API_URL}/admin/staff/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      if (result.success) {
        toast.success('Admin removed')
        fetchAdmins()
      } else {
        toast.error(result.message || 'Failed to delete')
      }
    } catch (err) {
      toast.error('Delete operation failed')
    }
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
      id: 'role',
      header: t('table.role'),
      accessorKey: 'role',
      cell: ({ getValue }) => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {getValue()?.replace('_', ' ')}
        </span>
      )
    },
    {
      id: 'permissions',
      header: 'Access / Permissions',
      accessorKey: 'permissions',
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1">
          {getValue()?.map((p, i) => (
            <Badge key={i} variant="outline" className="text-[9px] font-bold px-1.5 py-0 border-primary/20 bg-primary/5 uppercase tracking-tighter">
              {p.replace('_', ' ')}
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
    { 
      id: 'lastLogin', 
      header: t('table.lastLogin'), 
      accessorKey: 'lastLoginAt',
      cell: ({ getValue }) => getValue() ? new Date(getValue()).toLocaleDateString() : 'Never'
    },
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
        <StatCard label={t('statsActiveNow')} value={data.filter(u => u.isActive).length} />
        <StatCard label={t('statsRolesCount')} value={ROLES.length} />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={data} pageSize={10} />
      )}

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
              <Input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder={t('modal.fullName')} 
              />
            </div>
            <div className="space-y-2">
              <Label>{t('modal.email')}</Label>
              <Input 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                type="email" 
                placeholder={t('modal.email')} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className={cn('h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
                >
                  {ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className={cn('h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Banned / Inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('modal.phone')}</Label>
              <Input 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                type="tel" 
                placeholder={t('modal.phone')} 
              />
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
                      checked={formData.permissions.includes(perm.id)}
                      onChange={() => handleTogglePermission(perm.id)}
                    />
                    <span className="text-xs font-medium text-text-secondary group-hover:text-text transition-colors">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {!editUser && (
              <div className="space-y-2">
                <Label>{t('modal.tempPassword')}</Label>
                <Input 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  type="password" 
                  placeholder={t('modal.tempPassword')} 
                />
              </div>
            )}

            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-input" />
              {editUser ? 'Send update notification' : t('modal.sendInvite')}
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddModalOpen(false); setEditUser(null); }}>Cancel</Button>
            <Button disabled={actionLoading} onClick={handleSubmit}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editUser ? 'Save Changes' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

