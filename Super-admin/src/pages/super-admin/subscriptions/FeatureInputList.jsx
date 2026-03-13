import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function FeatureInputList({ features = [], onChange }) {
  const addFeature = () => {
    onChange([...features, ''])
  }

  const updateFeature = (index, value) => {
    const next = [...features]
    next[index] = value
    onChange(next)
  }

  const removeFeature = (index) => {
    onChange(features.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Features</Label>
        <Button type="button" variant="outline" size="sm" onClick={addFeature}>
          <Plus className="h-4 w-4" />
          Add feature
        </Button>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
        {features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={f}
              onChange={(e) => updateFeature(i, e.target.value)}
              placeholder="e.g. Job cards, Inventory, Reports"
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => removeFeature(i)}
              className="shrink-0 text-muted-foreground hover:text-destructive"
              aria-label="Remove feature"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {features.length === 0 && (
          <p className="text-sm text-muted-foreground py-1">No features added. Click &quot;Add feature&quot; to add.</p>
        )}
      </div>
    </div>
  )
}
