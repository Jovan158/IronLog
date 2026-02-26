import { useEffect, useState } from 'react'
import { useWorkoutStore } from '../../stores/workoutStore'
import { ExerciseLogger } from './ExerciseLogger'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { formatDuration } from '../../utils'
import { useToast } from '../ui/Toast'

interface SessionLoggerProps {
  onFinished: () => void
}

export function SessionLogger({ onFinished }: SessionLoggerProps) {
  const { activeSession, finishSession, cancelSession, getPreviousSession } = useWorkoutStore()
  const { showToast } = useToast()
  const [elapsed, setElapsed] = useState('00:00:00')
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  useEffect(() => {
    if (!activeSession) return
    const startMs = new Date(activeSession.startedAt).getTime()
    const interval = setInterval(() => {
      setElapsed(formatDuration(startMs, Date.now()))
    }, 1000)
    return () => clearInterval(interval)
  }, [activeSession])

  if (!activeSession) return null

  const previousSession = getPreviousSession(activeSession.planId, activeSession.dayId)

  const handleFinish = async () => {
    await finishSession()
    showToast('Workout completed!', 'success')
    onFinished()
  }

  const handleCancel = () => {
    cancelSession()
    onFinished()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{activeSession.dayName}</h3>
          <p className="text-2xl font-bold text-accent font-mono">{elapsed}</p>
        </div>
        <button onClick={() => setShowCancelConfirm(true)} className="text-sm text-text-muted hover:text-destructive transition-colors">
          Cancel
        </button>
      </div>

      {activeSession.exercises.map((exercise, i) => (
        <ExerciseLogger
          key={exercise.id}
          exercise={exercise}
          exerciseIndex={i}
          previousExercise={previousSession?.exercises.find(
            (e) => e.exerciseId === exercise.exerciseId,
          )}
        />
      ))}

      <Button onClick={() => setShowFinishConfirm(true)} className="w-full text-base py-3">
        Finish Workout
      </Button>

      <ConfirmDialog
        isOpen={showFinishConfirm}
        onClose={() => setShowFinishConfirm(false)}
        onConfirm={handleFinish}
        title="Finish Workout"
        message="Save this workout session?"
        confirmLabel="Finish"
      />

      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancel}
        title="Cancel Workout"
        message="Are you sure? Your progress will be lost."
        confirmLabel="Cancel Workout"
        variant="destructive"
      />
    </div>
  )
}
