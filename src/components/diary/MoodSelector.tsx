import type { Mood } from '../../types'
import { MOOD_EMOJIS } from '../../constants'

interface MoodSelectorProps {
  selected: Mood
  onSelect: (mood: Mood) => void
}

const moods: Mood[] = [1, 2, 3, 4, 5]

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex gap-2">
      {moods.map((mood) => (
        <button
          key={mood}
          onClick={() => onSelect(mood)}
          className={`text-2xl p-2 rounded-xl transition-all ${
            selected === mood
              ? 'ring-2 ring-accent bg-surface-alt scale-110'
              : 'hover:bg-surface-alt'
          }`}
          aria-label={`Mood ${mood} of 5`}
        >
          {MOOD_EMOJIS[mood]}
        </button>
      ))}
    </div>
  )
}
