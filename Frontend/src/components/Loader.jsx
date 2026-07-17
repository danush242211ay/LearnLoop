import LoopRing from './LoopRing'

export function Spinner({ size = 28 }) {
  return <LoopRing size={size} strokeWidth={Math.max(2, size / 10)} progress={0.28} animated />
}

export default function PageLoader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <Spinner size={44} />
      <p className="eyebrow">{label}…</p>
    </div>
  )
}
