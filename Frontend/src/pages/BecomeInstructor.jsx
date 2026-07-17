import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Upload, Video, Wallet, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { instructorApi, apiErrorMessage } from '../lib/api'

const STEPS = [
  { Icon: Upload, title: 'Publish a course', text: 'Give it a title, description, price, and a cover image.' },
  { Icon: Video, title: 'Add lessons', text: 'Upload lesson videos in order. Mark a few as free previews.' },
  { Icon: Wallet, title: 'Get paid', text: 'Learners pay through Razorpay; you keep teaching, not chasing invoices.' },
]

export default function BecomeInstructor() {
  const { isInstructor, refresh } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  if (isInstructor) return <Navigate to="/teach/dashboard" replace />

  async function handleBecomeInstructor() {
    setSubmitting(true)
    try {
      await instructorApi.register()
      await refresh()
      toast.success('You\'re an instructor now')
      navigate('/teach/dashboard')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not set up your instructor account'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <span className="eyebrow text-violet-soft">For instructors</span>
      <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
        Teach on LearnLoop.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Turn what you've already built into a course. No lengthy application —
        one click and your instructor studio is ready.
      </p>

      <button onClick={handleBecomeInstructor} disabled={submitting} className="btn-primary mx-auto mt-8">
        {submitting ? 'Setting up your studio…' : (<>Become an instructor <ArrowRight size={16} /></>)}
      </button>

      <div className="mt-16 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
        {STEPS.map(({ Icon, title, text }, i) => (
          <div key={title} className="card p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet/15 text-violet-soft">
              <Icon size={16} />
            </span>
            <h3 className="mt-4 font-display text-base font-medium text-ink">{title}</h3>
            <p className="mt-1.5 text-sm text-muted">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
