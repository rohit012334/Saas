import React, { useState } from 'react'
import { Plus, Pencil, Trash2, Search, Languages, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '../../../components/shared/Badge'
import { toast } from '../../../utils/toast'
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

// Initial data source - isme FAQs ke questions aur answers (English & Arabic) hain
const initialFaqs = [
  { 
    id: 1, 
    questionEn: 'How do I reset my password?', 
    answerEn: 'Go to the login page and click on Forgot Password.',
    questionAr: 'كيف يمكنني إعادة تعيين كلمة المرور الخاصة بي؟',
    answerAr: 'اذهب إلى صفحة تسجيل الدخول وانقر على نسيت كلمة المرور.',
    category: 'Account', 
    status: 'Published' 
  },
  { 
    id: 2, 
    questionEn: 'What are the subscription plans?', 
    answerEn: 'We offer Basic, Pro, and Enterprise plans.',
    questionAr: 'ما هي خطط الاشتراك؟',
    answerAr: 'نحن نقدم خطط Basic و Pro و Enterprise.',
    category: 'Billing', 
    status: 'Published' 
  },
]

export function FAQList() {
  const { t } = useTranslation('cms')
  const [faqs, setFaqs] = useState(initialFaqs) // FAQs list ki state
  const [search, setSearch] = useState('') // Search keyword state
  const [displayLang, setDisplayLang] = useState('en') // Table me konsi language dikhani hai (EN/AR)
  const [modal, setModal] = useState({ open: false, faq: null }) // Add/Edit modal ki state

  const filtered = faqs.filter(f => {
    const qEn = f.questionEn.toLowerCase()
    const qAr = f.questionAr.toLowerCase()
    const s = search.toLowerCase()
    return qEn.includes(s) || qAr.includes(s) || f.category.toLowerCase().includes(s)
  })

  // FAQ save ya update karne ka logic
  const handleSave = (faq) => {
    if (modal.faq) {
      // Exist karta hai matlab edit mode hai
      setFaqs(faqs.map(f => f.id === modal.faq.id ? { ...faq, id: f.id } : f))
      toast.success('FAQ updated successfully')
    } else {
      // Naya FAQ add karne ka logic
      setFaqs([...faqs, { ...faq, id: Date.now() }])
      toast.success('New FAQ added')
    }
    setModal({ open: false, faq: null })
  }

  const handleDelete = (id) => {
    setFaqs(faqs.filter(f => f.id !== id))
    toast.success('FAQ deleted')
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
                  {t('faq.english')}
                </Button>
                <Button 
                  variant={displayLang === 'ar' ? 'default' : 'ghost'} 
                  size="sm" 
                  className="rounded-lg px-4"
                  onClick={() => setDisplayLang('ar')}
                >
                  {t('faq.arabic')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[50%]">{t('faq.table.question')}</TableHead>
                  <TableHead>{t('faq.table.category')}</TableHead>
                  <TableHead>{t('faq.table.status')}</TableHead>
                  <TableHead className="text-right">{t('faq.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((faq) => (
                  <TableRow key={faq.id} className="group transition-colors hover:bg-muted/5">
                    <TableCell className={cn(
                      "font-medium py-4",
                      displayLang === 'ar' && "text-right"
                    )} dir={displayLang === 'ar' ? 'rtl' : 'ltr'}>
                      {/* Toggle ke basis par ya EN dikhega ya AR */}
                      {displayLang === 'en' ? faq.questionEn : faq.questionAr}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted/50">{faq.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={faq.status === 'Published' ? 'active' : 'inactive'}>
                        {faq.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
  const [form, setForm] = useState({
    questionEn: '',
    answerEn: '',
    questionAr: '',
    answerAr: '',
    category: 'General',
    status: 'Published'
  })

  React.useEffect(() => {
    if (faq) {
      setForm(faq)
    } else {
      setForm({
        questionEn: '',
        answerEn: '',
        questionAr: '',
        answerAr: '',
        category: 'General',
        status: 'Published'
      })
    }
  }, [faq, open])

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="pr-8">
            {faq ? t('faq.modal.edit') : t('faq.modal.add')}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* English Version */}
            <div className="space-y-4 rounded-xl border border-border/50 bg-muted/20 p-4">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <Badge variant="active" className="rounded-md">EN</Badge>
                <span className="text-sm font-bold">{t('faq.modal.en')}</span>
              </div>
              <div className="space-y-2">
                <Label>{t('faq.modal.question')}</Label>
                <Input 
                  placeholder="Enter question in English"
                  value={form.questionEn}
                  onChange={(e) => setForm({ ...form, questionEn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('faq.modal.answer')}</Label>
                <textarea 
                  placeholder="Enter answer in English"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={form.answerEn}
                  onChange={(e) => setForm({ ...form, answerEn: e.target.value })}
                />
              </div>
            </div>

            {/* Arabic Version */}
            <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4" dir="rtl">
              <div className="flex items-center gap-2 border-b border-primary/10 pb-2 flex-row-reverse">
                <Badge variant="active" className="rounded-md bg-primary text-primary-foreground">AR</Badge>
                <span className="text-sm font-bold">{t('faq.modal.ar')}</span>
              </div>
              <div className="space-y-2 text-right">
                <Label>{t('faq.modal.question')}</Label>
                <Input 
                  className="text-right"
                  placeholder="أدخل السؤال بالعربية"
                  value={form.questionAr}
                  onChange={(e) => setForm({ ...form, questionAr: e.target.value })}
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>{t('faq.modal.answer')}</Label>
                <textarea 
                    className="flex min-h-[120px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="أدخل الإجابة بالعربية"
                  value={form.answerAr}
                  onChange={(e) => setForm({ ...form, answerAr: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('faq.modal.category')}</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Account">Account</option>
                <option value="Billing">Billing</option>
                <option value="Support">Support</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>{t('faq.modal.status')}</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter className="border-t pt-4 gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl px-6">{t('faq.modal.cancel')}</Button>
          <Button onClick={() => onSave(form)} className="rounded-xl px-8 shadow-lg shadow-primary/20">{t('faq.modal.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

