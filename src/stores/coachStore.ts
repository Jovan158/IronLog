import { create } from 'zustand'
import type { CoachMessage } from '../types'
import { db } from '../db/database'
import { generateId } from '../utils'
import { logger } from '../utils/logger'
import {
  COACH_KEYWORD_RESPONSES,
  COACH_DEFAULT_RESPONSE,
  COACH_SYSTEM_PROMPT,
} from '../constants'
import { useSettingsStore } from './settingsStore'

interface CoachStore {
  messages: CoachMessage[]
  isLoading: boolean

  loadMessages: () => Promise<void>
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => Promise<void>
}

function getHardcodedResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const entry of COACH_KEYWORD_RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response
    }
  }
  return COACH_DEFAULT_RESPONSE
}

async function sendToAPI(
  messages: CoachMessage[],
  apiEndpoint: string,
  apiKey: string,
  apiModel: string,
): Promise<string> {
  const apiMessages = [
    { role: 'system' as const, content: COACH_SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ]

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: apiModel,
      messages: apiMessages,
    }),
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[]
  }
  return data.choices[0].message.content
}

export const useCoachStore = create<CoachStore>((set, get) => ({
  messages: [],
  isLoading: false,

  loadMessages: async () => {
    try {
      const messages = await db.coachMessages.orderBy('timestamp').toArray()
      set({ messages })
    } catch (error) {
      logger.error('Failed to load coach messages:', error)
    }
  },

  sendMessage: async (content) => {
    const userMessage: CoachMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    set((s) => ({ messages: [...s.messages, userMessage], isLoading: true }))

    try {
      await db.coachMessages.add(userMessage)

      const settings = useSettingsStore.getState()
      let responseContent: string

      if (settings.aiCoachMode === 'api' && settings.apiKey) {
        responseContent = await sendToAPI(
          [...get().messages],
          settings.apiEndpoint,
          settings.apiKey,
          settings.apiModel,
        )
      } else {
        responseContent = getHardcodedResponse(content)
      }

      const assistantMessage: CoachMessage = {
        id: generateId(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      }

      await db.coachMessages.add(assistantMessage)
      set((s) => ({ messages: [...s.messages, assistantMessage], isLoading: false }))
    } catch (error) {
      logger.error('Failed to send message:', error)
      const errorMessage: CoachMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      }
      set((s) => ({ messages: [...s.messages, errorMessage], isLoading: false }))
    }
  },

  clearMessages: async () => {
    try {
      await db.coachMessages.clear()
      set({ messages: [] })
    } catch (error) {
      logger.error('Failed to clear messages:', error)
    }
  },
}))
