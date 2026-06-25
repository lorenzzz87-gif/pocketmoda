import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'teal' | 'silver' | 'orange' | 'green' | 'red' | 'blue'
}

const variants = {
  teal:   'bg-teal-50 text-teal border-teal/20',
  silver: 'bg-silver-100 text-silver-600 border-silver-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  green:  'bg-emerald-50 text-emerald-600 border-emerald-200',
  red:    'bg-red-50 text-red-600 border-red-200',
  blue:   'bg-blue-50 text-blue-600 border-blue-200',
}

export function Badge({ children, variant = 'silver' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded ${variants[variant]}`}>
      {children}
    </span>
  )
}
