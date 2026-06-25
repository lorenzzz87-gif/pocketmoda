interface LogoProps {
  size?: number
  showWordmark?: boolean
  light?: boolean
  color?: string
}

export function Logo({ size = 32, showWordmark = true, light = false, color }: LogoProps) {
  const textColor = color ?? (light ? '#fff' : 'var(--color-primary)')
  const iconColor = color ?? 'var(--color-primary)'

  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size * 1.1} viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hang tag string / loop */}
        <path
          d="M22 2 C22 2 22 2 22 2 C19 2 17 4 17 6.5 C17 9 19 11 22 11 C25 11 27 9 27 6.5 C27 4 25 2 22 2 Z"
          fill="none"
          stroke={iconColor}
          strokeWidth="1.8"
        />

        {/* Tag body — rounded rectangle */}
        <rect x="4" y="10" width="36" height="36" rx="4" fill={iconColor} />

        {/* Subtle shine gradient overlay */}
        <rect x="4" y="10" width="36" height="14" rx="4" fill="white" fillOpacity="0.08" />

        {/* P letter - bold, fills left side */}
        <text
          x="7"
          y="37"
          fontFamily="'Inter', 'Arial Black', sans-serif"
          fontSize="20"
          fontWeight="800"
          fill="white"
          letterSpacing="-1"
        >P</text>

        {/* M letter */}
        <text
          x="22"
          y="37"
          fontFamily="'Inter', 'Arial Black', sans-serif"
          fontSize="20"
          fontWeight="800"
          fill="white"
          fillOpacity="0.85"
          letterSpacing="-1"
        >M</text>

        {/* Phone silhouette at bottom-right of tag */}
        <rect x="28" y="36" width="9" height="7" rx="1.5" fill="white" fillOpacity="0.25" />
        <rect x="29.5" y="37.5" width="6" height="4" rx="0.5" fill="white" fillOpacity="0.4" />
        <circle cx="32.5" cy="42.5" r="0.8" fill="white" fillOpacity="0.6" />
      </svg>

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
