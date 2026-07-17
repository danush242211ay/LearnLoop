import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { apiErrorMessage } from '../lib/api'
import LoopRing from '../components/LoopRing'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [fieldError, setFieldError] = useState('')

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFieldError('')
    setSubmitting(true)
    try {
      await login(form)
      toast.success('Welcome back')
      navigate(location.state?.from || '/')
    } catch (err) {
      if (err?.response?.status === 401) {
        // Email not verified — send them to finish verification instead of a dead end.
        toast('Verify your email to continue', { icon: '✉️' })
        navigate('/verify-email', { state: { email: form.email } })
        return
      }
      const msg = apiErrorMessage(err, 'Could not log in')
      setFieldError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <LoopRing size={48} strokeWidth={4} progress={0.7} />
        <h1 className="mt-5 font-display text-2xl font-medium text-ink">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted">Log in to pick up where you left off.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
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
            <input id="password" type="password" required value={form.password} onChange={update('password')} placeholder="••••••••" className="input-field pl-11" autoComplete="current-password" />
          </div>
        </div>

        {fieldError && <p className="text-sm text-bad">{fieldError}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Logging in…' : (<>Log in <ArrowRight size={16} /></>)}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New to LearnLoop? <Link to="/register" className="text-amber underline underline-offset-2">Create an account</Link>
      </p>
    </div>
  )
}
