import React, { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Image as ImageIcon, Upload, X, Filter, Calendar, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { PageHeader } from '../../components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '../../components/shared/Badge'
import { toast } from '../../utils/toast'
import { useAuthStore } from '../../store/useAuthStore'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export function Banners() {
  const { t } = useTranslation('banners')
  const { token } = useAuthStore()
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, banner: null })
  const [timeFilter, setTimeFilter] = useState('all')

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/admin/banners`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      if (result.success) {
        setBanners(result.data)
      } else {
        toast.error(result.message || 'Failed to fetch banners')
      }
    } catch (err) {
      toast.error('Network error while fetching banners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const filtered = banners.filter(b => {
    if (timeFilter === 'all') return true;
    const bDate = new Date(b.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - bDate) / (1000 * 60 * 60 * 24));

    if (timeFilter === 'today') return diffDays < 1 && bDate.getDate() === now.getDate();
    if (timeFilter === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return bDate.getDate() === yesterday.getDate() && bDate.getMonth() === yesterday.getMonth();
    }
    if (timeFilter === 'week') return diffDays <= 7;
    return true;
  })

  const handleSave = async (formData) => {
    try {
      const url = modal.banner 
        ? `${API_URL}/admin/banners/${modal.banner.id}` 
        : `${API_URL}/admin/banners`
      
      const method = modal.banner ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const result = await res.json()
      if (result.success) {
        toast.success(modal.banner ? t('successUpdate') : t('successCreate'))
        setModal({ open: false, banner: null })
        fetchBanners()
      } else {
        toast.error(result.message || 'Something went wrong')
      }
    } catch (err) {
      toast.error('Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return
    try {
      const res = await fetch(`${API_URL}/admin/banners/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      if (result.success) {
        toast.success(t('successDelete'))
        fetchBanners()
      } else {
        toast.error(result.message || 'Failed to delete')
      }
    } catch (err) {
      toast.error('Delete operation failed')
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <PageHeader 
        title={t('title')} 
        actions={
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-full px-4 border-primary/20 hover:bg-primary/5">
                  <Filter className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold">
                    {t(`filters.${timeFilter}`)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-primary/10">
                <DropdownMenuItem onClick={() => setTimeFilter('all')} className="rounded-lg">{t('filters.all')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('today')} className="rounded-lg">{t('filters.today')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('yesterday')} className="rounded-lg">{t('filters.yesterday')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('week')} className="rounded-lg">{t('filters.week')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setModal({ open: true, banner: null })} size="sm" className="rounded-full px-6 shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> {t('addBanner')}
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table.image')}</TableHead>
                  <TableHead>{t('table.title')}</TableHead>
                  <TableHead>{t('modal.target')}</TableHead>
                  <TableHead>{t('table.created')}</TableHead>
                  <TableHead className="text-right">{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((banner) => (
                  <TableRow key={banner.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="h-12 w-24 overflow-hidden rounded-xl border border-border/50 shadow-sm group-hover:shadow-md transition-all">
                        <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate font-bold text-sm tracking-tight">{banner.title || 'Untitled Banner'}</TableCell>
                    <TableCell>
                      <Badge variant={banner.target === 'USER' ? 'destructive' : 'default'} className="text-[10px] uppercase font-bold">
                        {banner.target === 'USER' ? 'App / Website' : 'Tenant Dashboard'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs italic font-medium">
                      {new Date(banner.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => setModal({ open: true, banner })}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(banner.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <BannerModal 
        open={modal.open} 
        banner={modal.banner} 
        onClose={() => setModal({ open: false, banner: null })}
        onSave={handleSave}
      />
    </div>
  )
}

function BannerModal({ open, banner, onClose, onSave }) {
  const { t } = useTranslation('banners')
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    linkUrl: '',
    target: 'TENANT',
    bannerImage: null,
    imagePreview: '',
  })

  useEffect(() => {
    if (banner) {
      setForm({
        title: banner.title || '',
        linkUrl: banner.linkUrl || '',
        target: banner.target || 'TENANT',
        bannerImage: null,
        imagePreview: banner.imageUrl || '',
      })
    } else {
      setForm({
        title: '',
        linkUrl: '',
        target: 'TENANT',
        bannerImage: null,
        imagePreview: '',
      })
    }
  }, [banner, open])

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const preview = URL.createObjectURL(file)
      setForm({ ...form, bannerImage: file, imagePreview: preview })
    }
  }

  const handleSubmit = async () => {
    if (!form.bannerImage && !banner) {
      return toast.error('Please select an image')
    }

    setIsSaving(true)
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('linkUrl', form.linkUrl)
    formData.append('target', form.target)
    if (form.bannerImage) {
      formData.append('image', form.bannerImage)
    }

    await onSave(formData)
    setIsSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{banner ? t('modal.edit') : t('modal.add')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('modal.target')}</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setForm({...form, target: 'TENANT'})}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
                    form.target === 'TENANT' ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-sm font-bold">{t('modal.targetTenant')}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Panel View</span>
                </button>
                <button
                  onClick={() => setForm({...form, target: 'USER'})}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
                    form.target === 'USER' ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-sm font-bold">{t('modal.targetUser')}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Mobile/Web App</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('modal.title')}</Label>
              <Input 
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Marketing Title (Internal)"
              />
            </div>

            <div className="space-y-2">
              <Label>Link URL (Optional)</Label>
              <Input 
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>{t('modal.image')}</Label>
              <div 
                className={cn(
                  "relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-all hover:bg-muted/50 hover:border-primary/50",
                  form.imagePreview && "border-solid border-primary/20 bg-primary/5"
                )}
                onClick={() => document.getElementById('banner-upload').click()}
              >
                {form.imagePreview ? (
                  <div className="relative h-full w-full p-2">
                    <img src={form.imagePreview} alt="Preview" className="h-32 w-full rounded-lg object-cover shadow-sm" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100 rounded-lg">
                      <p className="text-xs font-bold text-white shadow-sm">{t('modal.clickToChange')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-text">{t('modal.clickToUpload')}</p>
                      <p className="text-[10px] text-muted-foreground">PNG, JPG or WEBP (Max 5MB)</p>
                    </div>
                  </div>
                )}
                <input 
                  id="banner-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>{t('modal.cancel')}</Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('modal.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
