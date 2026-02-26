import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { Exercise } from '../../types'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { AddToPlanModal } from './AddToPlanModal'

interface ExerciseDetailProps {
  exercise: Exercise
  onBack: () => void
}

export function ExerciseDetail({ exercise, onBack }: ExerciseDetailProps) {
  const [showAddToPlan, setShowAddToPlan] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors self-start"
        aria-label="Go back"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back</span>
      </button>

      <div className="rounded-xl overflow-hidden aspect-video bg-surface-alt">
        <iframe
          src={exercise.videoUrl}
          title={`${exercise.name} demonstration`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-primary">{exercise.name}</h2>
        <div className="flex gap-2 mt-2">
          <Badge>{exercise.category}</Badge>
          <Badge>{exercise.equipment}</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">Primary Muscles</h3>
        <p className="text-sm text-text-secondary">{exercise.primaryMuscles.join(', ')}</p>
      </div>

      {exercise.secondaryMuscles.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">Secondary Muscles</h3>
          <p className="text-sm text-text-secondary">{exercise.secondaryMuscles.join(', ')}</p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-2">How to Perform</h3>
        <ol className="flex flex-col gap-2">
          {exercise.instructions.map((step, i) => (
            <li key={i} className="flex gap-2 text-sm text-text-secondary">
              <span className="text-text-muted shrink-0">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <Button onClick={() => setShowAddToPlan(true)} className="w-full mt-2">
        Add to Workout Plan
      </Button>

      <AddToPlanModal
        isOpen={showAddToPlan}
        onClose={() => setShowAddToPlan(false)}
        exercise={exercise}
      />
    </div>
  )
}
