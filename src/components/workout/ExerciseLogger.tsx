import type { LoggedExercise } from '../../types'
import { useWorkoutStore } from '../../stores/workoutStore'
import { Card } from '../ui/Card'
import { SetRow } from './SetRow'
import { Plus } from 'lucide-react'

interface ExerciseLoggerProps {
  exercise: LoggedExercise
  exerciseIndex: number
  previousExercise?: LoggedExercise
}

export function ExerciseLogger({ exercise, exerciseIndex, previousExercise }: ExerciseLoggerProps) {
  const { updateSet, addSet, completeSet } = useWorkoutStore()

  return (
    <Card className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-text-primary">{exercise.exerciseName}</p>
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span className="w-6 text-center">Set</span>
        <span className="w-20 text-center">Previous</span>
        <span className="w-[60px] text-center">kg</span>
        <span className="w-12 text-center">Reps</span>
        <span className="w-8" />
      </div>
      {exercise.sets.map((set, setIndex) => (
        <SetRow
          key={set.id}
          set={set}
          previousSet={previousExercise?.sets[setIndex]}
          onWeightChange={(w) => updateSet(exerciseIndex, setIndex, { weight: w })}
          onRepsChange={(r) => updateSet(exerciseIndex, setIndex, { reps: r })}
          onComplete={() => completeSet(exerciseIndex, setIndex)}
        />
      ))}
      <button
        onClick={() => addSet(exerciseIndex)}
        className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors py-1 self-start"
      >
        <Plus size={12} />
        Add Set
      </button>
    </Card>
  )
}
