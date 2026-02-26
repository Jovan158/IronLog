import { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import type { WorkoutPlan } from '../../types'
import { useWorkoutStore } from '../../stores/workoutStore'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { useToast } from '../ui/Toast'
import { DayEditor } from './DayEditor'

interface PlanEditorProps {
  plan: WorkoutPlan
  onBack: () => void
}

export function PlanEditor({ plan, onBack }: PlanEditorProps) {
  const { updatePlan, addDayToPlan, removeDayFromPlan } = useWorkoutStore()
  const { showToast } = useToast()
  const [showAddDay, setShowAddDay] = useState(false)
  const [newDayName, setNewDayName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [planName, setPlanName] = useState(plan.name)

  const handleSaveName = async () => {
    if (planName.trim() && planName !== plan.name) {
      await updatePlan({ ...plan, name: planName.trim() })
    }
    setEditingName(false)
  }

  const handleAddDay = async () => {
    if (!newDayName.trim()) return
    await addDayToPlan(plan.id, newDayName.trim())
    setNewDayName('')
    setShowAddDay(false)
    showToast('Day added', 'success')
  }

  const handleRemoveDay = async (dayId: string) => {
    await removeDayFromPlan(plan.id, dayId)
    showToast('Day removed', 'success')
  }

  const currentPlan = useWorkoutStore((s) => s.plans.find((p) => p.id === plan.id)) || plan

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors self-start" aria-label="Go back">
        <ArrowLeft size={18} />
        <span className="text-sm">Back to Plans</span>
      </button>

      <div className="flex items-center gap-2">
        {editingName ? (
          <Input
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
            className="text-lg font-bold"
            autoFocus
          />
        ) : (
          <button onClick={() => setEditingName(true)} className="text-2xl font-bold text-text-primary hover:text-accent transition-colors">
            {currentPlan.name}
          </button>
        )}
      </div>

      {currentPlan.days.map((day) => (
        <DayEditor key={day.id} planId={currentPlan.id} day={day} onRemove={() => handleRemoveDay(day.id)} />
      ))}

      <Button onClick={() => setShowAddDay(true)} variant="ghost" className="flex items-center gap-1.5 self-start">
        <Plus size={16} />
        Add Day
      </Button>

      <Modal isOpen={showAddDay} onClose={() => setShowAddDay(false)} title="Add Workout Day">
        <div className="flex flex-col gap-4">
          <Input
            label="Day Name"
            placeholder="e.g. Upper A, Lower B"
            value={newDayName}
            onChange={(e) => setNewDayName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddDay()}
          />
          <Button onClick={handleAddDay} disabled={!newDayName.trim()} className="w-full">
            Add Day
          </Button>
        </div>
      </Modal>
    </div>
  )
}
