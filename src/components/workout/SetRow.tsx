import { memo } from 'react'
import { Check } from 'lucide-react'
import type { LoggedSet } from '../../types'
import { Badge } from '../ui/Badge'
import { useSettingsStore } from '../../stores/settingsStore'
import { kgToLbs } from '../../utils'

interface SetRowProps {
  set: LoggedSet
  previousSet?: LoggedSet
  onWeightChange: (weight: number) => void
  onRepsChange: (reps: number) => void
  onComplete: () => void
}

export const SetRow = memo(function SetRow({
  set,
  previousSet,
  onWeightChange,
  onRepsChange,
  onComplete,
}: SetRowProps) {
  const units = useSettingsStore((s) => s.units)

  const displayPrevious = previousSet
    ? `${units === 'lbs' ? kgToLbs(previousSet.weight) : previousSet.weight}${units} × ${previousSet.reps}`
    : '—'

  return (
    <div className={`flex items-center gap-2 py-1.5 ${set.isCompleted ? 'bg-surface-alt/50 rounded-lg px-2 -mx-2' : ''}`}>
      <span className="text-xs text-text-muted w-6 text-center shrink-0">{set.setNumber}</span>
      <span className="text-xs text-text-muted w-20 text-center shrink-0">{displayPrevious}</span>
      <input
        type="number"
        inputMode="decimal"
        value={set.weight || ''}
        onChange={(e) => onWeightChange(Number(e.target.value))}
        placeholder={units}
        className="w-[60px] bg-surface-alt border border-border-default rounded-lg px-2 py-1.5 text-sm text-text-primary text-center placeholder:text-text-muted focus:border-accent focus:outline-none"
      />
      <input
        type="number"
        inputMode="numeric"
        value={set.reps || ''}
        onChange={(e) => onRepsChange(Number(e.target.value))}
        placeholder="reps"
        className="w-12 bg-surface-alt border border-border-default rounded-lg px-2 py-1.5 text-sm text-text-primary text-center placeholder:text-text-muted focus:border-accent focus:outline-none"
      />
      <button
        onClick={onComplete}
        className={`p-1.5 rounded-lg transition-colors shrink-0 ${
          set.isCompleted
            ? 'bg-success text-black'
            : 'bg-surface-alt text-text-muted hover:text-text-primary'
        }`}
        aria-label={set.isCompleted ? 'Mark set incomplete' : 'Mark set complete'}
      >
        <Check size={14} />
      </button>
      {set.isPR && <Badge variant="success" className="shrink-0">PR</Badge>}
    </div>
  )
})
