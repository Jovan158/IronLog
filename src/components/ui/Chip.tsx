interface ChipProps {
  label: string
  isActive?: boolean
  onClick?: () => void
}

export function Chip({ label, isActive = false, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        isActive
          ? 'bg-accent text-black'
          : 'bg-surface-alt text-text-secondary hover:text-text-primary'
      }`}
    >
      {label}
    </button>
  )
}
