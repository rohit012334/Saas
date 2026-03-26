import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, CheckCircle2, XCircle, Loader2, Download, AlertCircle } from 'lucide-react'
import { PageHeader } from '../../../components/shared/PageHeader'
import { Badge } from '../../../components/shared/Badge'
import { DataTable } from '../../../components/shared/DataTable'
import { toast } from '../../../utils/toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '../../../store/useAuthStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
const BASE_URL = API_URL.replace('/api', '')

export function SubscriptionRequests() {
  const { t } = useTranslation('tenants')
  const { token, admin } = useAuthStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  
  const [docsModal, setDocsModal] = useState({ open: false, tenant: null })
  const [rejectModal, setRejectModal] = useState({ open: false, tenant: null, reason: '' })
  const [previewImage, setPreviewImage] = useState(null)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/admin/tenants/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (err) {
      toast.error('Failed to fetch subscription requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this tenant?')) return
    
    try {
      setActionLoading(true)
      const res = await fetch(`${API_URL}/admin/tenants/${id}/approve`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminId: admin.id })
      })
      const result = await res.json()
      if (result.success) {
        toast.success('Tenant approved successfully')
        fetchRequests()
      } else {
        toast.error(result.message || 'Approval failed')
      }
    } catch (err) {
      toast.error('Operation failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectModal.reason) return toast.error('Please provide a reason')
    
    try {
      setActionLoading(true)
      const res = await fetch(`${API_URL}/admin/tenants/${rejectModal.tenant.id}/reject`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectModal.reason })
      })
      const result = await res.json()
      if (result.success) {
        toast.success('Tenant rejected')
        setRejectModal({ open: false, tenant: null, reason: '' })
        fetchRequests()
      } else {
        toast.error(result.message || 'Rejection failed')
      }
    } catch (err) {
      toast.error('Operation failed')
    } finally {
      setActionLoading(false)
    }
  }

  const columns = [
    { id: 'index', header: '#', cell: ({ row }) => row.index + 1 },
    { id: 'garageName', header: 'Garage Name', accessorKey: 'garageName' },
    { id: 'ownerName', header: 'Owner Name', accessorKey: 'ownerName' },
    { id: 'email', header: 'Email', accessorKey: 'email' },
    { 
      id: 'plan', 
      header: 'Plan', 
      cell: ({ row }) => {
        const sub = row.original.subscriptions?.[0]
        return sub ? `${sub.plan?.name || '-'} (${sub.interval})` : 'N/A'
      }
    },
    { 
      id: 'amount', 
      header: 'Amount', 
      cell: ({ row }) => {
        const sub = row.original.subscriptions?.[0]
        return (
          <span className="font-bold text-primary">
            ₹{Number(sub?.amount || 0).toLocaleString()}
          </span>
        )
      }
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => (
        <Badge variant={getValue() === 'RESUBMITTED' ? 'warning' : 'pending'}>
          {getValue()?.replace('_', ' ')}
        </Badge>
      ),
    },
    { 
      id: 'date', 
      header: 'Requested On', 
      accessorKey: 'createdAt',
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon-sm" onClick={() => setDocsModal({ open: true, tenant: row.original })} title="Review Documents">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApprove(row.original.id)} title="Approve">
            <CheckCircle2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => setRejectModal({ open: true, tenant: row.original, reason: '' })} title="Reject">
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader title="Subscription Requests" />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={data.map((r, i) => ({ ...r, index: i }))} pageSize={10} emptyMessage="No pending subscription requests" />
      )}

      {/* Documents Review Modal */}
      <Dialog open={docsModal.open} onOpenChange={(open) => !open && setDocsModal({ open: false, tenant: null })}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Review — {docsModal.tenant?.garageName}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4 md:grid-cols-2">
             <div className="space-y-4">
               <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b pb-2">Business Documents</h3>
               <DocumentItem label="Trade License (Front)" url={docsModal.tenant?.tradeLicenseFrontUrl} baseUrl={BASE_URL} onPreview={setPreviewImage} />
               <DocumentItem label="Trade License (Back)" url={docsModal.tenant?.tradeLicenseBackUrl} baseUrl={BASE_URL} onPreview={setPreviewImage} />
               <DocumentItem label="VAT Certificate" url={docsModal.tenant?.vatCertificateUrl} baseUrl={BASE_URL} onPreview={setPreviewImage} />
             </div>
             <div className="space-y-4">
               <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b pb-2">Owner Identity</h3>
               <DocumentItem label="Owner ID (Front)" url={docsModal.tenant?.ownerIdFrontUrl} baseUrl={BASE_URL} onPreview={setPreviewImage} />
               <DocumentItem label="Owner ID (Back)" url={docsModal.tenant?.ownerIdBackUrl} baseUrl={BASE_URL} onPreview={setPreviewImage} />
             </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-4 mt-4">
             <h3 className="font-bold text-sm mb-3">Garage & Contact Information</h3>
             <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Garage Email</span>
                  <span>{docsModal.tenant?.garageEmail || docsModal.tenant?.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Garage Phone</span>
                  <span>{docsModal.tenant?.garagePhone || docsModal.tenant?.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">TRN Number</span>
                  <span>{docsModal.tenant?.trnNumber || 'Not Provided'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Address</span>
                  <span className="break-words">{docsModal.tenant?.garageAddress}, {docsModal.tenant?.city}</span>
                </div>
             </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={() => setDocsModal({ open: false, tenant: null })}>Close</Button>
            <Button variant="destructive" onClick={() => {
                const t = docsModal.tenant;
                setDocsModal({ open: false, tenant: null });
                setRejectModal({ open: true, tenant: t, reason: '' });
            }}>Reject</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                const id = docsModal.tenant.id;
                setDocsModal({ open: false, tenant: null });
                handleApprove(id);
            }}>Approve & Activate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Reason Modal */}
      <Dialog open={rejectModal.open} onOpenChange={(open) => !open && setRejectModal({ open: false, tenant: null, reason: '' })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
               <XCircle className="h-5 w-5" />
               Reject Application
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                Rejecting will notify <strong>{rejectModal.tenant?.ownerName}</strong> and initiate a full refund of ₹{rejectModal.tenant?.subscriptions?.[0]?.amount} to their original payment method.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Reason for Rejection</Label>
              <textarea
                className="flex min-h-[120px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="E.g. Documents are not clear, Trade license is expired..."
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModal({ open: false, tenant: null, reason: '' })}>Cancel</Button>
            <Button variant="destructive" disabled={actionLoading || !rejectModal.reason} onClick={handleReject}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Screen Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-[95vw] w-fit p-0 border-none bg-transparent shadow-none [&>button]:text-white [&>button]:h-10 [&>button]:w-10 [&>button]:bg-black/50 [&>button]:hover:bg-black/70 [&>button]:rounded-full [&>button]:top-4 [&>button]:right-4">
          <div className="relative flex items-center justify-center min-h-[50vh]">
             <img 
               src={previewImage} 
               alt="Document Preview" 
               className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
             />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DocumentItem({ label, url, baseUrl, onPreview }) {
  if (!url) return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 opacity-60">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Missing</span>
    </div>
  )

  // If URL is absolute (starts with http), use it. Otherwise prepend baseUrl/uploads
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}/uploads/${url}`

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg border bg-card/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
      <div className="flex items-center justify-between">
         <span className="text-xs font-bold text-text-secondary">{label}</span>
         <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" className="h-7 w-7 rounded-full bg-white/80 shadow-sm" onClick={() => onPreview(fullUrl)} title="Quick Preview">
                 <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" className="h-7 w-7 rounded-full bg-white/80 shadow-sm" asChild>
               <a href={fullUrl} target="_blank" rel="noreferrer" title="Open in New Tab">
                 <Download className="h-3.5 w-3.5" />
               </a>
            </Button>
         </div>
      </div>
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted/30 border border-border/50 shadow-inner">
         <img 
           src={fullUrl} 
           alt={label} 
           className="w-full h-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-700" 
           onClick={() => onPreview(fullUrl)}
         />
         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
      </div>
    </div>
  )
}
