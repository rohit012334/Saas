import React, { useMemo } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { DataTable } from '../../../components/shared/DataTable'
import { Badge } from '../../../components/shared/Badge'
import { Button } from '@/components/ui/button'

const statusVariant = { Active: 'active', Inactive: 'inactive' }

export function PlanTable({ plans, onEdit, onDelete }) {
  const columns = useMemo(
    () => [
      {
        id: 'planName',
        header: 'Plan name',
        accessorKey: 'planName',
        cell: ({ getValue }) => (
          <span className="font-medium text-foreground">{getValue()}</span>
        ),
      },
      {
        id: 'vehicleType',
        header: 'Vehicle type',
        accessorKey: 'vehicleType',
        cell: ({ getValue }) => getValue(),
      },
      {
        id: 'duration',
        header: 'Duration',
        accessorKey: 'duration',
        cell: ({ getValue }) => getValue(),
      },
      {
        id: 'price',
        header: 'Price',
        accessorKey: 'price',
        cell: ({ getValue }) => (
          <span>${Number(getValue()).toLocaleString()}</span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => (
          <Badge variant={statusVariant[getValue()] || 'default'}>
            {getValue()}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(row.original)}
              title="Edit plan"
              aria-label="Edit plan"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(row.original)}
              title="Delete plan"
              aria-label="Delete plan"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  )

  return (
    <DataTable
      columns={columns}
      data={plans}
      pageSize={10}
      emptyMessage="No subscription plans. Add a plan to get started."
    />
  )
}
