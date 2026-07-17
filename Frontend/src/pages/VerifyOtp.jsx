import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MailCheck, ArrowRight } from 'lucide-react'
import { authApi, apiErrorMessage } from '../lib/api'
import OtpInput from '../components/OtpInput'

export default function VerifyOtp() {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Enter the email you registered with.')
      return
    }
    if (otp.length !== 6) {
      setError('Enter the full 6-digit code.')
      return
    }

    setSubmitting(true)
    try {
      await authApi.verifyEmail({ email, otp })
      toast.success('Email verified — you can log in now')
      navigate('/login', { state: { from: '/' } })
    } catch (err) {
      const msg = apiErrorMessage(err, 'That code didn\'t work')
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-hairline bg-surface text-amber">
          <MailCheck size={22} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-medium text-ink">Check your inbox</h1>
        <p className="mt-1.5 max-w-xs text-sm text-muted">
          We sent a 6-digit code to your email. Enter it below to verify your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        <div>
          <label className="label-field" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field"
          />
        </div>

        <div>
          <label className="label-field">6-digit code</label>
          <OtpInput value={otp} onChange={setOtp} />
        </div>

        {error && <p className="text-sm text-bad">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Verifying…' : (<>Verify email <ArrowRight size={16} /></>)}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Wrong email? <Link to="/register" className="text-amber underline underline-offset-2">Start over</Link>
      </p>
    </div>
  )
}
