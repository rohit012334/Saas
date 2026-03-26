import React, { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, Languages, Globe, Loader2, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '../../../components/shared/Badge'
import { toast } from '../../../utils/toast'
import { useAuthStore } from '../../../store/useAuthStore'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export function FAQList() {
  const { t } = useTranslation('cms')
  const { token } = useAuthStore()
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [displayLang, setDisplayLang] = useState('en')
  const [modal, setModal] = useState({ open: false, faq: null })

  const fetchFaqs = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/admin/cms?type=FAQ`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      if (result.success) {
        setFaqs(result.data)
      }
    } catch (err) {
      toast.error('Failed to load FAQs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  const filtered = faqs.filter(f => {
    const qEn = (f.title.en || '').toLowerCase()
    const qAr = (f.title.ar || '').toLowerCase()
    const s = search.toLowerCase()
    return qEn.includes(s) || qAr.includes(s)
  })

  const handleSave = async (payload) => {
    try {
      const url = modal.faq 
        ? `${API_URL}/admin/cms/${modal.faq.id}` 
        : `${API_URL}/admin/cms`
      
      const method = modal.faq ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...payload,
          type: 'FAQ'
        })
      })

      const result = await res.json()
      if (result.success) {
        toast.success(modal.faq ? 'FAQ updated' : 'New FAQ added')
        setModal({ open: false, faq: null })
        fetchFaqs()
      } else {
        toast.error(result.message || 'Error occurred')
      }
    } catch (err) {
      toast.error('Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      const res = await fetch(`${API_URL}/admin/cms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      if (result.success) {
        toast.success('FAQ deleted')
        fetchFaqs()
      }
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <PageHeader 
        title={t('faq.title')} 
        actions={
          <Button onClick={() => setModal({ open: true, faq: null })} className="shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> {t('faq.add')}
          </Button>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 pt-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder={t('faq.search')} 
                  className="pl-9 h-10 rounded-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex rounded-xl bg-muted/50 p-1">
                <Button 
                  variant={displayLang === 'en' ? 'default' : 'ghost'} 
                  size="sm" 
                  className="rounded-lg px-4"
                  onClick={() => setDisplayLang('en')}
                >
                  English
                </Button>
                <Button 
                  variant={displayLang === 'ar' ? 'default' : 'ghost'} 
                  size="sm" 
                  className="rounded-lg px-4"
                  onClick={() => setDisplayLang('ar')}
                >
                  Arabic
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[40%]">Question</TableHead>
                    <TableHead>Target App</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((faq) => (
                    <TableRow key={faq.id} className="group transition-colors hover:bg-muted/5">
                      <TableCell className={cn(
                        "font-medium py-4 text-sm",
                        displayLang === 'ar' && "text-right"
                      )} dir={displayLang === 'ar' ? 'rtl' : 'ltr'}>
                        {displayLang === 'en' ? faq.title.en : faq.title.ar}
                      </TableCell>
                      <TableCell>
                        <Badge variant={faq.target === 'USER' ? 'default' : 'destructive'} className="text-[9px] font-black uppercase tracking-widest">
                          {faq.target}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={faq.isActive ? 'active' : 'inactive'}>
                          {faq.isActive ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => setModal({ open: true, faq })}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive hover:bg-destructive/5" onClick={() => handleDelete(faq.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>

      <FAQModal 
        open={modal.open} 
        faq={modal.faq} 
        onClose={() => setModal({ open: false, faq: null })}
        onSave={handleSave}
      />
    </div>
  )
}

function FAQModal({ open, faq, onClose, onSave }) {
  const { t } = useTranslation('cms')
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    title: { en: '', ar: '' },
    content: { en: '', ar: '' },
    target: 'USER',
    isActive: true
  })

  useEffect(() => {
    if (faq) {
      setForm({
        title: faq.title || { en: '', ar: '' },
        content: faq.content || { en: '', ar: '' },
        target: faq.target || 'USER',
        isActive: faq.isActive !== undefined ? faq.isActive : true
      })
    } else {
      setForm({
        title: { en: '', ar: '' },
        content: { en: '', ar: '' },
        target: 'USER',
        isActive: true
      })
    }
  }, [faq, open])

  const handleSubmit = async () => {
    setIsSaving(true)
    await onSave(form)
    setIsSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="pr-8">
            {faq ? 'Edit FAQ Content' : 'Add New FAQ'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4 overflow-y-auto max-h-[70vh]">
           <div className="space-y-3">
              <Label className="text-sm font-bold flex items-center gap-2 tracking-widest uppercase opacity-60">
                <Target className="h-4 w-4" /> Target App
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'USER', label: 'User App', sub: 'Customers' },
                  { id: 'TENANT', label: 'Dashboard', sub: 'Owners' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setForm({...form, target: item.id})}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all",
                      form.target === item.id ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "border-border hover:border-primary/40 bg-muted/20"
                    )}
                  >
                    <span className="text-xs font-black">{item.label}</span>
                    <span className="text-[9px] opacity-60 uppercase">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* English Version */}
            <div className="space-y-4 rounded-xl border border-border/50 bg-muted/20 p-4">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <Badge variant="active" className="rounded-md">EN</Badge>
                <span className="text-sm font-bold">English Version</span>
              </div>
              <div className="space-y-2">
                <Label>Question</Label>
                <Input 
                  placeholder="Enter question in English"
                  value={form.title.en}
                  onChange={(e) => setForm({ ...form, title: {...form.title, en: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <textarea 
                  placeholder="Enter answer in English"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={form.content.en}
                  onChange={(e) => setForm({ ...form, content: {...form.content, en: e.target.value } })}
                />
              </div>
            </div>

            {/* Arabic Version */}
            <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4" dir="rtl">
              <div className="flex items-center gap-2 border-b border-primary/10 pb-2 flex-row-reverse">
                <Badge variant="active" className="rounded-md bg-primary text-primary-foreground">AR</Badge>
                <span className="text-sm font-bold">Arabic Version</span>
              </div>
              <div className="space-y-2 text-right">
                <Label>السؤال (Question)</Label>
                <Input 
                  className="text-right"
                  placeholder="أدخل السؤال بالعربية"
                  value={form.title.ar}
                  onChange={(e) => setForm({ ...form, title: {...form.title, ar: e.target.value } })}
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>الإجابة (Answer)</Label>
                <textarea 
                    className="flex min-h-[120px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="أدخل الإجابة بالعربية"
                  value={form.content.ar}
                  onChange={(e) => setForm({ ...form, content: {...form.content, ar: e.target.value } })}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="border-t pt-4 gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving} className="rounded-xl px-6">Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSaving} className="rounded-xl px-8 shadow-lg shadow-primary/20">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save FAQ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
