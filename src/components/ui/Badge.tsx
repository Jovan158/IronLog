interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'destructive'
  className?: string
}

const variantClasses = {
  default: 'bg-surface-alt text-text-secondary',
  success: 'bg-success/20 text-success',
  destructive: 'bg-destructive/20 text-destructive',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
