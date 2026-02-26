import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2, X } from 'lucide-react'
import type { WorkoutDay } from '../../types'
import { useWorkoutStore } from '../../stores/workoutStore'
import { Card } from '../ui/Card'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { ExercisePicker } from './ExercisePicker'

interface DayEditorProps {
  planId: string
  day: WorkoutDay
  onRemove: () => void
}

export function DayEditor({ planId, day, onRemove }: DayEditorProps) {
  const { removeExerciseFromDay } = useWorkoutStore()
  const [isExpanded, setIsExpanded] = useState(true)
  const [showPicker, setShowPicker] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 text-text-primary font-semibold text-sm">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {day.name}
          <span className="text-text-muted font-normal">({day.exercises.length} exercises)</span>
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} className="text-text-muted hover:text-destructive p-1 transition-colors" aria-label="Remove day">
          <X size={16} />
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-2">
          {day.exercises.map((ex) => (
            <div key={ex.id} className="flex items-center justify-between bg-surface-alt rounded-lg px-3 py-2">
              <div>
                <p className="text-sm text-text-primary">{ex.exerciseName}</p>
                <p className="text-xs text-text-muted">{ex.sets} &times; {ex.repRangeMin}-{ex.repRangeMax} reps</p>
              </div>
              <button onClick={() => removeExerciseFromDay(planId, day.id, ex.id)} className="text-text-muted hover:text-destructive p-1 transition-colors" aria-label="Remove exercise">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button onClick={() => setShowPicker(true)} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors py-1">
            <Plus size={14} />
            Add Exercise
          </button>
        </div>
      )}

      {showPicker && (
        <ExercisePicker planId={planId} dayId={day.id} onClose={() => setShowPicker(false)} />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={onRemove}
        title="Remove Day"
        message={`Remove "${day.name}" from this plan?`}
        confirmLabel="Remove"
        variant="destructive"
      />
    </Card>
  )
}
