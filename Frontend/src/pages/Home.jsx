import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Cpu, Cloud, Smartphone, BrainCircuit } from 'lucide-react'
import { courseApi } from '../lib/api'
import CourseCard from '../components/CourseCard'
import { Spinner } from '../components/Loader'

const ORBIT_NODES = [
  { label: 'Web', Icon: Code2, angle: -90 },
  { label: 'AI', Icon: BrainCircuit, angle: -18 },
  { label: 'Cloud', Icon: Cloud, angle: 54 },
  { label: 'App', Icon: Smartphone, angle: 126 },
  { label: 'Embedded', Icon: Cpu, angle: 198 },
]

function HeroOrbit() {
  const size = 380
  const radius = 148
  const center = size / 2

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#2A2733" strokeWidth="1.5" />
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#F2A93B" strokeWidth="1.5"
          strokeDasharray="6 10" strokeLinecap="round" className="animate-spin_slow origin-center" />
      </svg>

      {/* center mark */}
      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-hairline bg-surface text-center shadow-glow">
        <span className="font-display text-sm font-semibold text-ink">Learn<span className="text-amber">Loop</span></span>
        <span className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-faint">v1</span>
      </div>

      {ORBIT_NODES.map(({ label, Icon, angle }) => {
        const rad = (angle * Math.PI) / 180
        const x = center + radius * Math.cos(rad)
        const y = center + radius * Math.sin(rad)
        return (
          <div
            key={label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: x, top: y }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-surface2 text-violet-soft shadow-card transition-transform duration-300 hover:scale-110 hover:border-violet/50">
              <Icon size={19} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-faint">{label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    courseApi.list()
      .then(({ data }) => setCourses(data.courses || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pt-24">
        <div className="animate-rise">
          <span className="eyebrow text-violet-soft">Web · AI · Cloud · App · Embedded</span>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Learn something.
            <br />
            Ship something.
            <br />
            <span className="italic text-amber">Loop</span> again.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            LearnLoop is built for people who'd rather build than binge-watch — practical
            courses across five real engineering disciplines, taught by instructors who
            still write code.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/courses" className="btn-primary">
              Browse courses <ArrowRight size={16} />
            </Link>
            <Link to="/teach" className="btn-secondary">
              Teach on LearnLoop
            </Link>
          </div>
        </div>
        <div className="order-first lg:order-last">
          <HeroOrbit />
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="eyebrow">Fresh off the loop</span>
            <h2 className="mt-2 font-display text-2xl font-medium text-ink">Recently added courses</h2>
          </div>
          <Link to="/courses" className="hidden items-center gap-1 text-sm font-medium text-muted hover:text-ink sm:flex">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : courses.length === 0 ? (
          <p className="rounded-xl2 border border-dashed border-hairline bg-surface/50 py-16 text-center text-sm text-muted">
            No courses yet — check back soon, or be the first to <Link to="/teach" className="text-amber underline underline-offset-2">teach one</Link>.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map((course, i) => (
              <CourseCard key={course._id} course={course} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Instructor CTA */}
      <section className="border-t border-hairline bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl2 border border-hairline bg-gradient-to-br from-surface to-surface2 p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <span className="eyebrow text-amber-soft">For instructors</span>
              <h2 className="mt-2 max-w-md font-display text-2xl font-medium text-ink">
                Turn what you know into a course you can point people to.
              </h2>
            </div>
            <Link to="/teach" className="btn-primary shrink-0">
              Start teaching <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
