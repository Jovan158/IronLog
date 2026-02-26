interface LoadingSpinnerProps {
  size?: number
}

export function LoadingSpinner({ size = 24 }: LoadingSpinnerProps) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-border-default border-t-accent"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  )
}
