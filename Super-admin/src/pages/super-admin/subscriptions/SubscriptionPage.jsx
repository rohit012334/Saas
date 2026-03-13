import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, LayoutList } from 'lucide-react'
import { subscriptionPlansAdmin } from '../../../data/dummyData'
import { PageHeader } from '../../../components/shared/PageHeader'
import { PlanCards } from './PlanCards'
import { PlanTable } from './PlanTable'
import { AddPlanModal } from './AddPlanModal'
import { EditPlanModal } from './EditPlanModal'
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog'
import { toast } from '../../../utils/toast'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SubscriptionPage() {
  const { t } = useTranslation(['subscriptions', 'common'])
  const [plans, setPlans] = useState(() => [...subscriptionPlansAdmin])
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editPlan, setEditPlan] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, plan: null })
  const [viewMode, setViewMode] = useState('cards') // 'cards' | 'table'
  const [billingCycle, setBillingCycle] = useState('Monthly') // 'Monthly' | 'Yearly'

  const handleAdd = useCallback((newPlan) => {
    setPlans((prev) => [newPlan, ...prev])
    toast.success(t('successAdd'))
  }, [t])

  const handleEditSave = useCallback((updatedPlan) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    )
    toast.success(t('successUpdate'))
    setEditPlan(null)
  }, [t])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.plan) {
      setPlans((prev) => prev.filter((p) => p.id !== deleteConfirm.plan.id))
      toast.success(t('successDelete'))
    }
    setDeleteConfirm({ open: false, plan: null })
  }, [deleteConfirm.plan, t])
  
  const filteredPlans = plans.filter(plan => plan.duration === billingCycle)

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title={t('plansTitle')}
        subtitle={t('plansSubtitle')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
              title={viewMode === 'cards' ? t('common:tableView') : t('common:cardView')}
            >
              <LayoutList className="h-4 w-4" />
              {viewMode === 'cards' ? t('common:tableView') : t('common:cardView')}
            </Button>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4" />
              {t('addPlan')}
            </Button>
          </div>
        }
      />

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center rounded-2xl bg-muted/30 p-1.5 shadow-inner">
          <Button
            variant={billingCycle === 'Monthly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingCycle('Monthly')}
            className={cn(
              "rounded-xl px-8 transition-all duration-300",
              billingCycle === 'Monthly' ? "shadow-md" : "hover:bg-primary/5"
            )}
          >
            {t('common:monthly')}
          </Button>
          <Button
            variant={billingCycle === 'Yearly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingCycle('Yearly')}
            className={cn(
              "rounded-xl px-8 transition-all duration-300",
              billingCycle === 'Yearly' ? "shadow-md" : "hover:bg-primary/5"
            )}
          >
            {t('common:yearly')}
          </Button>
        </div>

        {billingCycle === 'Yearly' && (
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-emerald-600 dark:bg-emerald-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold tracking-tight uppercase">{t('common:saveYearly')}</span>
          </div>
        )}
      </div>

      {viewMode === 'cards' ? (
        <PlanCards
          plans={filteredPlans}
          onEdit={setEditPlan}
          onDelete={(plan) => setDeleteConfirm({ open: true, plan })}
        />
      ) : (
        <PlanTable
          plans={filteredPlans}
          onEdit={setEditPlan}
          onDelete={(plan) => setDeleteConfirm({ open: true, plan })}
        />
      )}

      <AddPlanModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAdd}
      />

      <EditPlanModal
        plan={editPlan}
        open={!!editPlan}
        onClose={() => setEditPlan(null)}
        onSave={handleEditSave}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        title={t('common:delete')}
        message={t('common:deleteConfirmMessage')}
        danger
        confirmLabel={t('common:delete')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, plan: null })}
      />
    </div>
  )
}
