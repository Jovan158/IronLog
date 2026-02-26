import { useLocation, useNavigate } from 'react-router-dom'
import { Dumbbell, BookOpen, MessageCircle, Library } from 'lucide-react'

const navItems = [
  { path: '/workouts', label: 'Workouts', icon: Dumbbell },
  { path: '/diary', label: 'Diary', icon: BookOpen },
  { path: '/coach', label: 'Coach', icon: MessageCircle },
  { path: '/catalog', label: 'Catalog', icon: Library },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border-default h-16 z-40">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path)
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                isActive ? 'text-accent' : 'text-text-muted'
              }`}
              aria-label={label}
            >
              <Icon size={20} />
              <span className="text-xs">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
