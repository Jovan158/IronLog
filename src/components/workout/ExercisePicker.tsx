import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useCatalogStore } from '../../stores/catalogStore'
import { useWorkoutStore } from '../../stores/workoutStore'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useToast } from '../ui/Toast'
import { generateId } from '../../utils'
import type { Exercise } from '../../types'

interface ExercisePickerProps {
  planId: string
  dayId: string
  onClose: () => void
}

export function ExercisePicker({ planId, dayId, onClose }: ExercisePickerProps) {
  const { exercises, loadExercises } = useCatalogStore()
  const { addExerciseToDay } = useWorkoutStore()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Exercise | null>(null)
  const [sets, setSets] = useState(3)
  const [repMin, setRepMin] = useState(8)
  const [repMax, setRepMax] = useState(12)

  useEffect(() => {
    loadExercises()
  }, [loadExercises])

  const filtered = exercises.filter(
    (ex) =>
      !search || ex.name.toLowerCase().includes(search.toLowerCase()) || ex.primaryMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase())),
  )

  const handleAdd = async () => {
    if (!selected) return
    const plan = useWorkoutStore.getState().plans.find((p) => p.id === planId)
    const day = plan?.days.find((d) => d.id === dayId)
    await addExerciseToDay(planId, dayId, {
      id: generateId(),
      exerciseId: selected.id,
      exerciseName: selected.name,
      sets,
      repRangeMin: repMin,
      repRangeMax: repMax,
      order: day?.exercises.length ?? 0,
    })
    showToast(`Added ${selected.name}`, 'success')
    onClose()
  }

  return (
    <Modal isOpen onClose={onClose} title={selected ? 'Configure Exercise' : 'Add Exercise'}>
      {selected ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-text-primary">{selected.name}</p>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input label="Sets" type="number" min={1} max={10} value={sets} onChange={(e) => setSets(Number(e.target.value))} />
            </div>
            <div className="flex-1">
              <Input label="Min Reps" type="number" min={1} max={100} value={repMin} onChange={(e) => setRepMin(Number(e.target.value))} />
            </div>
            <div className="flex-1">
              <Input label="Max Reps" type="number" min={1} max={100} value={repMax} onChange={(e) => setRepMax(Number(e.target.value))} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setSelected(null)} className="flex-1">Back</Button>
            <Button onClick={handleAdd} className="flex-1">Add</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-alt border border-border-default rounded-lg pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>
          <div className="max-h-64 overflow-y-auto flex flex-col gap-1">
            {filtered.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setSelected(ex)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-alt transition-colors"
              >
                <p className="text-sm text-text-primary">{ex.name}</p>
                <p className="text-xs text-text-muted">{ex.category} · {ex.equipment}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
