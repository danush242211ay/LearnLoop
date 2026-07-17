import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ImagePlus, ArrowLeft, ArrowRight } from 'lucide-react'
import { instructorApi, apiErrorMessage } from '../lib/api'
import { CATEGORIES } from '../lib/format'

export default function UploadCourse() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!image) {
      setError('Add a cover image for the course.')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('price', form.price)
      formData.append('category', form.category)
      formData.append('image', image)

      const { data } = await instructorApi.uploadCourse(formData)
      toast.success('Course published')
      navigate(`/teach/courses/${data.course._id}/lessons`)
    } catch (err) {
      const msg = apiErrorMessage(err, 'Could not publish the course')
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link to="/teach/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft size={14} /> Back to your courses
      </Link>

      <span className="eyebrow text-violet-soft">New course</span>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink">Publish a course</h1>
      <p className="mt-2 text-sm text-muted">You'll add lessons in the next step.</p>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-6">
        <div>
          <label className="label-field" htmlFor="title">Title</label>
          <input id="title" required value={form.title} onChange={update('title')} placeholder="Systems Programming with Rust" className="input-field" />
        </div>

        <div>
          <label className="label-field" htmlFor="description">Description</label>
          <textarea id="description" required rows={5} value={form.description} onChange={update('description')} placeholder="What will learners walk away knowing how to build?" className="input-field resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field" htmlFor="price">Price (₹)</label>
            <input id="price" type="number" min="0" required value={form.price} onChange={update('price')} placeholder="999" className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="category">Category</label>
            <select id="category" required value={form.category} onChange={update('category')} className="input-field">
              <option value="" disabled>Choose one</option>
              {Object.entries(CATEGORIES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label-field">Cover image</label>
          <label
            htmlFor="image"
            className="flex aspect-[16/7] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-hairline bg-surface2 text-center transition-colors hover:border-amber/50"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full rounded-xl object-cover" />
            ) : (
              <>
                <ImagePlus size={22} className="text-faint" />
                <span className="text-sm text-muted">Click to upload an image</span>
              </>
            )}
          </label>
          <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        {error && <p className="text-sm text-bad">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Publishing…' : (<>Continue to lessons <ArrowRight size={16} /></>)}
        </button>
      </form>
    </div>
  )
}
