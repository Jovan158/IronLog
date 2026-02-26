import { useState } from 'react'
import { useCatalogStore } from '../stores/catalogStore'
import { ExerciseList } from '../components/catalog/ExerciseList'
import { ExerciseDetail } from '../components/catalog/ExerciseDetail'

export default function CatalogPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const getExerciseById = useCatalogStore((s) => s.getExerciseById)

  const selectedExercise = selectedId ? getExerciseById(selectedId) : undefined

  if (selectedExercise) {
    return (
      <div className="p-4">
        <ExerciseDetail exercise={selectedExercise} onBack={() => setSelectedId(null)} />
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Exercise Catalog</h2>
      <ExerciseList onSelectExercise={setSelectedId} />
    </div>
  )
}
