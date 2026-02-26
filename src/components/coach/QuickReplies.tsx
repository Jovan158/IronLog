import { COACH_QUICK_REPLIES } from '../../constants'

interface QuickRepliesProps {
  onSelect: (text: string) => void
}

export function QuickReplies({ onSelect }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {COACH_QUICK_REPLIES.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          className="bg-surface-alt text-text-secondary text-xs rounded-full px-3 py-1.5 hover:text-text-primary transition-colors"
        >
          {reply}
        </button>
      ))}
    </div>
  )
}
