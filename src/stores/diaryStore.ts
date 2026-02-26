import { create } from 'zustand'
import type { DiaryEntry, DiaryGoal, Mood } from '../types'
import { db } from '../db/database'
import { generateId, formatISODate } from '../utils'
import { logger } from '../utils/logger'

interface WeeklySummary {
  moods: (Mood | null)[]
  goalCompletionRate: number
  workoutCount: number
}

interface DiaryStore {
  entries: DiaryEntry[]
  selectedDate: string
  isLoading: boolean

  loadEntries: () => Promise<void>
  setSelectedDate: (date: string) => void
  getEntryForDate: (date: string) => DiaryEntry | undefined
  saveEntry: (entry: Partial<DiaryEntry> & { date: string }) => Promise<void>
  setMood: (date: string, mood: Mood) => Promise<void>
  addGoal: (date: string, text: string) => Promise<void>
  toggleGoal: (date: string, goalId: string) => Promise<void>
  removeGoal: (date: string, goalId: string) => Promise<void>
  updateContent: (date: string, content: string) => Promise<void>
  getWeeklySummary: (weekDates: Date[], workoutCount: number) => WeeklySummary
}

function createEmptyEntry(date: string): DiaryEntry {
  return {
    id: generateId(),
    date,
    content: '',
    goals: [],
    mood: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export const useDiaryStore = create<DiaryStore>((set, get) => ({
  entries: [],
  selectedDate: formatISODate(new Date()),
  isLoading: false,

  loadEntries: async () => {
    set({ isLoading: true })
    try {
      const entries = await db.diaryEntries.toArray()
      set({ entries, isLoading: false })
    } catch (error) {
      logger.error('Failed to load diary entries:', error)
      set({ isLoading: false })
    }
  },

  setSelectedDate: (date) => set({ selectedDate: date }),

  getEntryForDate: (date) => get().entries.find((e) => e.date === date),

  saveEntry: async (partial) => {
    const existing = get().getEntryForDate(partial.date)
    const entry: DiaryEntry = existing
      ? { ...existing, ...partial, updatedAt: new Date() }
      : { ...createEmptyEntry(partial.date), ...partial }

    try {
      await db.diaryEntries.put(entry)
      set((s) => ({
        entries: existing
          ? s.entries.map((e) => (e.id === entry.id ? entry : e))
          : [...s.entries, entry],
      }))
    } catch (error) {
      logger.error('Failed to save diary entry:', error)
    }
  },

  setMood: async (date, mood) => {
    await get().saveEntry({ date, mood })
  },

  addGoal: async (date, text) => {
    const existing = get().getEntryForDate(date)
    const goal: DiaryGoal = { id: generateId(), text, isCompleted: false }
    const goals = existing ? [...existing.goals, goal] : [goal]
    await get().saveEntry({ date, goals })
  },

  toggleGoal: async (date, goalId) => {
    const existing = get().getEntryForDate(date)
    if (!existing) return
    const goals = existing.goals.map((g) =>
      g.id === goalId ? { ...g, isCompleted: !g.isCompleted } : g,
    )
    await get().saveEntry({ date, goals })
  },

  removeGoal: async (date, goalId) => {
    const existing = get().getEntryForDate(date)
    if (!existing) return
    const goals = existing.goals.filter((g) => g.id !== goalId)
    await get().saveEntry({ date, goals })
  },

  updateContent: async (date, content) => {
    await get().saveEntry({ date, content })
  },

  getWeeklySummary: (weekDates, workoutCount) => {
    const { entries } = get()
    const moods: (Mood | null)[] = weekDates.map((d) => {
      const entry = entries.find((e) => e.date === formatISODate(d))
      return entry ? entry.mood : null
    })

    const weekEntries = weekDates
      .map((d) => entries.find((e) => e.date === formatISODate(d)))
      .filter(Boolean) as DiaryEntry[]

    const totalGoals = weekEntries.reduce((sum, e) => sum + e.goals.length, 0)
    const completedGoals = weekEntries.reduce(
      (sum, e) => sum + e.goals.filter((g) => g.isCompleted).length,
      0,
    )
    const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0

    return { moods, goalCompletionRate, workoutCount }
  },
}))
