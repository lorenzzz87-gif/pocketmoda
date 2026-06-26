interface LogoProps {
  size?: number
  showWordmark?: boolean
  light?: boolean
  color?: string
}

export function Logo({ size = 32, showWordmark = true, light = false }: LogoProps) {
  const textColor = light ? '#fff' : 'var(--color-primary)'

  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/logo.png"
        alt="PocketModa"
        width={size}
        height={size}
        style={{ objectFit: 'contain', flexShrink: 0 }}
      />
      {showWordmark && (
        <span
          style={{ color: textColor }}
          className="text-lg font-semibold tracking-tight leading-none"
        >
          Pocket<span className="font-light">moda</span>
        </span>
      )}
    </div>
  )
}
