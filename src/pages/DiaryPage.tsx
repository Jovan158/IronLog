import { useEffect, useState } from 'react'
import { useDiaryStore } from '../stores/diaryStore'
import { Tabs } from '../components/ui/Tabs'
import { CalendarStrip } from '../components/diary/CalendarStrip'
import { DiaryEntryForm } from '../components/diary/DiaryEntryForm'
import { WeeklySummary } from '../components/diary/WeeklySummary'

const tabs = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
]

export default function DiaryPage() {
  const { selectedDate, setSelectedDate, loadEntries } = useDiaryStore()
  const [activeTab, setActiveTab] = useState('day')

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-text-primary">Diary</h2>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'day' && (
        <>
          <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <DiaryEntryForm date={selectedDate} />
        </>
      )}

      {activeTab === 'week' && <WeeklySummary />}
    </div>
  )
}
