import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FeatureInputList } from './FeatureInputList'
import { cn } from '@/lib/utils'

const VEHICLE_TYPES = ['2 Wheeler', '4 Wheeler', 'Both', '4 Wheeler + Heavy Vehicle']
const DURATIONS = ['Monthly', 'Yearly']
const STATUS_OPTIONS = ['Active', 'Inactive']

export function EditPlanModal({ plan, open, onClose, onSave }) {
  const [form, setForm] = useState({
    planName: '',
    vehicleType: '2 Wheeler',
    duration: 'Monthly',
    price: '',
    maxJobsPerMonth: '',
    maxVehicles: '',
    maxMechanics: '',
    features: [],
    inventoryEnabled: false,
    reportsEnabled: false,
    multiBranchEnabled: false,
    status: 'Active',
  })

  useEffect(() => {
    if (plan) {
      setForm({
        planName: plan.planName ?? '',
        vehicleType: plan.vehicleType ?? '2 Wheeler',
        duration: plan.duration ?? 'Monthly',
        price: plan.price ?? '',
        maxJobsPerMonth: plan.maxJobsPerMonth ?? '',
        maxVehicles: plan.maxVehicles ?? '',
        maxMechanics: plan.maxMechanics ?? '',
        features: Array.isArray(plan.features) ? [...plan.features] : [],
        inventoryEnabled: !!plan.inventoryEnabled,
        reportsEnabled: !!plan.reportsEnabled,
        multiBranchEnabled: !!plan.multiBranchEnabled,
        status: plan.status ?? 'Active',
      })
    }
  }, [plan])

  const handleOpenChange = (next) => {
    if (!next) onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...plan,
      planName: form.planName.trim(),
      vehicleType: form.vehicleType,
      duration: form.duration,
      price: Number(form.price) || 0,
      maxJobsPerMonth: Number(form.maxJobsPerMonth) || 0,
      maxVehicles: Number(form.maxVehicles) || 0,
      maxMechanics: Number(form.maxMechanics) || 0,
      features: form.features.filter(Boolean),
      inventoryEnabled: form.inventoryEnabled,
      reportsEnabled: form.reportsEnabled,
      multiBranchEnabled: form.multiBranchEnabled,
      status: form.status,
    }
    onSave(payload)
    onClose()
  }

  if (!plan) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit plan — {plan.planName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-planName">Plan name</Label>
              <Input
                id="edit-planName"
                value={form.planName}
                onChange={(e) => setForm({ ...form, planName: e.target.value })}
                placeholder="e.g. Garage Pro"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-vehicleType">Vehicle type</Label>
              <select
                id="edit-vehicleType"
                value={form.vehicleType}
                onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                className={cn(
                  'h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
              >
                {VEHICLE_TYPES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration</Label>
              <select
                id="edit-duration"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className={cn(
                  'h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (₹)</Label>
              <Input
                id="edit-price"
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-maxJobs">Max jobs per month</Label>
              <Input
                id="edit-maxJobs"
                type="number"
                min={0}
                value={form.maxJobsPerMonth}
                onChange={(e) => setForm({ ...form, maxJobsPerMonth: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-maxVehicles">Max vehicles</Label>
              <Input
                id="edit-maxVehicles"
                type="number"
                min={0}
                value={form.maxVehicles}
                onChange={(e) => setForm({ ...form, maxVehicles: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-maxMechanics">Max mechanics</Label>
              <Input
                id="edit-maxMechanics"
                type="number"
                min={0}
                value={form.maxMechanics}
                onChange={(e) => setForm({ ...form, maxMechanics: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={cn(
                  'h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <FeatureInputList features={form.features} onChange={(features) => setForm({ ...form, features })} />

          <div className="flex flex-wrap gap-6 rounded-lg border border-border/50 bg-muted/30 p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.inventoryEnabled}
                onChange={(e) => setForm({ ...form, inventoryEnabled: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <span className="text-sm font-medium">Inventory enabled</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.reportsEnabled}
                onChange={(e) => setForm({ ...form, reportsEnabled: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <span className="text-sm font-medium">Reports enabled</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.multiBranchEnabled}
                onChange={(e) => setForm({ ...form, multiBranchEnabled: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <span className="text-sm font-medium">Multi branch enabled</span>
            </label>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
