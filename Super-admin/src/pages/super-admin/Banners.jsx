import React, { useState } from 'react'
import { Plus, Pencil, Trash2, Image as ImageIcon, Upload, X, Filter, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { PageHeader } from '../../components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '../../components/shared/Badge'
import { toast } from '../../utils/toast'
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

// Initial data source - isme banners ki list hai jo UI pe dikhegi
const initialBanners = [
  { id: 1, type: 'Hero', title: 'Eid Mubarak Specials', description: 'Get 20% off on all services this Eid', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b', date: '2026-03-11' },
  { id: 2, type: 'Offer', title: 'Ramadan Gifting', description: 'Special discounts for the holy month', imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3', date: '2026-03-10' },
  { id: 3, type: 'Trending Bottom', title: 'Top Summer Services', description: 'The best services for your car this summer', imageUrl: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366', date: '2026-03-05' },
]

export function Banners() {
  const { t } = useTranslation('banners')
  const [banners, setBanners] = useState(initialBanners) // Current banners list hold karne ke liye state
  const [modal, setModal] = useState({ open: false, banner: null }) // Create/Edit modal ki state
  const [timeFilter, setTimeFilter] = useState('all') // Date base filtering ke liye state

  const filtered = banners.filter(b => {
    if (timeFilter === 'all') return true;
    const bDate = new Date(b.date);
    const now = new Date('2026-03-11');
    const diffDays = (now - bDate) / (1000 * 60 * 60 * 24);

    if (timeFilter === 'today') return diffDays < 1 && bDate.getDate() === now.getDate();
    if (timeFilter === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return bDate.getDate() === yesterday.getDate() && bDate.getMonth() === yesterday.getMonth();
    }
    if (timeFilter === 'week') return diffDays <= 7;
    return true;
  })

  // Naya banner save karna ya purane ko update karne ka logic
  const handleSave = (banner) => {
    if (modal.banner) {
      // Agar 'banner' exists karta hai modal me, matlab update ho rha hai
      setBanners(banners.map(b => b.id === modal.banner.id ? { ...banner, id: b.id, imageUrl: banner.imagePreview } : b))
      toast.success(t('successUpdate'))
    } else {
      // Warna naya banner list me add ho rha hai
      setBanners([{ ...banner, id: Date.now(), imageUrl: banner.imagePreview, date: new Date().toISOString().split('T')[0] }, ...banners])
      toast.success(t('successCreate'))
    }
    setModal({ open: false, banner: null }) // Modal close kar dena update/create ke baad
  }

  // Banner delete karne ka function
  const handleDelete = (id) => {
    setBanners(banners.filter(b => b.id !== id)) // Filter karke us ID ko remove kar rha hai list se
    toast.success(t('successDelete'))
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.image')}</TableHead>
                <TableHead>{t('table.type')}</TableHead>
                <TableHead>{t('table.title')}</TableHead>
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
                  <TableCell><Badge variant="outline" className="font-bold text-[10px] tracking-widest">{t(`types.${banner.type}`)}</Badge></TableCell>
                  <TableCell className="max-w-[200px] truncate font-bold text-sm tracking-tight">{banner.title}</TableCell>
                  <TableCell className="text-muted-foreground text-xs italic font-medium">{banner.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
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
  const [form, setForm] = useState({
    type: 'Hero',
    title: '',
    description: '',
    bannerImage: null,
    imagePreview: '',
  })

  React.useEffect(() => {
    if (banner) {
      setForm({ ...banner, bannerImage: null, imagePreview: banner.imageUrl })
    } else {
      setForm({
        type: 'Hero',
        title: '',
        description: '',
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

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{banner ? t('modal.edit') : t('modal.add')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>{t('modal.type')}</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="Hero">{t('types.Hero')}</option>
                <option value="Offer">{t('types.Offer')}</option>
                <option value="Trending Bottom">{t('types.Trending Bottom')}</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('modal.title')}</Label>
            <Input 
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('modal.description')}</Label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                    <p className="text-[10px] text-muted-foreground">PNG, JPG or WEBP (Max 2MB)</p>
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
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('modal.cancel')}</Button>
          <Button onClick={() => onSave(form)}>{t('modal.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

