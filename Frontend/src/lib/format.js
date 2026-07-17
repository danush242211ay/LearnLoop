// Matches the enum in Backend/src/models/course.model.js exactly.
export const CATEGORIES = {
  webdevelopment: { label: 'Web Development', short: 'Web' },
  ai: { label: 'Artificial Intelligence', short: 'AI' },
  cloud: { label: 'Cloud Computing', short: 'Cloud' },
  appdevelopment: { label: 'App Development', short: 'App' },
  embedded: { label: 'Embedded Systems', short: 'Embedded' },
}

export function categoryLabel(key) {
  return CATEGORIES[key]?.label || key
}

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount ?? 0)
}

export function formatDuration(seconds = 0) {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  if (m === 0) return `${s}s`
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

export function initials(nameOrEmail = '') {
  const base = nameOrEmail.trim()
  if (!base) return '?'
  const namePart = base.includes('@') ? base.split('@')[0] : base
  const parts = namePart.split(/[\s._-]+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
