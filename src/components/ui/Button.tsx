import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'whatsapp'
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ children, variant = 'primary', size = 'md', className = '', style, ...props }: ButtonProps) {
  let variantStyle: CSSProperties = {}
  let variantClass = ''

  switch (variant) {
    case 'primary':
      variantStyle = { backgroundColor: 'var(--color-primary)', color: 'white' }
      variantClass = 'hover:opacity-90 active:opacity-80'
      break
    case 'outline':
      variantStyle = { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }
      variantClass = 'border hover:opacity-80'
      break
    case 'ghost':
      variantClass = 'text-charcoal hover:bg-silver-100'
      break
    case 'danger':
      variantClass = 'bg-red-500 text-white hover:bg-red-600'
      break
    case 'whatsapp':
      variantClass = 'bg-[#25D366] text-white hover:bg-[#1ebe5a]'
      break
  }

  return (
    <button
      className={`inline-flex items-center gap-2 font-medium rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed ${variantClass} ${sizes[size]} ${className}`}
      style={{ ...variantStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  )
}
