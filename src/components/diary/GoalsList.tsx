import { useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import type { DiaryGoal } from '../../types'

interface GoalsListProps {
  goals: DiaryGoal[]
  onToggle: (goalId: string) => void
  onAdd: (text: string) => void
  onRemove: (goalId: string) => void
}

export function GoalsList({ goals, onToggle, onAdd, onRemove }: GoalsListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newGoalText, setNewGoalText] = useState('')

  const handleAdd = () => {
    if (!newGoalText.trim()) return
    onAdd(newGoalText.trim())
    setNewGoalText('')
    setIsAdding(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-text-primary">Today&apos;s Goals</h3>

      {goals.map((goal) => (
        <div key={goal.id} className="flex items-center gap-2 group">
          <button
            onClick={() => onToggle(goal.id)}
            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
              goal.isCompleted
                ? 'bg-success border-success'
                : 'border-border-default hover:border-accent'
            }`}
            aria-label={goal.isCompleted ? 'Mark goal incomplete' : 'Mark goal complete'}
          >
            {goal.isCompleted && <Check size={12} className="text-black" />}
          </button>
          <span
            className={`text-sm flex-1 ${
              goal.isCompleted ? 'text-text-muted line-through' : 'text-text-primary'
            }`}
          >
            {goal.text}
          </span>
          <button
            onClick={() => onRemove(goal.id)}
            className="text-text-muted hover:text-destructive opacity-0 group-hover:opacity-100 transition-all p-0.5"
            aria-label="Remove goal"
          >
            <X size={14} />
          </button>
        </div>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
              if (e.key === 'Escape') {
                setIsAdding(false)
                setNewGoalText('')
              }
            }}
            onBlur={() => {
              if (newGoalText.trim()) handleAdd()
              else setIsAdding(false)
            }}
            placeholder="Enter a goal..."
            className="flex-1 bg-surface-alt border border-border-default rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors py-1 self-start"
        >
          <Plus size={14} />
          Add Goal
        </button>
      )}
    </div>
  )
}
