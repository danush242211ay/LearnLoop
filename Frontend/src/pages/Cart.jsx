import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { paymentApi, enrollmentApi, apiErrorMessage } from '../lib/api'
import { loadRazorpay } from '../lib/razorpay'
import { categoryLabel, formatINR } from '../lib/format'
import { Spinner } from '../components/Loader'
import EmptyState from '../components/EmptyState'

export default function Cart() {
  const { courses, total, loading, removeFromCart, clearCart, refresh } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [removingId, setRemovingId] = useState(null)
  const [checkingOut, setCheckingOut] = useState(false)

  async function handleRemove(courseId) {
    setRemovingId(courseId)
    try {
      await removeFromCart(courseId)
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not remove item'))
    } finally {
      setRemovingId(null)
    }
  }

  async function handleClear() {
    try {
      await clearCart()
      toast.success('Cart cleared')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not clear cart'))
    }
  }

  async function handleCheckout() {
    if (courses.length === 0) return

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!keyId) {
      toast.error('Payments aren\'t configured yet — set VITE_RAZORPAY_KEY_ID in your .env file.')
      return
    }

    setCheckingOut(true)
    try {
      const Razorpay = await loadRazorpay()
      const { data } = await paymentApi.createOrder()
      const order = data.order

      const rzp = new Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'LearnLoop',
        description: `${courses.length} course${courses.length === 1 ? '' : 's'}`,
        theme: { color: '#F2A93B' },
        prefill: { email: user?.email, name: user?.name },
        handler: async (response) => {
          try {
            await paymentApi.verifyOrder({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            })
            await enrollmentApi.enroll()
            await refresh()
            toast.success('Payment successful — you\'re enrolled!')
            navigate('/my-learning')
          } catch (err) {
            toast.error(apiErrorMessage(err, 'Payment went through, but enrollment failed. Contact support.'))
          }
        },
        modal: {
          ondismiss: () => setCheckingOut(false),
        },
      })

      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Nothing was charged.')
        setCheckingOut(false)
      })

      rzp.open()
    } catch (err) {
      toast.error(apiErrorMessage(err, err.message || 'Could not start checkout'))
      setCheckingOut(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><Spinner /></div>
  }

  if (courses.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Find a course worth building toward."
          actionLabel="Browse courses"
          actionTo="/courses"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="eyebrow">Checkout</span>
          <h1 className="mt-2 font-display text-3xl font-medium text-ink">Your cart</h1>
        </div>
        <button onClick={handleClear} className="text-sm text-muted hover:text-bad">Clear cart</button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {courses.map((course) => (
            <div key={course._id} className="flex items-center gap-4 rounded-xl2 border border-hairline bg-surface p-4">
              <Link to={`/courses/${course._id}`} className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-surface2">
                {course.image && <img src={course.image} alt="" className="h-full w-full object-cover" />}
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/courses/${course._id}`} className="block truncate font-medium text-ink hover:text-amber-soft">
                  {course.title}
                </Link>
                <span className="eyebrow mt-1 block">{categoryLabel(course.category)}</span>
              </div>
              <span className="font-mono text-sm font-semibold text-ink">{formatINR(course.price)}</span>
              <button
                onClick={() => handleRemove(course._id)}
                disabled={removingId === course._id}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:bg-bad/10 hover:text-bad disabled:opacity-40"
                aria-label="Remove from cart"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <aside>
          <div className="sticky top-24 card p-6">
            <h2 className="font-display text-lg font-medium text-ink">Order summary</h2>
            <div className="mt-4 space-y-2 border-t border-hairline pt-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>{courses.length} course{courses.length === 1 ? '' : 's'}</span>
                <span className="font-mono">{formatINR(total)}</span>
              </div>
              <div className="flex justify-between border-t border-hairline pt-3 text-base font-semibold text-ink">
                <span>Total</span>
                <span className="font-mono">{formatINR(total)}</span>
              </div>
            </div>
            <button onClick={handleCheckout} disabled={checkingOut} className="btn-primary mt-6 w-full">
              {checkingOut ? 'Opening checkout…' : (<>Checkout <ArrowRight size={16} /></>)}
            </button>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-faint">
              <ShieldCheck size={13} /> Payments handled securely by Razorpay.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
