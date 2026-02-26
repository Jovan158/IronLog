import { db } from '../db/database'
import { reseedExercises } from '../db/init'
import { logger } from './logger'

interface ExportData {
  version: 1
  exportedAt: string
  workoutPlans: unknown[]
  workoutSessions: unknown[]
  diaryEntries: unknown[]
  exercises: unknown[]
  coachMessages: unknown[]
}

export async function exportAllData(): Promise<void> {
  try {
    const [workoutPlans, workoutSessions, diaryEntries, exercises, coachMessages] =
      await Promise.all([
        db.workoutPlans.toArray(),
        db.workoutSessions.toArray(),
        db.diaryEntries.toArray(),
        db.exercises.toArray(),
        db.coachMessages.toArray(),
      ])

    const data: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      workoutPlans,
      workoutSessions,
      diaryEntries,
      exercises,
      coachMessages,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ironlog-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    logger.error('Failed to export data:', error)
    throw error
  }
}

export async function importData(file: File): Promise<void> {
  try {
    const text = await file.text()
    const data = JSON.parse(text) as ExportData

    if (!data.version || !data.workoutPlans) {
      throw new Error('Invalid backup file format')
    }

    await db.transaction(
      'rw',
      [db.workoutPlans, db.workoutSessions, db.diaryEntries, db.exercises, db.coachMessages],
      async () => {
        await db.workoutPlans.clear()
        await db.workoutSessions.clear()
        await db.diaryEntries.clear()
        await db.exercises.clear()
        await db.coachMessages.clear()

        if (data.workoutPlans.length) await db.workoutPlans.bulkAdd(data.workoutPlans as never[])
        if (data.workoutSessions.length)
          await db.workoutSessions.bulkAdd(data.workoutSessions as never[])
        if (data.diaryEntries.length) await db.diaryEntries.bulkAdd(data.diaryEntries as never[])
        if (data.exercises.length) await db.exercises.bulkAdd(data.exercises as never[])
        if (data.coachMessages.length)
          await db.coachMessages.bulkAdd(data.coachMessages as never[])
      },
    )
  } catch (error) {
    logger.error('Failed to import data:', error)
    throw error
  }
}

export async function deleteAllData(): Promise<void> {
  try {
    await db.transaction(
      'rw',
      [db.workoutPlans, db.workoutSessions, db.diaryEntries, db.exercises, db.coachMessages],
      async () => {
        await db.workoutPlans.clear()
        await db.workoutSessions.clear()
        await db.diaryEntries.clear()
        await db.exercises.clear()
        await db.coachMessages.clear()
      },
    )
    await reseedExercises()
  } catch (error) {
    logger.error('Failed to delete all data:', error)
    throw error
  }
}
