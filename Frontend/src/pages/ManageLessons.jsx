import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Film, Plus, Play, X } from 'lucide-react'
import { instructorApi, apiErrorMessage } from '../lib/api'
import { formatDuration } from '../lib/format'
import PageLoader from '../components/Loader'

const emptyForm = { title: '', description: '', durationMinutes: '', durationSeconds: '', order: '', isPreview: false }

export default function ManageLessons() {
  const { courseId } = useParams()
  const [lessons, setLessons] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [video, setVideo] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function load() {
    instructorApi.lessons(courseId)
      .then(({ data }) => setLessons(data.lessons || []))
      .catch(() => setLessons([]))
  }

  useEffect(load, [courseId])

  useEffect(() => {
    if (lessons && !form.order) {
      setForm((f) => ({ ...f, order: String(lessons.length + 1) }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons])

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!video) {
      setError('Add a video file for this lesson.')
      return
    }

    const minutes = Number(form.durationMinutes || 0)
    const seconds = Number(form.durationSeconds || 0)
    const totalSeconds = minutes * 60 + seconds

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('duration', String(totalSeconds))
      formData.append('order', form.order)
      formData.append('isPreview', String(form.isPreview))
      // Backend's multer config expects the field name "image" even for video files.
      formData.append('image', video)

      await instructorApi.uploadLesson(courseId, formData)
      toast.success('Lesson added')
      setForm(emptyForm)
      setVideo(null)
      load()
    } catch (err) {
      const msg = apiErrorMessage(err, 'Could not add the lesson')
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (lessons === null) return <PageLoader label="Loading lessons" />

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/teach/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft size={14} /> Back to your courses
      </Link>

      <span className="eyebrow text-violet-soft">Course content</span>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink">Manage lessons</h1>

      {lessons.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl2 border border-hairline">
          {lessons.map((lesson) => (
            <div key={lesson._id} className="flex items-center gap-4 border-b border-hairline bg-surface px-5 py-4 last:border-b-0">
              <span className="font-mono text-xs text-faint">{String(lesson.order).padStart(2, '0')}</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet/15 text-violet-soft">
                <Play size={13} fill="currentColor" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{lesson.title}</span>
              {lesson.isPreview && (
                <span className="shrink-0 rounded-full border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">Preview</span>
              )}
              <span className="shrink-0 font-mono text-xs text-faint">{formatDuration(lesson.duration)}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-medium text-ink">
          <Plus size={17} className="text-amber" /> Add a lesson
        </h2>

        <div>
          <label className="label-field" htmlFor="title">Title</label>
          <input id="title" required value={form.title} onChange={update('title')} placeholder="Setting up your first project" className="input-field" />
        </div>

        <div>
          <label className="label-field" htmlFor="description">Description <span className="text-faint">(optional)</span></label>
          <textarea id="description" rows={3} value={form.description} onChange={update('description')} className="input-field resize-none" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label-field" htmlFor="order">Order</label>
            <input id="order" type="number" min="1" required value={form.order} onChange={update('order')} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="durationMinutes">Minutes</label>
            <input id="durationMinutes" type="number" min="0" value={form.durationMinutes} onChange={update('durationMinutes')} placeholder="0" className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="durationSeconds">Seconds</label>
            <input id="durationSeconds" type="number" min="0" max="59" value={form.durationSeconds} onChange={update('durationSeconds')} placeholder="0" className="input-field" />
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.isPreview}
            onChange={(e) => setForm((f) => ({ ...f, isPreview: e.target.checked }))}
            className="h-4 w-4 rounded border-hairline bg-surface2 accent-amber"
          />
          Make this a free preview lesson
        </label>

        <div>
          <label className="label-field">Lesson video</label>
          {video ? (
            <div className="flex items-center justify-between rounded-xl border border-hairline bg-surface2 px-4 py-3">
              <span className="flex items-center gap-2 truncate text-sm text-ink">
                <Film size={15} className="shrink-0 text-amber" /> {video.name}
              </span>
              <button type="button" onClick={() => setVideo(null)} className="text-faint hover:text-bad" aria-label="Remove video">
                <X size={15} />
              </button>
            </div>
          ) : (
            <label htmlFor="video" className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-hairline bg-surface2 py-6 text-sm text-muted transition-colors hover:border-amber/50">
              <Film size={16} className="text-faint" /> Click to upload a video file
            </label>
          )}
          <input id="video" type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)} className="hidden" />
        </div>

        {error && <p className="text-sm text-bad">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Uploading…' : 'Add lesson'}
        </button>
      </form>
    </div>
  )
}
