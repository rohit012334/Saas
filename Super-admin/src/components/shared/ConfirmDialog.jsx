import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel, danger }) {
  const { t } = useTranslation('common')

  return (
    <Dialog open={!!open} onOpenChange={(nextOpen) => { if (!nextOpen) onCancel?.() }}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton={false} className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button variant={danger ? 'destructive' : 'default'} onClick={onConfirm}>
            {confirmLabel || t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
