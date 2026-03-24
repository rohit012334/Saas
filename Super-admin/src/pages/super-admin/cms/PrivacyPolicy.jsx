import React, { useState, useEffect } from 'react'
import { Save, Languages, Globe, Pencil, Loader2, Target, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from '../../../utils/toast'
import { Badge } from '../../../components/shared/Badge'
import { cn } from '@/lib/utils'
import { useAuthStore } from '../../../store/useAuthStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export function PrivacyPolicy() {
  const { t } = useTranslation('cms')
  const { token } = useAuthStore()

  const [activeLang, setActiveLang] = useState('en')
  const [target, setTarget] = useState('USER')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [docId, setDocId] = useState(null)
  const [contents, setContents] = useState({
    en: '',
    ar: ''
  })

  const fetchPolicy = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/admin/cms?type=PRIVACY_POLICY&target=${target}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      if (result.success && result.data.length > 0) {
        const doc = result.data[0]
        setDocId(doc.id)
        setContents({
          en: doc.content.en || '',
          ar: doc.content.ar || ''
        })
      } else {
        setDocId(null)
        setContents({ en: '', ar: '' })
      }
    } catch (err) {
      toast.error('Failed to fetch privacy policy')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolicy()
  }, [target])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const url = docId ? `${API_URL}/admin/cms/${docId}` : `${API_URL}/admin/cms`
      const method = docId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'PRIVACY_POLICY',
          target,
          title: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
          content: contents,
          isActive: true
        })
      })

      const result = await res.json()
      if (result.success) {
        toast.success(`Privacy Policy for ${target} updated`)
        setIsEditing(false)
        if (!docId) fetchPolicy()
      }
    } catch (err) {
      toast.error('Failed to save policy')
    } finally {
      setIsSaving(false)
    }
  }

  const updateContent = (val) => {
    setContents(prev => ({ ...prev, [activeLang]: val }))
  }

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Privacy Policy Management"
        actions={
          <div className="flex gap-2">
            {isEditing ? (
              <Button onClick={handleSave} disabled={isSaving} className="gap-2 shadow-lg shadow-primary/20">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" /> Edit Policy
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Options */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Target App</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {[
                { id: 'USER', label: 'User App', sub: 'Customers' },
                { id: 'MECHANIC', label: 'Mechanic App', sub: 'Staff' },
                { id: 'TENANT', label: 'Admin Panel', sub: 'Garage' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setTarget(item.id); setIsEditing(false); }}
                  className={cn(
                    "flex w-full flex-col items-start rounded-xl p-3 text-sm font-semibold transition-all border-2",
                    target === item.id ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" : "bg-muted/20 border-transparent hover:border-primary/30"
                  )}
                >
                  <span className="text-xs font-black">{item.label}</span>
                  <span className={cn("text-[9px] uppercase opacity-70", target === item.id ? "text-white" : "text-muted-foreground")}>{item.sub}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Content Language</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 bg-muted/10 space-y-2">
              <button
                onClick={() => setActiveLang('en')}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl p-3 text-sm font-semibold transition-all",
                  activeLang === 'en' ? "bg-primary/10 text-primary border border-primary/20" : "bg-surface border border-transparent text-text-secondary"
                )}
              >
                English
                {activeLang === 'en' && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
              <button
                onClick={() => setActiveLang('ar')}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl p-3 text-sm font-semibold transition-all",
                  activeLang === 'ar' ? "bg-primary/10 text-primary border border-primary/20" : "bg-surface border border-transparent text-text-secondary"
                )}
              >
                العربية
                {activeLang === 'ar' && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            </CardContent>
          </Card>

          {/* <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4" /> Compliance
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Updating policy updates all apps instantly. Use Markdown for formatting.
              </p>
            </CardContent>
          </Card> */}
        </div>

        {/* Editor Main Section */}
        <Card className="lg:col-span-3 border-border/50 shadow-sm relative min-h-[700px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <CardHeader className="border-b bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base capitalize">
                      {activeLang === 'en' ? 'English Content' : 'Arabic Content'} ({target})
                    </CardTitle>
                  </div>
                  <Badge variant={isEditing ? 'warning' : 'active'}>
                    {isEditing ? 'Editing Mode' : 'Live Status'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 border-t bg-white dark:bg-slate-950">
                <div className="min-h-[700px] w-full flex flex-col">
                  {isEditing ? (
                    <textarea
                      className={cn(
                        "w-full h-[700px] overflow-auto p-10 text-base focus:outline-none font-mono leading-relaxed bg-white dark:bg-slate-950 border-0 outline-none block resize-none text-slate-900 dark:text-slate-100",
                        activeLang === 'ar' && "text-right font-sans"
                      )}
                      dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                      value={contents[activeLang]}
                      onChange={(e) => updateContent(e.target.value)}
                      placeholder="Enter policy content here..."
                      autoFocus
                    />
                  ) : (
                    <div
                      className={cn(
                        "min-h-[700px] w-full p-10 overflow-auto bg-muted/5",
                        activeLang === 'ar' && "text-right"
                      )}
                      dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <div className="prose prose-slate dark:prose-invert max-w-none font-sans text-base leading-relaxed text-slate-700 dark:text-slate-300">
                        <pre className="whitespace-pre-wrap font-sans">
                          {contents[activeLang] || 'No content found for this target/language.'}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
