import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDiaryStore } from '../../stores/diaryStore'
import { MoodSelector } from './MoodSelector'
import { GoalsList } from './GoalsList'
import { debounce } from '../../utils'
import type { Mood } from '../../types'

interface DiaryEntryFormProps {
  date: string
}

export function DiaryEntryForm({ date }: DiaryEntryFormProps) {
  const { setMood, addGoal, toggleGoal, removeGoal, updateContent } =
    useDiaryStore()
  const entry = useDiaryStore((s) => s.getEntryForDate(date))
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const debouncedSave = useMemo(
    () => debounce((content: string) => updateContent(date, content), 500),
    [date, updateContent],
  )

  const handleMoodChange = useCallback(
    (mood: Mood) => {
      setMood(date, mood)
    },
    [date, setMood],
  )

  const handleContentChange = (value: string) => {
    debouncedSave(value)
  }

  useEffect(() => {
    if (textareaRef.current && entry) {
      textareaRef.current.value = entry.content
    } else if (textareaRef.current) {
      textareaRef.current.value = ''
    }
  }, [date, entry])

  const autoResize = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.max(200, el.scrollHeight)}px`
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <MoodSelector
        selected={entry?.mood ?? 3}
        onSelect={handleMoodChange}
      />

      <GoalsList
        goals={entry?.goals ?? []}
        onToggle={(id) => toggleGoal(date, id)}
        onAdd={(text) => addGoal(date, text)}
        onRemove={(id) => removeGoal(date, id)}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-text-primary">Journal</label>
        <textarea
          ref={textareaRef}
          onChange={(e) => {
            handleContentChange(e.target.value)
            autoResize()
          }}
          placeholder="How was your day?"
          className="bg-surface-alt border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none resize-none min-h-[200px]"
        />
      </div>
    </div>
  )
}
