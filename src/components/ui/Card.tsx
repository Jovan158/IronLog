import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`bg-surface rounded-xl border border-border-default p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}
