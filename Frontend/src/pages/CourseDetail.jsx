import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Lock, Play, ShoppingBag, CheckCircle2, X, LogIn } from 'lucide-react'
import { courseApi, enrollmentApi, apiErrorMessage } from '../lib/api'
import { categoryLabel, formatINR, formatDuration } from '../lib/format'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import PageLoader from '../components/Loader'
import EmptyState from '../components/EmptyState'

export default function CourseDetail() {
  const { courseId } = useParams()
  const { isAuthenticated } = useAuth()
  const { addToCart, isInCart } = useCart()

  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState(null) // null = not fetched (either loading or not logged in)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [playingLesson, setPlayingLesson] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        // There's no GET /course/:id in the API, so we load the full catalog
        // and find this course - the backend only exposes list + lessons.
        const { data } = await courseApi.list()
        const found = (data.courses || []).find((c) => c._id === courseId)
        if (!cancelled) setCourse(found || null)
      } catch {
        if (!cancelled) setCourse(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [courseId])

  useEffect(() => {
    if (!isAuthenticated || !courseId) return
    let cancelled = false

    courseApi.lessons(courseId)
      .then(({ data }) => { if (!cancelled) setLessons(data.lessons || []) })
      .catch(() => { if (!cancelled) setLessons([]) })

    enrollmentApi.myCourses()
      .then(({ data }) => {
        if (cancelled) return
        const enrolled = (Array.isArray(data) ? data : []).some((e) => e.course?._id === courseId)
        setIsEnrolled(enrolled)
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [isAuthenticated, courseId])

  async function handleAddToCart() {
    setAdding(true)
    try {
      await addToCart(courseId)
      toast.success('Added to cart')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not add to cart'))
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <PageLoader label="Loading course" />

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Course not found" message="It may have been removed, or the link is off." actionLabel="Browse courses" actionTo="/courses" />
      </div>
    )
  }

  const inCart = isInCart(courseId)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          <span className="eyebrow text-violet-soft">{categoryLabel(course.category)}</span>
          <h1 className="mt-2 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
            {course.title}
          </h1>
          <p className="mt-2 text-sm text-faint">
            {course.instructor?.name ? `Taught by ${course.instructor.name}` : 'LearnLoop instructor'}
          </p>

          <div className="mt-6 overflow-hidden rounded-xl2 border border-hairline bg-surface2">
            {playingLesson ? (
              <div className="relative">
                <video
                  key={playingLesson.videoUrl}
                  src={playingLesson.videoUrl}
                  controls
                  autoPlay
                  className="aspect-video w-full bg-black"
                />
                <button
                  onClick={() => setPlayingLesson(null)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-canvas/80 text-ink backdrop-blur hover:bg-canvas"
                  aria-label="Close player"
                >
                  <X size={16} />
                </button>
              </div>
            ) : course.image ? (
              <img src={course.image} alt="" className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center text-faint">No preview image</div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="font-display text-xl font-medium text-ink">About this course</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted">{course.description}</p>
          </div>

          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-ink">Course content</h2>
              {isEnrolled && (
                <span className="flex items-center gap-1.5 rounded-full border border-good/30 bg-good/10 px-3 py-1 text-xs font-medium text-good">
                  <CheckCircle2 size={13} /> Enrolled
                </span>
              )}
            </div>

            {!isAuthenticated ? (
              <div className="flex items-center gap-3 rounded-xl2 border border-dashed border-hairline bg-surface/50 p-5 text-sm text-muted">
                <LogIn size={16} className="shrink-0 text-faint" />
                <span>
                  <Link to="/login" state={{ from: `/courses/${courseId}` }} className="text-amber underline underline-offset-2">Log in</Link> to preview lessons from this course.
                </span>
              </div>
            ) : lessons === null ? (
              <div className="rounded-xl2 border border-hairline bg-surface/50 p-5 text-sm text-muted">Loading lessons…</div>
            ) : lessons.length === 0 ? (
              <div className="rounded-xl2 border border-dashed border-hairline bg-surface/50 p-5 text-sm text-muted">
                No lessons published yet — check back soon.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl2 border border-hairline">
                {!isEnrolled && (
                  <div className="border-b border-hairline bg-surface2 px-5 py-2.5 text-xs text-faint">
                    Showing {lessons.length} free preview lesson{lessons.length === 1 ? '' : 's'}. Enroll to unlock the full course.
                  </div>
                )}
                {lessons.map((lesson, i) => (
                  <button
                    key={lesson._id}
                    onClick={() => setPlayingLesson(lesson)}
                    className="flex w-full items-center gap-4 border-b border-hairline bg-surface px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-surface2"
                  >
                    <span className="font-mono text-xs text-faint">{String(lesson.order ?? i + 1).padStart(2, '0')}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/10 text-amber">
                      <Play size={13} fill="currentColor" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-ink">{lesson.title}</span>
                      {lesson.description && <span className="mt-0.5 block text-xs text-faint line-clamp-1">{lesson.description}</span>}
                    </span>
                    {lesson.isPreview && (
                      <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">Preview</span>
                    )}
                    <span className="font-mono text-xs text-faint">{formatDuration(lesson.duration)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Purchase card */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 card p-6">
            <span className="font-mono text-3xl font-semibold text-ink">{formatINR(course.price)}</span>

            {isEnrolled ? (
              <Link to="/my-learning" className="btn-primary mt-6 w-full">
                <CheckCircle2 size={16} /> Go to My Learning
              </Link>
            ) : inCart ? (
              <Link to="/cart" className="btn-secondary mt-6 w-full">
                <ShoppingBag size={16} /> In your cart — view cart
              </Link>
            ) : (
              <button onClick={handleAddToCart} disabled={adding} className="btn-primary mt-6 w-full">
                {adding ? 'Adding…' : (<><ShoppingBag size={16} /> Add to cart</>)}
              </button>
            )}

            <dl className="mt-6 space-y-3 border-t border-hairline pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Category</dt>
                <dd className="text-ink">{categoryLabel(course.category)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Instructor</dt>
                <dd className="text-ink">{course.instructor?.name || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Access</dt>
                <dd className="flex items-center gap-1 text-ink">
                  {isEnrolled ? 'Full course' : <><Lock size={12} /> Preview only</>}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}
