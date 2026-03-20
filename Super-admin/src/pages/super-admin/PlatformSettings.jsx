import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Save, Database } from 'lucide-react'
import { toast } from '../../utils/toast'
import { ConfirmDialog } from '../../components/shared/ConfirmDialog'
import { PageHeader } from '../../components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function PlatformSettings() {
  const { t } = useTranslation('settings')
  const [activeTab, setActiveTab] = useState('general')
  const [maintenanceConfirm, setMaintenanceConfirm] = useState(false)
  const [maintenanceOn, setMaintenanceOn] = useState(false)

  const tabs = [
    { id: 'general', key: 'tabs.general' },
    { id: 'tenantDefaults', key: 'tabs.tenantDefaults' },
    { id: 'emailTemplates', key: 'tabs.emailTemplates' },
    { id: 'backupMaintenance', key: 'tabs.backupMaintenance' },
  ]

  return (
    <div className="space-y-6 animate-in">
      <PageHeader title={t('title')} />

      <div className="flex gap-2 border-b border-border pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={cn(activeTab !== tab.id && 'text-muted-foreground')}
          >
            {t(tab.key)}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {activeTab === 'general' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('general.platformName')}</Label>
                <Input defaultValue="GMS by YASSIR" />
              </div>
              <div className="space-y-2">
                <Label>{t('general.platformLogo')}</Label>
                <Input type="file" accept="image/*" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>{t('general.supportEmail')}</Label>
                <Input type="email" defaultValue="support@yassir.com" />
              </div>
              <div className="space-y-2">
                <Label>{t('general.supportPhone')}</Label>
                <Input type="tel" defaultValue="+971 4 123 4567" />
              </div>
              <div className="space-y-2">
                <Label>{t('general.defaultCurrency')}</Label>
                <select className={cn('h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}>
                  <option>INR ($)</option>
                  <option>AED</option>
                  <option>SAR</option>
                  <option>USD</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t('general.defaultLanguage')}</Label>
                <select className={cn('h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}>
                  <option>English</option>
                  <option>Arabic</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t('general.timezone')}</Label>
                <select className={cn('h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}>
                  <option>Asia/Dubai</option>
                  <option>Asia/Kolkata</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t('general.dateFormat')}</Label>
                <select className={cn('h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}>
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Button onClick={() => toast.success('Settings saved')}>
                  <Save className="h-4 w-4" />
                  {t('general.save')}
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'tenantDefaults' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('tenantDefaults.defaultTrial')}</Label>
                <Input type="number" defaultValue={14} className="max-w-xs" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked />
                {t('tenantDefaults.autoApprove')}
              </label>
              <div className="space-y-2">
                <Label>{t('tenantDefaults.maxStaffPerPlan')}</Label>
                <Input defaultValue="Basic: 2, Pro: 10, Enterprise: Unlimited" />
              </div>
              <div className="space-y-2">
                <Label>{t('tenantDefaults.maxVehiclesPerPlan')}</Label>
                <Input defaultValue="Basic: 50, Pro: 200, Enterprise: Unlimited" />
              </div>
              <Button onClick={() => toast.success('Saved')}>{t('tenantDefaults.save')}</Button>
            </div>
          )}

          {activeTab === 'emailTemplates' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('emailTemplates.selectTemplate')}</Label>
                <select className={cn('h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}>
                  <option>{t('emailTemplates.welcome')}</option>
                  <option>{t('emailTemplates.invoice')}</option>
                  <option>{t('emailTemplates.paymentFailed')}</option>
                  <option>{t('emailTemplates.suspension')}</option>
                  <option>{t('emailTemplates.passwordReset')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t('emailTemplates.subject')}</Label>
                <Input placeholder="Subject" />
              </div>
              <div className="space-y-2">
                <Label>{t('emailTemplates.body')}</Label>
                <textarea rows={6} className={cn('w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')} placeholder="Body" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">{t('emailTemplates.preview')}</Button>
                <Button onClick={() => toast.success('Template saved')}>{t('emailTemplates.saveTemplate')}</Button>
              </div>
            </div>
          )}

          {activeTab === 'backupMaintenance' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                {t('backup.lastBackup')}: 2026-03-09 02:00
              </div>
              <div className="space-y-2">
                <Label>{t('backup.backupFrequency')}</Label>
                <select className={cn('h-10 max-w-xs rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}>
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </div>
              <Button variant="outline" onClick={() => toast.success('Backup started')}>{t('backup.manualBackup')}</Button>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={maintenanceOn}
                    onChange={(e) => {
                      if (e.target.checked) setMaintenanceConfirm(true)
                      else setMaintenanceOn(false)
                    }}
                  />
                  {t('backup.maintenanceMode')}
                </label>
                {maintenanceOn && <span className="text-xs text-amber-500">{t('backup.maintenanceWarning')}</span>}
              </div>
              <p className="text-sm text-muted-foreground">{t('backup.systemVersion')}: 1.0.0</p>

              <ConfirmDialog
                open={maintenanceConfirm}
                title={t('backup.maintenanceMode')}
                message={t('backup.maintenanceWarning')}
                danger
                onConfirm={() => {
                  setMaintenanceOn(true)
                  setMaintenanceConfirm(false)
                  toast.warning('Maintenance mode enabled')
                }}
                onCancel={() => setMaintenanceConfirm(false)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
