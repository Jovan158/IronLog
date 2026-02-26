export interface WorkoutPlan {
  id: string
  name: string
  days: WorkoutDay[]
  createdAt: Date
  updatedAt: Date
}

export interface WorkoutDay {
  id: string
  name: string
  exercises: PlannedExercise[]
  order: number
}

export interface PlannedExercise {
  id: string
  exerciseId: string
  exerciseName: string
  sets: number
  repRangeMin: number
  repRangeMax: number
  order: number
}

export interface WorkoutSession {
  id: string
  planId: string
  dayId: string
  dayName: string
  startedAt: Date
  completedAt: Date | null
  exercises: LoggedExercise[]
}

export interface LoggedExercise {
  id: string
  exerciseId: string
  exerciseName: string
  sets: LoggedSet[]
}

export interface LoggedSet {
  id: string
  setNumber: number
  weight: number
  reps: number
  isCompleted: boolean
  isPR: boolean
}

export interface DiaryEntry {
  id: string
  date: string
  content: string
  goals: DiaryGoal[]
  mood: 1 | 2 | 3 | 4 | 5
  createdAt: Date
  updatedAt: Date
}

export interface DiaryGoal {
  id: string
  text: string
  isCompleted: boolean
}

export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'legs'
  | 'core'
  | 'cardio'
  | 'full-body'

export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'band'
  | 'kettlebell'

export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  equipment: EquipmentType
  videoUrl: string
  thumbnailUrl: string
  instructions: string[]
  primaryMuscles: string[]
  secondaryMuscles: string[]
}

export interface CoachMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export type AiCoachMode = 'builtin' | 'api'

export interface AppSettings {
  aiCoachMode: AiCoachMode
  apiEndpoint: string
  apiKey: string
  apiModel: string
  units: 'kg' | 'lbs'
}

export type Mood = 1 | 2 | 3 | 4 | 5
