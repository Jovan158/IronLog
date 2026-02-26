import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#0A0A0A',
        surface: '#141414',
        'surface-alt': '#1E1E1E',
        'border-default': '#2A2A2A',
        'text-primary': '#F5F5F5',
        'text-secondary': '#A0A0A0',
        'text-muted': '#666666',
        accent: '#FFFFFF',
        'accent-hover': '#E0E0E0',
        success: '#22C55E',
        destructive: '#EF4444',
      },
    },
  },
  plugins: [],
} satisfies Config
