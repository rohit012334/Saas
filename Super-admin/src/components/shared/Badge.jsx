import React from 'react'
import { Badge as ShadcnBadge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const variantMap = {
  active: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20',
  suspended: 'bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20',
  trial: 'bg-amber-500/15 text-amber-500 border-amber-500/30 hover:bg-amber-500/20',
  pending: 'bg-primary/15 text-primary border-primary/30 hover:bg-primary/20',
  paid: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  failed: 'bg-destructive/15 text-destructive border-destructive/30',
  refunded: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  inactive: 'bg-muted text-muted-foreground border-border',
  success: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  superAdmin: 'bg-destructive/15 text-destructive border-destructive/30',
  supportManager: 'bg-primary/15 text-primary border-primary/30',
  billingAdmin: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  technicalAdmin: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
  default: 'bg-muted text-muted-foreground border-border',
}

export function Badge({ children, variant = 'default', className = '' }) {
  const extra = variantMap[variant] || variantMap.default
  return (
    <ShadcnBadge variant="outline" className={cn('border font-medium', extra, className)}>
      {children}
    </ShadcnBadge>
  )
}
