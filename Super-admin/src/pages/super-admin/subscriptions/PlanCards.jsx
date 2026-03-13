import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Wrench,
  Package,
  FileText,
  Building2,
  Users,
  MessageCircle,
  Car,
  Pencil,
  Trash2,
  Check,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { cn } from '@/lib/utils'



const featureIcons = {
  job: Wrench,
  jobs: Wrench,
  vehicle: Car,
  vehicles: Car,
  mechanic: Users,
  mechanics: Users,
  inventory: Package,
  parts: Package,
  report: FileText,
  reports: FileText,
  branch: Building2,
  multi: Building2,
  whatsapp: MessageCircle,
  email: MessageCircle,
  support: MessageCircle,
}
function getFeatureIcon(featureText) {
  const lower = featureText.toLowerCase()
  for (const [key, Icon] of Object.entries(featureIcons)) {
    if (lower.includes(key)) return Icon
  }
  return Check
}

export function PlanCards({ plans, onEdit, onDelete }) {
  const { t } = useTranslation(['subscriptions', 'common'])
  const [vehicleFilter, setVehicleFilter] = useState('2 Wheelers')

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => p.vehicleType === vehicleFilter)
  }, [plans, vehicleFilter])

  return (
    <div className="space-y-6">
      {/* Toggle: 2 Wheeler | 4 Wheeler | Both — photo jaisa */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-0">
        <div className="inline-flex rounded-xl border border-border bg-muted/30 p-1">
          {['2 Wheelers', '4 Wheelers', 'Both', '4 Wheeler + Heavy Vehicle'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setVehicleFilter(opt)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                vehicleFilter === opt
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t(`vehicleTypes.${opt}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards — reference image structure */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlans.map((plan) => (
          <Card
            key={plan.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="flex flex-1 flex-col pt-6 pb-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">{plan.planName}</span>
                <Badge variant={plan.status === 'Active' ? 'active' : 'inactive'} className="shrink-0">
                  {plan.status}
                </Badge>
              </div>

              <p className="text-2xl font-bold tracking-tight text-foreground">
                ₹{Number(plan.price).toLocaleString()}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                INR / {plan.duration === 'Monthly' ? t('monthly') : t('yearly')} ({t('tenants:gst')})
              </p>

              <p className="mt-3 text-xs text-muted-foreground">
                {plan.maxJobsPerMonth} jobs/mo · {plan.maxVehicles} vehicles · {plan.maxMechanics} mechanics
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features?.map((f, i) => {
                  const Icon = getFeatureIcon(f)
                  return (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{f}</span>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-6 flex gap-2 border-t border-border/50 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit(plan)}
                >
                  <Pencil className="h-4 w-4" />
                  {t('common:edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(plan)}
                >
                  <Trash2 className="h-4 w-4" />
                  {t('common:delete')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center text-muted-foreground">
          <p className="font-medium">{t('noPlansFor')} {t(`vehicleTypes.${vehicleFilter}`)}</p>
          <p className="mt-1 text-sm">{t('addPlanNotice')}</p>
        </div>
      )}
    </div>
  )
}
