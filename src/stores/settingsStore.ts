import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AiCoachMode, AppSettings } from '../types'
import { DEFAULT_API_ENDPOINT, DEFAULT_API_MODEL } from '../constants'

interface SettingsStore extends AppSettings {
  setAiCoachMode: (mode: AiCoachMode) => void
  setApiEndpoint: (url: string) => void
  setApiKey: (key: string) => void
  setApiModel: (model: string) => void
  setUnits: (units: 'kg' | 'lbs') => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      aiCoachMode: 'builtin',
      apiEndpoint: DEFAULT_API_ENDPOINT,
      apiKey: '',
      apiModel: DEFAULT_API_MODEL,
      units: 'kg',
      setAiCoachMode: (mode) => set({ aiCoachMode: mode }),
      setApiEndpoint: (url) => set({ apiEndpoint: url }),
      setApiKey: (key) => set({ apiKey: key }),
      setApiModel: (model) => set({ apiModel: model }),
      setUnits: (units) => set({ units }),
    }),
    { name: 'ironlog-settings' },
  ),
)
