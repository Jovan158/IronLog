import { useState } from 'react'
import { useWorkoutStore } from '../stores/workoutStore'
import { Tabs } from '../components/ui/Tabs'
import { StartWorkout } from '../components/workout/StartWorkout'
import { SessionLogger } from '../components/workout/SessionLogger'
import { SessionHistory } from '../components/workout/SessionHistory'
import { PlanList } from '../components/workout/PlanList'
import { Button } from '../components/ui/Button'
import { Settings2 } from 'lucide-react'

const tabs = [
  { id: 'workout', label: 'Workout' },
  { id: 'history', label: 'History' },
]

export default function WorkoutPage() {
  const activeSession = useWorkoutStore((s) => s.activeSession)
  const [activeTab, setActiveTab] = useState('workout')
  const [showPlans, setShowPlans] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  if (activeSession) {
    return (
      <div className="p-4">
        <SessionLogger onFinished={() => setIsStarting(false)} />
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Workouts</h2>
        <button
          onClick={() => {
            setShowPlans(!showPlans)
            setIsStarting(false)
          }}
          className="text-text-muted hover:text-text-primary p-2 transition-colors"
          aria-label="Manage plans"
        >
          <Settings2 size={20} />
        </button>
      </div>

      {showPlans ? (
        <PlanList />
      ) : (
        <>
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'workout' && (
            isStarting ? (
              <StartWorkout onStarted={() => setIsStarting(false)} />
            ) : (
              <div className="flex flex-col items-center gap-4 py-8">
                <Button onClick={() => setIsStarting(true)} className="text-base px-8 py-3">
                  Start Workout
                </Button>
                <p className="text-xs text-text-muted">Select a plan and day to begin</p>
              </div>
            )
          )}

          {activeTab === 'history' && <SessionHistory />}
        </>
      )}
    </div>
  )
}
