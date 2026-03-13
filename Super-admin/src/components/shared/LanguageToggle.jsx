import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { i18n } = useTranslation()

  return (
    <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
      <Button
        type="button"
        variant={i18n.language === 'en' ? 'default' : 'ghost'}
        size="sm"
        className={cn('rounded-md px-3', i18n.language !== 'en' && 'text-muted-foreground hover:text-foreground')}
        onClick={() => i18n.changeLanguage('en')}
      >
        EN
      </Button>
      <Button
        type="button"
        variant={i18n.language === 'ar' ? 'default' : 'ghost'}
        size="sm"
        className={cn('rounded-md px-3', i18n.language !== 'ar' && 'text-muted-foreground hover:text-foreground')}
        onClick={() => i18n.changeLanguage('ar')}
      >
        عربي
      </Button>
    </div>
  )
}
