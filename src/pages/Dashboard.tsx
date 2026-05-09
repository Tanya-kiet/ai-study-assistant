import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'

export default function Dashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      navigate('/login')
    }
  }, [navigate])

  const STATS = [
    { label: 'Quizzes Attempted', value: '12' },
    { label: 'Notes Created', value: '8' },
    { label: 'Average Score', value: '78%' },
    { label: 'Study Time', value: '5 hrs' },
  ]

  const QUICK_ACTIONS = [
    { title: 'Start Quiz', path: '/quiz' as const, icon: '⚡' },
    { title: 'Open Chat', path: '/chat' as const, icon: '💬' },
    { title: 'Add Notes', path: '/notes' as const, icon: '📄' },
  ]

  const RECENT_ACTIVITY = [
    'Completed DSA Quiz – Score: 82%',
    'Added OS Notes',
    'Asked question in Chat',
  ]

  return (
    <PageLayout>
      <div className="px-6 py-10 md:px-10 md:py-14 max-w-5xl mx-auto flex flex-col gap-6 md:gap-10">

        {/* 1. HEADER */}
        <header className="flex flex-col">
          <div className="flex items-center gap-4 mb-6 px-4 md:px-8">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 transition hover:bg-white/10 active:scale-95 text-white"
              title="Go to Home"
            >
              ←
            </button>
            <h1 className="text-xl md:text-2xl font-semibold text-white">
              Dashboard
            </h1>
          </div>
          <div className="h-[1px] w-full bg-white/10 mb-6 shrink-0"></div>

          <h2 className="text-2xl font-semibold tracking-tight text-[hsl(var(--foreground))] md:text-4xl mt-2 mb-2">
            Welcome back 👋
          </h2>
          <p className="text-[hsl(var(--hero-sub))] opacity-80 text-base md:text-lg mb-6 md:mb-10">
            Track your study progress
          </p>
        </header>

        {/* 2. STATS CARDS (GRID) */}
        <section aria-label="Stats">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {STATS.map(({ label, value }) => (
              <div
                key={label}
                className="liquid-glass rounded-xl p-6 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-xl"
              >
                <p className="text-sm font-medium text-white/50">{label}</p>
                <p className="mt-2 font-general-sans text-3xl font-semibold text-[hsl(var(--foreground))]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. QUICK ACTIONS */}
        <section aria-label="Quick Actions">
          <h2 className="mb-5 font-general-sans text-xl font-semibold text-[hsl(var(--foreground))]">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {QUICK_ACTIONS.map(({ title, path, icon }) => (
              <button
                key={title}
                type="button"
                onClick={() => navigate(path)}
                className="liquid-glass flex flex-row items-center gap-4 rounded-xl p-5 text-left transition-all duration-200 ease-in-out hover:scale-105 hover:bg-white/10 active:scale-95"
              >
                <span className="text-2xl" aria-hidden>{icon}</span>
                <span className="font-general-sans text-lg font-medium text-[hsl(var(--foreground))]">
                  {title}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. RECENT ACTIVITY */}
        <section aria-label="Recent Activity">
          <h2 className="mb-5 font-general-sans text-xl font-semibold text-[hsl(var(--foreground))]">
            Recent Activity
          </h2>
          <ul className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-6">
            {RECENT_ACTIVITY.map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-sm md:text-base text-[hsl(var(--foreground))]/80">
                <span className="h-2 w-2 rounded-full bg-indigo-400/80 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </section>

      </div>
    </PageLayout>
  )
}
