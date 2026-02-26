import { create } from 'zustand'
import type { Exercise, ExerciseCategory } from '../types'
import { db } from '../db/database'
import { logger } from '../utils/logger'

interface CatalogStore {
  exercises: Exercise[]
  searchQuery: string
  selectedCategory: ExerciseCategory | 'all'
  isLoading: boolean
  loadExercises: () => Promise<void>
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: ExerciseCategory | 'all') => void
  getFilteredExercises: () => Exercise[]
  getExerciseById: (id: string) => Exercise | undefined
}

export const useCatalogStore = create<CatalogStore>((set, get) => ({
  exercises: [],
  searchQuery: '',
  selectedCategory: 'all',
  isLoading: false,

  loadExercises: async () => {
    set({ isLoading: true })
    try {
      const exercises = await db.exercises.toArray()
      set({ exercises, isLoading: false })
    } catch (error) {
      logger.error('Failed to load exercises:', error)
      set({ isLoading: false })
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  getFilteredExercises: () => {
    const { exercises, searchQuery, selectedCategory } = get()
    return exercises.filter((ex) => {
      const matchesSearch =
        !searchQuery ||
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.primaryMuscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  },

  getExerciseById: (id) => get().exercises.find((ex) => ex.id === id),
}))
