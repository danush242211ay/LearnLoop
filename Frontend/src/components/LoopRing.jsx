/**
 * LoopRing — the one visual idea the whole brand hangs off.
 *
 * "LearnLoop" -> a ring. It shows up as: the logo mark, the hero graphic
 * (orbiting category nodes), the per-course progress indicator on
 * My Learning, and the loading spinner. Same geometry everywhere, different
 * scale and meaning.
 *
 * progress: 0..1 (1 = fully closed ring, i.e. "completed the loop")
 */
export default function LoopRing({
  size = 96,
  strokeWidth = 6,
  progress = 0,
  color = '#F2A93B',
  trackColor = '#2A2733',
  animated = false,
  showDot = false,
  children,
  className = '',
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)))

  // dot sits at the leading edge of the arc
  const angle = -90 + 360 * Math.max(0, Math.min(1, progress))
  const rad = (angle * Math.PI) / 180
  const cx = size / 2 + radius * Math.cos(rad)
  const cy = size / 2 + radius * Math.sin(rad)

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={animated ? 'animate-spin_slow' : ''}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)' }}
        />
        {showDot && progress > 0 && (
          <circle cx={cx} cy={cy} r={strokeWidth * 0.9} fill={color} />
        )}
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  )
}
