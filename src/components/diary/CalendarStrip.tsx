import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getWeekDates, formatISODate, isToday } from '../../utils'

interface CalendarStripProps {
  selectedDate: string
  onSelectDate: (date: string) => void
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarStrip({ selectedDate, onSelectDate }: CalendarStripProps) {
  const [referenceDate, setReferenceDate] = useState(new Date())
  const weekDates = getWeekDates(referenceDate)

  const goToPreviousWeek = () => {
    const d = new Date(referenceDate)
    d.setDate(d.getDate() - 7)
    setReferenceDate(d)
  }

  const goToNextWeek = () => {
    const d = new Date(referenceDate)
    d.setDate(d.getDate() + 7)
    setReferenceDate(d)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousWeek}
          className="text-text-muted hover:text-text-primary p-1 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-xs text-text-secondary">
          {weekDates[0].toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
        <button
          onClick={goToNextWeek}
          className="text-text-muted hover:text-text-primary p-1 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="flex gap-1">
        {weekDates.map((date, i) => {
          const iso = formatISODate(date)
          const isSelected = iso === selectedDate
          const isTodayDate = isToday(date)

          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg transition-colors ${
                isSelected ? 'bg-surface-alt' : 'hover:bg-surface-alt/50'
              }`}
            >
              <span className="text-[10px] text-text-muted">{DAY_LABELS[i]}</span>
              <span
                className={`text-sm font-medium ${
                  isSelected ? 'text-accent' : 'text-text-secondary'
                }`}
              >
                {date.getDate()}
              </span>
              {isTodayDate && (
                <div className="w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
