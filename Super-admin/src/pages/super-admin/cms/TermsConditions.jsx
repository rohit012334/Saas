import React, { useState } from 'react'
import { Save, Languages, Globe, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from '../../../utils/toast'
import { Badge } from '../../../components/shared/Badge'
import { cn } from '@/lib/utils'

export function TermsConditions() {
  const { t } = useTranslation('cms')
  const [activeLang, setActiveLang] = useState('en') // Current selected language (English or Arabic)
  const [isEditing, setIsEditing] = useState(false) // Edit mode on hai ya off

  // Contents state jisme English aur Arabic dono ka text save hai
  const [contents, setContents] = useState({
    en: `# Terms and Conditions
Last updated: March 11, 2026

## 1. Introduction
Welcome to GMS Super Admin. These terms and conditions outline the rules and regulations for the use of our platform.

## 2. Platform Usage
By accessing this platform, we assume you accept these terms and conditions.

## 3. Account Security
Users are responsible for maintaining the confidentiality of their account.`,
    ar: `# الشروط والأحكام
آخر تحديث: 11 مارس 2026

## 1. مقدمة
مرحباً بكم في نظام GMS Super Admin. تحدد هذه الشروط والأحكام القواعد واللوائح الخاصة باستخدام منصتنا.

## 2. استخدام المنصة
من خلال الوصول إلى هذه المنصة، نفترض أنك تقبل هذه الشروط والأحكام.

## 3. أمن الحساب
المستخدمون مسؤولون عن الحفاظ على سرية حساباتهم.`
  })

  // Save button dabane par editor band ho jayga
  const handleSave = () => {
    setIsEditing(false)
    // Real App me yaha Backend API call hogi data save karne ke liye
    toast.success(`${activeLang === 'en' ? 'English' : 'Arabic'} content updated successfully`)
  }

  // Textarea me change hone par content state update hoti hai
  const updateContent = (val) => {
    setContents(prev => ({ ...prev, [activeLang]: val }))
  }

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title={t('terms.title')}
        actions={
          <div className="flex gap-2">
            {isEditing ? (
              <Button onClick={handleSave} className="gap-2 shadow-lg shadow-primary/20">
                <Save className="h-4 w-4" /> {t('terms.save')}
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" /> {t('terms.edit')}
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Editor Main Section */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">
                  {activeLang === 'en' ? t('terms.enHeader') : t('terms.arHeader')}
                </CardTitle>
              </div>
              <Badge variant={isEditing ? 'warning' : 'active'}>
                {isEditing ? t('terms.editing') : t('terms.live')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 border-t bg-white dark:bg-slate-950">
            <div className="min-h-[750px] w-full flex flex-col">
              {isEditing ? (
                <textarea
                  className={cn(
                    "w-full h-[750px] overflow-auto p-10 text-base focus:outline-none font-mono leading-relaxed bg-white dark:bg-slate-950 border-0 outline-none block resize-none text-slate-900 dark:text-slate-100",
                    activeLang === 'ar' && "text-right font-sans"
                  )}
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  value={contents[activeLang]} // Current language ka content yaha dikhega
                  onChange={(e) => updateContent(e.target.value)} // Type karne par update function call hoga
                  placeholder={t('terms.placeholder')}
                  autoFocus
                />
              ) : (
                <div 
                  className={cn(
                    "min-h-[750px] w-full p-10 overflow-auto bg-muted/5",
                    activeLang === 'ar' && "text-right"
                  )}
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                >
                  <div className="prose prose-slate dark:prose-invert max-w-none font-sans text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    <pre className="whitespace-pre-wrap font-sans">
                      {contents[activeLang]}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Options */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">{t('terms.languages')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 bg-muted/10">
              <div className="space-y-2">
                <button
                  onClick={() => { setActiveLang('en'); setIsEditing(false); }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl p-3 text-sm font-semibold transition-all hover:bg-white/10",
                    activeLang === 'en' ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-surface border border-border/50 text-text-secondary"
                  )}
                >
                  <span className="flex items-center gap-2">English</span>
                  {activeLang === 'en' && <Badge variant="active" className="bg-white/20 text-white border-none">Active</Badge>}
                </button>
                <button
                  onClick={() => { setActiveLang('ar'); setIsEditing(false); }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl p-3 text-sm font-semibold transition-all hover:bg-white/10",
                    activeLang === 'ar' ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-surface border border-border/50 text-text-secondary"
                  )}
                >
                  <span className="flex items-center gap-2">العربية (Arabic)</span>
                  {activeLang === 'ar' && <Badge variant="active" className="bg-white/20 text-white border-none">Active</Badge>}
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-primary">Pro Tip</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              You can switch between languages to maintain synced translations. Changes are only saved for the currently selected language version.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

