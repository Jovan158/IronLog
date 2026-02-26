import { ArrowLeft } from 'lucide-react'
import type { WorkoutSession } from '../../types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatDate, formatDuration, kgToLbs } from '../../utils'
import { useSettingsStore } from '../../stores/settingsStore'

interface SessionDetailProps {
  session: WorkoutSession
  onBack: () => void
}

export function SessionDetail({ session, onBack }: SessionDetailProps) {
  const units = useSettingsStore((s) => s.units)
  const duration = session.completedAt
    ? formatDuration(new Date(session.startedAt).getTime(), new Date(session.completedAt).getTime())
    : '—'

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors self-start" aria-label="Go back">
        <ArrowLeft size={18} />
        <span className="text-sm">Back</span>
      </button>

      <div>
        <h3 className="text-lg font-semibold text-text-primary">{session.dayName}</h3>
        <p className="text-xs text-text-muted">{formatDate(new Date(session.startedAt))} · {duration}</p>
      </div>

      {session.exercises.map((exercise) => (
        <Card key={exercise.id}>
          <p className="text-sm font-semibold text-text-primary mb-2">{exercise.exerciseName}</p>
          <div className="flex flex-col gap-1">
            {exercise.sets.filter((s) => s.isCompleted).map((set) => {
              const displayWeight = units === 'lbs' ? kgToLbs(set.weight) : set.weight
              return (
                <div key={set.id} className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="text-text-muted w-6">#{set.setNumber}</span>
                  <span>{displayWeight} {units} &times; {set.reps} reps</span>
                  {set.isPR && <Badge variant="success">PR</Badge>}
                </div>
              )
            })}
          </div>
        </Card>
      ))}
    </div>
  )
}
