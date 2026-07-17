import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { courseApi } from '../lib/api'
import { CATEGORIES } from '../lib/format'
import CourseCard from '../components/CourseCard'
import EmptyState from '../components/EmptyState'
import { Spinner } from '../components/Loader'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    courseApi.list()
      .then(({ data }) => setCourses(data.courses || []))
      .catch(() => setError('Could not load courses. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesCategory = category === 'all' || c.category === category
      const matchesQuery =
        !query.trim() ||
        c.title?.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [courses, query, category])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="eyebrow">Catalog</span>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink">Browse courses</h1>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses"
            className="input-field pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('all')}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              category === 'all' ? 'border-amber/50 bg-amber/10 text-amber-soft' : 'border-hairline text-muted hover:text-ink'
            }`}
          >
            All
          </button>
          {Object.entries(CATEGORIES).map(([key, { short }]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                category === key ? 'border-amber/50 bg-amber/10 text-amber-soft' : 'border-hairline text-muted hover:text-ink'
              }`}
            >
              {short}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : error ? (
        <EmptyState title="Couldn't load courses" message={error} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No courses match"
          message={query || category !== 'all' ? 'Try a different search or category.' : 'No courses have been published yet.'}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course, i) => (
            <CourseCard key={course._id} course={course} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
