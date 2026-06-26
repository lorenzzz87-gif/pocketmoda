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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
          <span style={{
            fontFamily: "'Arial', sans-serif",
            fontSize: '11px',
            letterSpacing: '6px',
            color: '#3AAFA9',
            textTransform: 'uppercase',
            fontWeight: 400,
          }}>pocket</span>
          <span style={{
            fontFamily: "'Georgia', 'Palatino', serif",
            fontSize: '20px',
            fontWeight: 700,
            color: light ? '#fff' : '#1E2325',
            letterSpacing: '-0.5px',
            marginTop: '-1px',
          }}>Moda</span>
        </div>
      )}
    </div>
  )
}
