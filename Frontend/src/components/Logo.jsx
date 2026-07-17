import { Link } from 'react-router-dom'

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`group flex items-center gap-2.5 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 32 32" className="shrink-0">
        <circle cx="16" cy="16" r="12.5" fill="none" stroke="#2A2733" strokeWidth="3" />
        <circle
          cx="16" cy="16" r="12.5" fill="none" stroke="#F2A93B" strokeWidth="3"
          strokeLinecap="round" strokeDasharray="78.5" strokeDashoffset="20"
          transform="rotate(-90 16 16)"
          className="transition-all duration-500 group-hover:stroke-[#A79CF7]"
        />
        <circle cx="16" cy="3.5" r="2.4" fill="#F2A93B" className="transition-colors duration-500 group-hover:fill-[#A79CF7]" />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight text-ink">
        Learn<span className="text-amber">Loop</span>
      </span>
    </Link>
  )
}
