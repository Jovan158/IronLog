import { useEffect, useState } from 'react'
import type { Exercise } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useWorkoutStore } from '../../stores/workoutStore'
import { useToast } from '../ui/Toast'
import { generateId } from '../../utils'

interface AddToPlanModalProps {
  isOpen: boolean
  onClose: () => void
  exercise: Exercise
}

export function AddToPlanModal({ isOpen, onClose, exercise }: AddToPlanModalProps) {
  const { plans, loadPlans, addExerciseToDay } = useWorkoutStore()
  const { showToast } = useToast()
  const [selectedPlanId, setSelectedPlanId] = useState('')
  const [selectedDayId, setSelectedDayId] = useState('')
  const [sets, setSets] = useState(3)
  const [repMin, setRepMin] = useState(8)
  const [repMax, setRepMax] = useState(12)

  useEffect(() => {
    if (isOpen) loadPlans()
  }, [isOpen, loadPlans])

  const selectedPlan = plans.find((p) => p.id === selectedPlanId)

  const handleAdd = async () => {
    if (!selectedPlanId || !selectedDayId) return
    await addExerciseToDay(selectedPlanId, selectedDayId, {
      id: generateId(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets,
      repRangeMin: repMin,
      repRangeMax: repMax,
      order: selectedPlan?.days.find((d) => d.id === selectedDayId)?.exercises.length ?? 0,
    })
    showToast(`Added ${exercise.name} to plan`, 'success')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Workout Plan">
      {plans.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No workout plans yet. Create a plan first in the Workouts tab.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Plan</label>
            <select
              value={selectedPlanId}
              onChange={(e) => {
                setSelectedPlanId(e.target.value)
                setSelectedDayId('')
              }}
              className="bg-surface-alt border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
            >
              <option value="">Select a plan</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {selectedPlan && (
            <div className="flex flex-col gap-1">
              <label className="text-sm text-text-secondary">Day</label>
              <select
                value={selectedDayId}
                onChange={(e) => setSelectedDayId(e.target.value)}
                className="bg-surface-alt border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
              >
                <option value="">Select a day</option>
                {selectedPlan.days.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label="Sets"
                type="number"
                min={1}
                max={10}
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Min Reps"
                type="number"
                min={1}
                max={100}
                value={repMin}
                onChange={(e) => setRepMin(Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Max Reps"
                type="number"
                min={1}
                max={100}
                value={repMax}
                onChange={(e) => setRepMax(Number(e.target.value))}
              />
            </div>
          </div>

          <Button
            onClick={handleAdd}
            disabled={!selectedPlanId || !selectedDayId}
            className="w-full"
          >
            Add Exercise
          </Button>
        </div>
      )}
    </Modal>
  )
}
