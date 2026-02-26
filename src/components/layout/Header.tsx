import { useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'

export function Header() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-primary border-b border-border-default">
      <div className="flex items-center justify-between px-4 h-14">
        <h1 className="text-lg font-bold text-text-primary">IronLog</h1>
        <button
          onClick={() => navigate('/settings')}
          className="text-text-muted hover:text-text-primary transition-colors p-2"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  )
}
