import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useCatalogStore } from '../../stores/catalogStore'
import { ExerciseCard } from './ExerciseCard'
import { Chip } from '../ui/Chip'
import { EmptyState } from '../ui/EmptyState'
import type { ExerciseCategory } from '../../types'
import { EXERCISE_CATEGORIES } from '../../constants'
import { debounce } from '../../utils'

interface ExerciseListProps {
  onSelectExercise: (id: string) => void
}

export function ExerciseList({ onSelectExercise }: ExerciseListProps) {
  const {
    loadExercises,
    setSearchQuery,
    setSelectedCategory,
    selectedCategory,
    getFilteredExercises,
  } = useCatalogStore()
  const [localSearch, setLocalSearch] = useState('')

  useEffect(() => {
    loadExercises()
  }, [loadExercises])

  const debouncedSearch = useMemo(
    () => debounce((q: string) => setSearchQuery(q), 300),
    [setSearchQuery],
  )

  const handleSearch = (value: string) => {
    setLocalSearch(value)
    debouncedSearch(value)
  }

  const filtered = getFilteredExercises()

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search exercises..."
          value={localSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-surface-alt border border-border-default rounded-lg pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {EXERCISE_CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            isActive={
              (cat === 'All' && selectedCategory === 'all') ||
              cat.toLowerCase() === selectedCategory
            }
            onClick={() =>
              setSelectedCategory(
                cat === 'All' ? 'all' : (cat.toLowerCase() as ExerciseCategory),
              )
            }
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <EmptyState
            title="No exercises found"
            description="Try a different search or category"
          />
        ) : (
          filtered.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onClick={() => onSelectExercise(exercise.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
