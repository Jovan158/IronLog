import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ToastProvider } from '../components/ui/Toast'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { initializeDatabase } from '../db/init'

const WorkoutPage = lazy(() => import('../pages/WorkoutPage'))
const DiaryPage = lazy(() => import('../pages/DiaryPage'))
const CoachPage = lazy(() => import('../pages/CoachPage'))
const CatalogPage = lazy(() => import('../pages/CatalogPage'))
const SettingsPage = lazy(() => import('../pages/SettingsPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <LoadingSpinner />
    </div>
  )
}

export function App() {
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    initializeDatabase().then(() => setDbReady(true))
  }, [])

  if (!dbReady) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/workouts/*" element={<WorkoutPage />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="/coach" element={<CoachPage />} />
              <Route path="/catalog/*" element={<CatalogPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/workouts" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </ToastProvider>
    </BrowserRouter>
  )
}
