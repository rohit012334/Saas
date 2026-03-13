import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const variantColors = {
  default: 'text-foreground',
  success: 'text-emerald-500',
  danger: 'text-destructive',
  warning: 'text-amber-500',
  muted: 'text-muted-foreground',
}

export function StatCard({ icon: Icon, label, value, change, changeLabel, variant = 'default' }) {
  const isPositive = change != null && change >= 0
  const colorClass = variantColors[variant] || variantColors.default

  return (
    <Card className="transition-shadow hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold tabular-nums tracking-tight sm:text-3xl ${colorClass}`}>
          {value}
        </p>
        {change != null && (
          <span
            className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              isPositive ? 'bg-emerald-500/15 text-emerald-500' : 'bg-destructive/15 text-destructive'
            }`}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(change)}% {changeLabel || ''}
          </span>
        )}
      </CardContent>
    </Card>
  )
}
