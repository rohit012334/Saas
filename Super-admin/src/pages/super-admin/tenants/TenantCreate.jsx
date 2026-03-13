import React, { useState } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { subscriptionPlans, tenants } from '../../../data/dummyData'
import { PageHeader } from '../../../components/shared/PageHeader'
import { toast } from '../../../utils/toast'
import { Upload } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const countries = ['India', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Egypt', 'Bahrain', 'Kuwait', 'Oman']
export function TenantCreate() {
  const { t } = useTranslation('tenants')
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [form, setForm] = useState({
    garageName: '',
    ownerFullName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    address: '',
    gstNumber: '',
    plan: '',
    trialDays: '14',
    sendWelcomeEmail: false,
    notes: '',
    // Documents
    tradeLicense: null,
    gstCertificate: null,
    rentAgreement: null,
    workshopPhotos: null,
    ownerId: null,
    ownerAddressProof: null,
    ownerPhoto: null,
  })
  const [errors, setErrors] = useState({})

  React.useEffect(() => {
    if (isEdit) {
      // In a real app, fetch from API. Here we find in dummyData.
      const t = tenants.find(x => x.id === id)
      if (t) {
        setForm({
          garageName: t.name,
          ownerFullName: t.ownerName,
          email: t.email,
          phone: t.phone,
          city: t.city,
          country: t.country,
          address: t.address || '',
          gstNumber: t.gstNumber || '',
          plan: t.plan,
          trialDays: '14',
          sendWelcomeEmail: false,
          notes: '',
        })
      }
    }
  }, [id, isEdit])

  const validate = () => {
    const e = {}
    if (!form.garageName?.trim()) e.garageName = t('required')
    if (!form.ownerFullName?.trim()) e.ownerFullName = t('required')
    if (!form.email?.trim()) e.email = t('required')
    if (!form.phone?.trim()) e.phone = t('required')
    if (!form.city?.trim()) e.city = t('required')
    if (!form.country?.trim()) e.country = t('required')
    if (!form.plan?.trim()) e.plan = t('required')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    toast.success(isEdit ? t('successUpdate') : t('successCreate'))
    navigate('/super-admin/tenants')
  }

  const showTrial = form.plan === 'Trial'
  const inputClass = 'h-10'

  return (
    <div className="space-y-6 animate-in">
      <PageHeader title={isEdit ? `${t('edit')}: ${form.garageName}` : t('createTitle')} />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('form.garageName')} *</Label>
                <Input
                  value={form.garageName}
                  onChange={(e) => setForm((f) => ({ ...f, garageName: e.target.value }))}
                  placeholder={t('form.garageNamePlaceholder')}
                  className={inputClass}
                />
                {errors.garageName && <p className="text-xs text-destructive">{errors.garageName}</p>}
              </div>
              <div className="space-y-2">
                <Label>{t('form.ownerFullName')} *</Label>
                <Input
                  value={form.ownerFullName}
                  onChange={(e) => setForm((f) => ({ ...f, ownerFullName: e.target.value }))}
                  placeholder={t('form.ownerFullNamePlaceholder')}
                  className={inputClass}
                />
                {errors.ownerFullName && <p className="text-xs text-destructive">{errors.ownerFullName}</p>}
              </div>
              <div className="space-y-2">
                <Label>{t('form.email')} *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder={t('form.emailPlaceholder')}
                  className={inputClass}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label>{t('form.phone')} *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder={t('form.phonePlaceholder')}
                  className={inputClass}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label>{t('form.city')} *</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder={t('form.cityPlaceholder')}
                  className={inputClass}
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
              </div>
              <div className="space-y-2">
                <Label>{t('form.country')} *</Label>
                <select
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  className={cn('h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
                >
                  <option value="">{t('form.countryPlaceholder')}</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>{t('form.address')}</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder={t('form.addressPlaceholder')}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('form.gstNumber')}</Label>
                <Input
                  value={form.gstNumber}
                  onChange={(e) => setForm((f) => ({ ...f, gstNumber: e.target.value }))}
                  placeholder={t('form.gstNumberPlaceholder')}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('form.subscriptionPlan')} *</Label>
                <select
                  value={form.plan}
                  onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
                  className={cn('h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
                >
                  <option value="">{t('form.subscriptionPlanPlaceholder')}</option>
                  {subscriptionPlans.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                  <option value="Trial">Trial</option>
                </select>
                {errors.plan && <p className="text-xs text-destructive">{errors.plan}</p>}
              </div>
              {showTrial && (
                <div className="space-y-2">
                  <Label>{t('form.trialPeriod')}</Label>
                  <Input
                    type="number"
                    value={form.trialDays}
                    onChange={(e) => setForm((f) => ({ ...f, trialDays: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              )}
              <div className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  id="welcome"
                  checked={form.sendWelcomeEmail}
                  onChange={(e) => setForm((f) => ({ ...f, sendWelcomeEmail: e.target.checked }))}
                  className="h-4 w-4 rounded border-input text-primary"
                />
                <Label htmlFor="welcome" className="font-normal">{t('form.sendWelcomeEmail')}</Label>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>{t('form.notes')}</Label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder={t('form.notesPlaceholder')}
                  rows={3}
                  className={cn('w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
                />
              </div>

              <div className="space-y-4 sm:col-span-2">
                <hr className="my-2 border-border" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('form.garageDocuments')}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DocumentUpload 
                    label={t('form.tradeLicense')} 
                    onChange={(file) => setForm(f => ({ ...f, tradeLicense: file }))} 
                  />
                  <DocumentUpload 
                    label={t('form.gstCertificate')} 
                    onChange={(file) => setForm(f => ({ ...f, gstCertificate: file }))} 
                  />
                  <DocumentUpload 
                    label={t('form.rentAgreement')} 
                    onChange={(file) => setForm(f => ({ ...f, rentAgreement: file }))} 
                  />
                  <DocumentUpload 
                    label={t('form.workshopPhotos')} 
                    onChange={(file) => setForm(f => ({ ...f, workshopPhotos: file }))} 
                  />
                </div>
              </div>

              <div className="space-y-4 sm:col-span-2">
                <hr className="my-2 border-border" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('form.ownerDocuments')}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DocumentUpload 
                    label={t('form.ownerId')} 
                    onChange={(file) => setForm(f => ({ ...f, ownerId: file }))} 
                  />
                  <DocumentUpload 
                    label={t('form.ownerAddressProof')} 
                    onChange={(file) => setForm(f => ({ ...f, ownerAddressProof: file }))} 
                  />
                  <DocumentUpload 
                    label={t('form.ownerPhoto')} 
                    onChange={(file) => setForm(f => ({ ...f, ownerPhoto: file }))} 
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button type="button" variant="outline" asChild>
                <Link to="/super-admin/tenants">{t('form.cancel')}</Link>
              </Button>
              <Button type="submit">{isEdit ? t('edit') : t('form.saveAndCreate')}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

function DocumentUpload({ label, onChange }) {
  const { t } = useTranslation('tenants')
  const [fileName, setFileName] = React.useState('')
  
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
      onChange(e.target.files[0])
    }
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="relative group">
        <div className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
          fileName ? "border-primary/50 bg-primary/5" : "hover:border-primary/30"
        )}>
          <span className={cn("truncate max-w-[150px]", fileName ? "text-primary font-medium" : "text-muted-foreground")}>
            {fileName || t('form.clickToUpload')}
          </span>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={() => document.getElementById(`upload-${label}`).click()}
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <input 
          id={`upload-${label}`}
          type="file" 
          className="hidden" 
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

