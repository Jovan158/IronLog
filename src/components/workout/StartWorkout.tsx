import { useEffect, useState } from 'react'
import { Play } from 'lucide-react'
import { useWorkoutStore } from '../../stores/workoutStore'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import type { LoggedExercise, LoggedSet } from '../../types'
import { generateId } from '../../utils'

interface StartWorkoutProps {
  onStarted: () => void
}

export function StartWorkout({ onStarted }: StartWorkoutProps) {
  const { plans, loadPlans, startSession, getPreviousSession } = useWorkoutStore()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  useEffect(() => {
    loadPlans()
  }, [loadPlans])

  const selectedPlan = plans.find((p) => p.id === selectedPlanId)
  const plansWithDays = plans.filter((p) => p.days.length > 0)

  const handleStartDay = async (dayId: string) => {
    if (!selectedPlan) return
    const day = selectedPlan.days.find((d) => d.id === dayId)
    if (!day) return

    const previousSession = getPreviousSession(selectedPlan.id, dayId)

    const exercises: LoggedExercise[] = day.exercises.map((pe) => {
      const prevExercise = previousSession?.exercises.find(
        (e) => e.exerciseId === pe.exerciseId,
      )
      const sets: LoggedSet[] = Array.from({ length: pe.sets }, (_, i) => ({
        id: generateId(),
        setNumber: i + 1,
        weight: prevExercise?.sets[i]?.weight ?? 0,
        reps: prevExercise?.sets[i]?.reps ?? 0,
        isCompleted: false,
        isPR: false,
      }))
      return {
        id: generateId(),
        exerciseId: pe.exerciseId,
        exerciseName: pe.exerciseName,
        sets,
      }
    })

    await startSession(selectedPlan.id, dayId, day.name, exercises)
    onStarted()
  }

  if (plansWithDays.length === 0) {
    return (
      <EmptyState
        title="No workout plans"
        description="Create a plan with at least one day to start working out"
      />
    )
  }

  if (!selectedPlanId) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-text-primary">Select a Plan</h3>
        {plansWithDays.map((plan) => (
          <Card
            key={plan.id}
            className="cursor-pointer hover:bg-surface-alt transition-colors"
            onClick={() => setSelectedPlanId(plan.id)}
          >
            <p className="text-sm font-semibold text-text-primary">{plan.name}</p>
            <p className="text-xs text-text-muted">{plan.days.length} day{plan.days.length !== 1 ? 's' : ''}</p>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <button onClick={() => setSelectedPlanId(null)} className="text-sm text-text-secondary hover:text-text-primary self-start transition-colors">
        &larr; Back to Plans
      </button>
      <h3 className="text-lg font-semibold text-text-primary">{selectedPlan?.name}</h3>
      {selectedPlan?.days.map((day) => (
        <Card key={day.id} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">{day.name}</p>
            <p className="text-xs text-text-muted">{day.exercises.length} exercise{day.exercises.length !== 1 ? 's' : ''}</p>
          </div>
          <Button onClick={() => handleStartDay(day.id)} className="flex items-center gap-1.5 text-sm">
            <Play size={14} />
            Start
          </Button>
        </Card>
      ))}
    </div>
  )
}
