import { useEffect } from 'react'
import { useCoachStore } from '../stores/coachStore'
import { ChatContainer } from '../components/coach/ChatContainer'

export default function CoachPage() {
  const loadMessages = useCoachStore((s) => s.loadMessages)

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  return <ChatContainer />
}
