import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Send, Eye, Copy, Trash2 } from 'lucide-react'
import { announcements } from '../../data/dummyData'
import { PageHeader } from '../../components/shared/PageHeader'
import { Badge } from '../../components/shared/Badge'
import { toast } from '../../utils/toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function Announcements() {
  const { t } = useTranslation('announcements')
  const [form, setForm] = useState({
    title: '',
    message: '',
    target: 'All Tenants',
    channels: { inApp: false, email: false, sms: false, whatsapp: false },
    schedule: 'now',
    dateTime: '',
  })

  const handleSend = () => {
    if (!form.title.trim()) return
    toast.success(t('successSend'))
    setForm((f) => ({ ...f, title: '', message: '' }))
  }

  return (
    <div className="space-y-6 animate-in">
      <PageHeader title={t('title')} />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t('composeTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('form.title')}</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder={t('form.titlePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('form.message')}</Label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder={t('form.messagePlaceholder')}
                rows={4}
                className={cn('w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('form.target')}</Label>
              <select
                value={form.target}
                onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
                className={cn('h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
              >
                <option value="All Tenants">{t('form.targetAll')}</option>
                <option value="Basic">{t('form.targetBasic')}</option>
                <option value="Pro">{t('form.targetPro')}</option>
                <option value="Enterprise">{t('form.targetEnterprise')}</option>
                <option value="Specific">{t('form.targetSpecific')}</option>
              </select>
            </div>
            <div>
              <span className="mb-2 block text-sm text-muted-foreground">{t('form.deliveryChannel')}</span>
              <div className="flex flex-wrap gap-3">
                {['inApp', 'email', 'sms', 'whatsapp'].map((key) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.channels[key]}
                      onChange={(e) => setForm((f) => ({ ...f, channels: { ...f.channels, [key]: e.target.checked } }))}
                      className="rounded border-input text-primary"
                    />
                    {t(`form.${key === 'inApp' ? 'inApp' : key}`)}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-2 block text-sm text-muted-foreground">{t('form.schedule')}</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="schedule"
                    checked={form.schedule === 'now'}
                    onChange={() => setForm((f) => ({ ...f, schedule: 'now' }))}
                    className="text-primary"
                  />
                  {t('form.sendNow')}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="schedule"
                    checked={form.schedule === 'later'}
                    onChange={() => setForm((f) => ({ ...f, schedule: 'later' }))}
                    className="text-primary"
                  />
                  {t('form.sendLater')}
                </label>
              </div>
              {form.schedule === 'later' && (
                <Input
                  type="datetime-local"
                  value={form.dateTime}
                  onChange={(e) => setForm((f) => ({ ...f, dateTime: e.target.value }))}
                  className="mt-2"
                />
              )}
            </div>
            <Button className="w-full" onClick={handleSend}>
              <Send className="h-4 w-4" />
              {t('form.sendButton')}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">{t('listTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{a.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t('sentDate')}: {a.sentDate} | {t('target')}: {a.target} | {t('channels')}: {a.channels?.join(', ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('delivered')}: {a.deliveredCount} | {t('read')}: {a.readCount}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant={a.status === 'Sent' ? 'paid' : a.status === 'Scheduled' ? 'trial' : 'default'}>{t(`status${a.status}`)}</Badge>
                      <Button variant="ghost" size="icon-sm" title={t('view')}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon-sm" title={t('duplicate')} onClick={() => toast.success('Duplicated')}><Copy className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon-sm" title={t('delete')} onClick={() => toast.error('Deleted')} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
