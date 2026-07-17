import { Link } from 'react-router-dom'
import LoopRing from '../components/LoopRing'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <LoopRing size={64} strokeWidth={5} progress={0.25} />
      <h1 className="mt-6 font-display text-2xl font-medium text-ink">This page looped out of orbit</h1>
      <p className="mt-2 text-sm text-muted">There's nothing at this address.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  )
}
