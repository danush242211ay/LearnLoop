import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { categoryLabel, formatINR } from '../lib/format'

export default function CourseCard({ course, index = 0 }) {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl2 border border-hairline bg-surface
                 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-amber/40
                 animate-rise"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface2">
        {course.image ? (
          <img
            src={course.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-faint">
            <span className="eyebrow">No preview</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />

        {/* signature corner arc — draws in on hover */}
        <svg className="absolute -bottom-3 -right-3 h-16 w-16 opacity-70" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r="26" fill="none" stroke="#F2A93B" strokeWidth="2.5"
            strokeLinecap="round" strokeDasharray="163"
            strokeDashoffset="163"
            className="transition-[stroke-dashoffset] duration-500 ease-out group-hover:[stroke-dashoffset:70]"
          />
        </svg>

        <span className="absolute left-3 top-3 rounded-full border border-hairline bg-canvas/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-soft backdrop-blur">
          {categoryLabel(course.category)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-medium leading-snug text-ink line-clamp-2">
          {course.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{course.description}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xs text-faint">
            {course.instructor?.name ? `by ${course.instructor.name}` : 'LearnLoop instructor'}
          </span>
          <span className="flex items-center gap-1 font-mono text-sm font-semibold text-ink">
            {formatINR(course.price)}
            <ArrowUpRight size={14} className="text-amber transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
