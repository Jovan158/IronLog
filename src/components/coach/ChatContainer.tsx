import { useEffect, useRef } from 'react'
import { useCoachStore } from '../../stores/coachStore'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'
import { QuickReplies } from './QuickReplies'
import { MessageCircle } from 'lucide-react'

export function ChatContainer() {
  const { messages, isLoading, sendMessage } = useCoachStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = (text: string) => {
    sendMessage(text)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <MessageCircle size={40} className="text-text-muted" />
            <p className="text-sm text-text-secondary text-center">
              Ask me anything about fitness, nutrition, or training
            </p>
            <QuickReplies onSelect={handleSend} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  )
}
