import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ArrowRight } from 'lucide-react'
import { enrollmentApi } from '../lib/api'
import { categoryLabel } from '../lib/format'
import PageLoader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import LoopRing from '../components/LoopRing'

export default function MyLearning() {
  const [enrollments, setEnrollments] = useState(null)

  useEffect(() => {
    enrollmentApi.myCourses()
      .then(({ data }) => setEnrollments(Array.isArray(data) ? data : []))
      .catch(() => setEnrollments([]))
  }, [])

  if (enrollments === null) return <PageLoader label="Loading your courses" />

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="eyebrow">Your loop</span>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink">My Learning</h1>
      </div>

      {enrollments.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Nothing here yet"
          message="Enroll in a course and it'll show up here, ready whenever you are."
          actionLabel="Browse courses"
          actionTo="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => {
            const course = enrollment.course
            if (!course) return null
            return (
              <Link
                key={enrollment._id}
                to={`/courses/${course._id}`}
                className="group flex items-center gap-4 rounded-xl2 border border-hairline bg-surface p-4 transition-colors hover:border-amber/40"
              >
                <LoopRing size={52} strokeWidth={4} progress={1} color="#4ADE80">
                  <GraduationCap size={18} className="text-good" />
                </LoopRing>
                <div className="min-w-0 flex-1">
                  <span className="eyebrow">{categoryLabel(course.category)}</span>
                  <h3 className="mt-0.5 truncate font-display text-base font-medium text-ink">{course.title}</h3>
                  <p className="mt-0.5 text-xs text-faint">
                    Enrolled {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-faint transition-transform group-hover:translate-x-1 group-hover:text-amber" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
