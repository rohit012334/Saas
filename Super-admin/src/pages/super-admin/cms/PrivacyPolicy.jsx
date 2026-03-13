import React, { useState } from 'react'
import { Save, Languages, Globe, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from '../../../utils/toast'
import { Badge } from '../../../components/shared/Badge'
import { cn } from '@/lib/utils'

export function PrivacyPolicy() {
  const { t } = useTranslation('cms')
  const [activeLang, setActiveLang] = useState('en') // Selected language state
  const [isEditing, setIsEditing] = useState(false) // Edit mode toggle state
  
  // Privacy policy contents for both languages
  const [contents, setContents] = useState({
    en: `# Privacy Policy
Last updated: March 11, 2026

## 1. Data Collection
We collect minimal data required to provide our garage management services.

## 2. Data Usage
Your data is used solely for the operation of the GMS platform.

## 3. Data Storage
All data is stored securely on encrypted servers.`,
    ar: `# سياسة الخصوصية
آخر تحديث: 11 مارس 2026

## 1. جمع البيانات
نحن نجمع الحد الأدنى من البيانات المطلوبة لتقديم خدمات إدارة الورش الخاصة بنا.

## 2. استخدام البيانات
تُستخدم بياناتك فقط لتشغيل منصة GMS.

## 3. تخزين البيانات
يتم تخزين جميع البيانات بشكل آمن على خوادم مشفرة.`
  })

  // Save handler logic
  const handleSave = () => {
    setIsEditing(false)
    // Future: API call to save actual content
    toast.success(`${activeLang === 'en' ? 'English' : 'Arabic'} policy updated successfully`)
  }

  const updateContent = (val) => {
    setContents(prev => ({ ...prev, [activeLang]: val }))
  }

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title={t('privacy.title')}
        actions={
          <div className="flex gap-2">
            {isEditing ? (
              <Button onClick={handleSave} className="gap-2 shadow-lg shadow-primary/20">
                <Save className="h-4 w-4" /> {t('privacy.save')}
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" /> {t('privacy.edit')}
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
                  {activeLang === 'en' ? t('privacy.enHeader') : t('privacy.arHeader')}
                </CardTitle>
              </div>
              <Badge variant={isEditing ? 'warning' : 'active'}>
                {isEditing ? t('privacy.editing') : t('privacy.live')}
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
                  value={contents[activeLang]} // Binded value for currently selected language
                  onChange={(e) => updateContent(e.target.value)} // Content change listener
                  placeholder={t('privacy.placeholder')}
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
                <CardTitle className="text-base">{t('privacy.languages')}</CardTitle>
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

          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-emerald-600">Compliance Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Updating the privacy policy version applies instantly to all mobile and web applications. Ensure both translation versions are accurate.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

