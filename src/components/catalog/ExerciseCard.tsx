import { ChevronRight } from 'lucide-react'
import type { Exercise } from '../../types'
import { Badge } from '../ui/Badge'

interface ExerciseCardProps {
  exercise: Exercise
  onClick: () => void
}

export function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-surface rounded-xl border border-border-default p-4 flex items-center gap-3 text-left transition-colors hover:bg-surface-alt"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">{exercise.name}</p>
        <div className="flex gap-2 mt-1.5">
          <Badge>{exercise.category}</Badge>
          <Badge>{exercise.equipment}</Badge>
        </div>
        <p className="text-xs text-text-muted mt-1.5 truncate">
          {exercise.primaryMuscles.join(', ')}
        </p>
      </div>
      <ChevronRight size={18} className="text-text-muted shrink-0" />
    </button>
  )
}
