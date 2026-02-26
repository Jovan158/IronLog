import { useEffect, useState } from 'react'
import { useWorkoutStore } from '../../stores/workoutStore'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { SessionDetail } from './SessionDetail'
import { formatDate, getWeekNumber, calculateVolume, kgToLbs } from '../../utils'
import { useSettingsStore } from '../../stores/settingsStore'
import type { WorkoutSession } from '../../types'

export function SessionHistory() {
  const { sessions, loadSessions } = useWorkoutStore()
  const units = useSettingsStore((s) => s.units)
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null)

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  if (selectedSession) {
    return <SessionDetail session={selectedSession} onBack={() => setSelectedSession(null)} />
  }

  const completedSessions = sessions.filter((s) => s.completedAt !== null)

  if (completedSessions.length === 0) {
    return <EmptyState title="No workout history" description="Complete a workout to see it here" />
  }

  const grouped: Record<string, WorkoutSession[]> = {}
  for (const session of completedSessions) {
    const date = new Date(session.startedAt)
    const key = `${date.getFullYear()}-W${getWeekNumber(date)}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(session)
  }

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([week, weekSessions]) => (
        <div key={week} className="flex flex-col gap-2">
          <h4 className="text-xs font-medium text-text-muted uppercase">Week {week.split('-W')[1]}, {week.split('-')[0]}</h4>
          {weekSessions.map((session) => {
            const totalVolume = session.exercises.reduce((total, ex) => {
              return total + ex.sets.filter((s) => s.isCompleted).reduce((v, s) => v + calculateVolume(s.weight, s.reps, 1), 0)
            }, 0)
            const displayVolume = units === 'lbs' ? kgToLbs(totalVolume) : totalVolume
            return (
              <Card
                key={session.id}
                className="cursor-pointer hover:bg-surface-alt transition-colors"
                onClick={() => setSelectedSession(session)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{session.dayName}</p>
                    <p className="text-xs text-text-muted">{formatDate(new Date(session.startedAt))}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">{session.exercises.length} exercises</p>
                    <p className="text-xs text-text-secondary">{Math.round(displayVolume).toLocaleString()} {units}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ))}
    </div>
  )
}
