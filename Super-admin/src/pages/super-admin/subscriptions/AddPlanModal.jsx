import React, { useState } from 'react'
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

const VEHICLE_TYPES = ['Motorcycles', 'Car', 'Truck', 'Bus', 'Heavy Equipments']
const DURATIONS = ['Monthly', '3 Months', 'Yearly']
const STATUS_OPTIONS = ['Active', 'Inactive']

const emptyPlan = {
  planName: '',
  vehicleType: 'Motorcycles',
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
}

export function AddPlanModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(emptyPlan)

  const reset = () => setForm({ ...emptyPlan })

  const handleOpenChange = (next) => {
    if (!next) {
      reset()
      onClose()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      id: `plan-${Date.now()}`,
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
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add subscription plan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="planName">Plan name</Label>
              <Input
                id="planName"
                value={form.planName}
                onChange={(e) => setForm({ ...form, planName: e.target.value })}
                placeholder="e.g. Garage Pro"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle type</Label>
              <select
                id="vehicleType"
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
              <Label htmlFor="duration">Duration</Label>
              <select
                id="duration"
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
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxJobs">Max jobs per month</Label>
              <Input
                id="maxJobs"
                type="number"
                min={0}
                value={form.maxJobsPerMonth}
                onChange={(e) => setForm({ ...form, maxJobsPerMonth: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxVehicles">Max vehicles</Label>
              <Input
                id="maxVehicles"
                type="number"
                min={0}
                value={form.maxVehicles}
                onChange={(e) => setForm({ ...form, maxVehicles: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxMechanics">Max mechanics</Label>
              <Input
                id="maxMechanics"
                type="number"
                min={0}
                value={form.maxMechanics}
                onChange={(e) => setForm({ ...form, maxMechanics: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
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
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add plan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
