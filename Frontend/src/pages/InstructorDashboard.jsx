import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ListVideo, ExternalLink, LayoutGrid } from 'lucide-react'
import { instructorApi } from '../lib/api'
import { categoryLabel, formatINR } from '../lib/format'
import PageLoader from '../components/Loader'
import EmptyState from '../components/EmptyState'

export default function InstructorDashboard() {
  const [courses, setCourses] = useState(null)

  useEffect(() => {
    instructorApi.myCourses()
      .then(({ data }) => setCourses(data.courses || []))
      .catch(() => setCourses([]))
  }, [])

  if (courses === null) return <PageLoader label="Loading your studio" />

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-violet-soft">Instructor studio</span>
          <h1 className="mt-2 font-display text-3xl font-medium text-ink">Your courses</h1>
        </div>
        <Link to="/teach/courses/new" className="btn-primary">
          <Plus size={16} /> New course
        </Link>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="No courses yet"
          message="Publish your first course to start adding lessons."
          actionLabel="Create a course"
          actionTo="/teach/courses/new"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course._id} className="flex flex-col overflow-hidden rounded-xl2 border border-hairline bg-surface">
              <div className="aspect-[16/9] bg-surface2">
                {course.image && <img src={course.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <span className="eyebrow">{categoryLabel(course.category)}</span>
                <h3 className="font-display text-base font-medium leading-snug text-ink line-clamp-2">{course.title}</h3>
                <span className="font-mono text-sm text-muted">{formatINR(course.price)}</span>
                <div className="mt-auto flex gap-2 pt-3">
                  <Link to={`/teach/courses/${course._id}/lessons`} className="btn-secondary flex-1 !py-2 text-sm">
                    <ListVideo size={14} /> Lessons
                  </Link>
                  <Link to={`/courses/${course._id}`} className="btn-ghost !py-2" aria-label="View public page">
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
