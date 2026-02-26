import { memo } from 'react'
import type { CoachMessage } from '../../types'

interface ChatMessageProps {
  message: CoachMessage
}

export const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-2 text-sm whitespace-pre-wrap ${
          isUser
            ? 'bg-surface-alt rounded-2xl rounded-br-sm text-text-primary'
            : 'bg-surface rounded-2xl rounded-bl-sm text-text-primary'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
})
