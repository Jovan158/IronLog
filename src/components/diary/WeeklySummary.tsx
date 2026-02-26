import { useEffect, useState } from 'react'
import { useDiaryStore } from '../../stores/diaryStore'
import { useWorkoutStore } from '../../stores/workoutStore'
import { getWeekDates, formatISODate } from '../../utils'
import { Card } from '../ui/Card'
import { MOOD_EMOJIS } from '../../constants'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function WeeklySummary() {
  const { loadEntries, getWeeklySummary } = useDiaryStore()
  const { sessions, loadSessions } = useWorkoutStore()
  const [referenceDate, setReferenceDate] = useState(new Date())

  useEffect(() => {
    loadEntries()
    loadSessions()
  }, [loadEntries, loadSessions])

  const weekDates = getWeekDates(referenceDate)
  const weekStart = formatISODate(weekDates[0])
  const weekEnd = formatISODate(weekDates[6])

  const workoutCount = sessions.filter((s) => {
    if (!s.completedAt) return false
    const d = formatISODate(new Date(s.startedAt))
    return d >= weekStart && d <= weekEnd
  }).length

  const summary = getWeeklySummary(weekDates, workoutCount)

  const goToPreviousWeek = () => {
    const d = new Date(referenceDate)
    d.setDate(d.getDate() - 7)
    setReferenceDate(d)
  }

  const goToNextWeek = () => {
    const d = new Date(referenceDate)
    d.setDate(d.getDate() + 7)
    setReferenceDate(d)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousWeek}
          className="text-text-muted hover:text-text-primary p-1 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm text-text-secondary">
          {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
          {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <button
          onClick={goToNextWeek}
          className="text-text-muted hover:text-text-primary p-1 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Mood Trend</h3>
        <div className="flex justify-between items-end h-20 px-2">
          {summary.moods.map((mood, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              {mood ? (
                <>
                  <span className="text-lg">{MOOD_EMOJIS[mood]}</span>
                  <div
                    className="w-2 rounded-full bg-accent"
                    style={{ height: `${(mood / 5) * 48}px` }}
                  />
                </>
              ) : (
                <div className="w-2 h-2 rounded-full bg-border-default" />
              )}
              <span className="text-[10px] text-text-muted">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-bold text-text-primary">{summary.goalCompletionRate}%</p>
          <p className="text-xs text-text-muted">Goals Completed</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-text-primary">{summary.workoutCount}</p>
          <p className="text-xs text-text-muted">Workouts</p>
        </Card>
      </div>
    </div>
  )
}
