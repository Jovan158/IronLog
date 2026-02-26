import { create } from 'zustand'
import type {
  WorkoutPlan,
  WorkoutSession,
  LoggedExercise,
  LoggedSet,
  WorkoutDay,
  PlannedExercise,
} from '../types'
import { db } from '../db/database'
import { generateId } from '../utils'
import { logger } from '../utils/logger'

interface WorkoutStore {
  plans: WorkoutPlan[]
  sessions: WorkoutSession[]
  activeSession: WorkoutSession | null
  isLoading: boolean

  loadPlans: () => Promise<void>
  loadSessions: () => Promise<void>
  createPlan: (name: string) => Promise<WorkoutPlan>
  updatePlan: (plan: WorkoutPlan) => Promise<void>
  deletePlan: (id: string) => Promise<void>
  addDayToPlan: (planId: string, dayName: string) => Promise<void>
  removeDayFromPlan: (planId: string, dayId: string) => Promise<void>
  updateDay: (planId: string, day: WorkoutDay) => Promise<void>
  addExerciseToDay: (planId: string, dayId: string, exercise: PlannedExercise) => Promise<void>
  removeExerciseFromDay: (planId: string, dayId: string, exerciseId: string) => Promise<void>
  startSession: (planId: string, dayId: string, dayName: string, exercises: LoggedExercise[]) => Promise<void>
  updateSet: (exerciseIndex: number, setIndex: number, updates: Partial<LoggedSet>) => void
  addSet: (exerciseIndex: number) => void
  completeSet: (exerciseIndex: number, setIndex: number) => void
  finishSession: () => Promise<void>
  cancelSession: () => void
  getPreviousSession: (planId: string, dayId: string) => WorkoutSession | undefined
  checkIsPR: (exerciseId: string, weight: number, reps: number) => boolean
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  plans: [],
  sessions: [],
  activeSession: null,
  isLoading: false,

  loadPlans: async () => {
    try {
      const plans = await db.workoutPlans.toArray()
      set({ plans })
    } catch (error) {
      logger.error('Failed to load plans:', error)
    }
  },

  loadSessions: async () => {
    try {
      const sessions = await db.workoutSessions.orderBy('startedAt').reverse().toArray()
      set({ sessions })
    } catch (error) {
      logger.error('Failed to load sessions:', error)
    }
  },

  createPlan: async (name) => {
    const plan: WorkoutPlan = {
      id: generateId(),
      name,
      days: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    try {
      await db.workoutPlans.add(plan)
      set((s) => ({ plans: [...s.plans, plan] }))
    } catch (error) {
      logger.error('Failed to create plan:', error)
    }
    return plan
  },

  updatePlan: async (plan) => {
    const updated = { ...plan, updatedAt: new Date() }
    try {
      await db.workoutPlans.put(updated)
      set((s) => ({ plans: s.plans.map((p) => (p.id === plan.id ? updated : p)) }))
    } catch (error) {
      logger.error('Failed to update plan:', error)
    }
  },

  deletePlan: async (id) => {
    try {
      await db.workoutPlans.delete(id)
      set((s) => ({ plans: s.plans.filter((p) => p.id !== id) }))
    } catch (error) {
      logger.error('Failed to delete plan:', error)
    }
  },

  addDayToPlan: async (planId, dayName) => {
    const plan = get().plans.find((p) => p.id === planId)
    if (!plan) return
    const day: WorkoutDay = {
      id: generateId(),
      name: dayName,
      exercises: [],
      order: plan.days.length,
    }
    const updated = { ...plan, days: [...plan.days, day], updatedAt: new Date() }
    await get().updatePlan(updated)
  },

  removeDayFromPlan: async (planId, dayId) => {
    const plan = get().plans.find((p) => p.id === planId)
    if (!plan) return
    const updated = {
      ...plan,
      days: plan.days.filter((d) => d.id !== dayId).map((d, i) => ({ ...d, order: i })),
      updatedAt: new Date(),
    }
    await get().updatePlan(updated)
  },

  updateDay: async (planId, day) => {
    const plan = get().plans.find((p) => p.id === planId)
    if (!plan) return
    const updated = {
      ...plan,
      days: plan.days.map((d) => (d.id === day.id ? day : d)),
      updatedAt: new Date(),
    }
    await get().updatePlan(updated)
  },

  addExerciseToDay: async (planId, dayId, exercise) => {
    const plan = get().plans.find((p) => p.id === planId)
    if (!plan) return
    const day = plan.days.find((d) => d.id === dayId)
    if (!day) return
    const updatedDay = { ...day, exercises: [...day.exercises, exercise] }
    await get().updateDay(planId, updatedDay)
  },

  removeExerciseFromDay: async (planId, dayId, exerciseId) => {
    const plan = get().plans.find((p) => p.id === planId)
    if (!plan) return
    const day = plan.days.find((d) => d.id === dayId)
    if (!day) return
    const updatedDay = {
      ...day,
      exercises: day.exercises
        .filter((e) => e.id !== exerciseId)
        .map((e, i) => ({ ...e, order: i })),
    }
    await get().updateDay(planId, updatedDay)
  },

  startSession: async (planId, dayId, dayName, exercises) => {
    const session: WorkoutSession = {
      id: generateId(),
      planId,
      dayId,
      dayName,
      startedAt: new Date(),
      completedAt: null,
      exercises,
    }
    set({ activeSession: session })
  },

  updateSet: (exerciseIndex, setIndex, updates) => {
    const { activeSession } = get()
    if (!activeSession) return
    const exercises = [...activeSession.exercises]
    const exercise = { ...exercises[exerciseIndex] }
    const sets = [...exercise.sets]
    sets[setIndex] = { ...sets[setIndex], ...updates }
    exercise.sets = sets
    exercises[exerciseIndex] = exercise
    set({ activeSession: { ...activeSession, exercises } })
  },

  addSet: (exerciseIndex) => {
    const { activeSession } = get()
    if (!activeSession) return
    const exercises = [...activeSession.exercises]
    const exercise = { ...exercises[exerciseIndex] }
    const newSet: LoggedSet = {
      id: generateId(),
      setNumber: exercise.sets.length + 1,
      weight: 0,
      reps: 0,
      isCompleted: false,
      isPR: false,
    }
    exercise.sets = [...exercise.sets, newSet]
    exercises[exerciseIndex] = exercise
    set({ activeSession: { ...activeSession, exercises } })
  },

  completeSet: (exerciseIndex, setIndex) => {
    const { activeSession, checkIsPR } = get()
    if (!activeSession) return
    const exercises = [...activeSession.exercises]
    const exercise = { ...exercises[exerciseIndex] }
    const sets = [...exercise.sets]
    const currentSet = sets[setIndex]
    const isPR = checkIsPR(exercise.exerciseId, currentSet.weight, currentSet.reps)
    sets[setIndex] = { ...currentSet, isCompleted: !currentSet.isCompleted, isPR: isPR && !currentSet.isCompleted }
    exercise.sets = sets
    exercises[exerciseIndex] = exercise
    set({ activeSession: { ...activeSession, exercises } })
  },

  finishSession: async () => {
    const { activeSession } = get()
    if (!activeSession) return
    const completed = { ...activeSession, completedAt: new Date() }
    try {
      await db.workoutSessions.add(completed)
      set((s) => ({
        activeSession: null,
        sessions: [completed, ...s.sessions],
      }))
    } catch (error) {
      logger.error('Failed to save session:', error)
    }
  },

  cancelSession: () => {
    set({ activeSession: null })
  },

  getPreviousSession: (planId, dayId) => {
    return get().sessions.find(
      (s) => s.planId === planId && s.dayId === dayId && s.completedAt !== null,
    )
  },

  checkIsPR: (exerciseId, weight, reps) => {
    if (weight <= 0 || reps <= 0) return false
    const volume = weight * reps
    const { sessions } = get()
    for (const session of sessions) {
      for (const exercise of session.exercises) {
        if (exercise.exerciseId === exerciseId) {
          for (const s of exercise.sets) {
            if (s.isCompleted && s.weight * s.reps >= volume) {
              return false
            }
          }
        }
      }
    }
    return true
  },
}))
