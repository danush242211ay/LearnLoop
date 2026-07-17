import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { authApi, apiErrorMessage } from '../lib/api'
import LoopRing from '../components/LoopRing'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [fieldError, setFieldError] = useState('')

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFieldError('')

    if (form.password.length < 6) {
      setFieldError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    try {
      await authApi.register(form)
      toast.success('Account created — check your email for a code')
      navigate('/verify-email', { state: { email: form.email } })
    } catch (err) {
      const msg = apiErrorMessage(err, 'Could not create your account')
      setFieldError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <LoopRing size={48} strokeWidth={4} progress={0.35} />
        <h1 className="mt-5 font-display text-2xl font-medium text-ink">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted">Join LearnLoop and start building.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="label-field" htmlFor="name">Name <span className="text-faint">(optional)</span></label>
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <input id="name" type="text" value={form.name} onChange={update('name')} placeholder="Ada Lovelace" className="input-field pl-11" autoComplete="name" />
          </div>
        </div>
        <div>
          <label className="label-field" htmlFor="email">Email</label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <input id="email" type="email" required value={form.email} onChange={update('email')} placeholder="you@example.com" className="input-field pl-11" autoComplete="email" />
          </div>
        </div>
        <div>
          <label className="label-field" htmlFor="password">Password</label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <input id="password" type="password" required value={form.password} onChange={update('password')} placeholder="At least 6 characters" className="input-field pl-11" autoComplete="new-password" />
          </div>
        </div>

        {fieldError && <p className="text-sm text-bad">{fieldError}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Creating account…' : (<>Create account <ArrowRight size={16} /></>)}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account? <Link to="/login" className="text-amber underline underline-offset-2">Log in</Link>
      </p>
    </div>
  )
}
