import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'destructive'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-black font-medium rounded-lg px-4 py-2 hover:bg-accent-hover transition-colors',
  ghost: 'text-secondary hover:text-primary hover:bg-surface-alt rounded-lg px-3 py-2 transition-colors',
  destructive: 'bg-destructive text-white font-medium rounded-lg px-4 py-2 hover:bg-destructive/80 transition-colors',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${variantClasses[variant]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
