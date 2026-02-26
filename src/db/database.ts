import Dexie, { type EntityTable } from 'dexie'
import type { WorkoutPlan, WorkoutSession, DiaryEntry, Exercise, CoachMessage } from '../types'

class IronLogDB extends Dexie {
  workoutPlans!: EntityTable<WorkoutPlan, 'id'>
  workoutSessions!: EntityTable<WorkoutSession, 'id'>
  diaryEntries!: EntityTable<DiaryEntry, 'id'>
  exercises!: EntityTable<Exercise, 'id'>
  coachMessages!: EntityTable<CoachMessage, 'id'>

  constructor() {
    super('IronLogDB')

    this.version(1).stores({
      workoutPlans: 'id, name, createdAt',
      workoutSessions: 'id, planId, dayId, startedAt, completedAt',
      diaryEntries: 'id, date',
      exercises: 'id, name, category, equipment',
      coachMessages: 'id, timestamp',
    })
  }
}

export const db = new IronLogDB()
