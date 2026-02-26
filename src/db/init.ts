import { db } from './database'
import { seedExercises } from './seed'
import { logger } from '../utils/logger'

let initialized = false

export async function initializeDatabase(): Promise<void> {
  if (initialized) return

  try {
    const count = await db.exercises.count()
    if (count === 0) {
      await db.exercises.bulkAdd(seedExercises)
      logger.log(`Seeded ${seedExercises.length} exercises`)
    }
    initialized = true
  } catch (error) {
    logger.error('Failed to initialize database:', error)
    throw error
  }
}

export async function reseedExercises(): Promise<void> {
  try {
    const count = await db.exercises.count()
    if (count === 0) {
      await db.exercises.bulkAdd(seedExercises)
      logger.log(`Re-seeded ${seedExercises.length} exercises`)
    }
  } catch (error) {
    logger.error('Failed to reseed exercises:', error)
    throw error
  }
}
