import { useNavigate } from 'react-router-dom'

export function Hero() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center px-6 pb-14 pt-2 text-center md:px-10 md:pb-20 md:pt-4">
      <h1 className="font-general-sans w-full min-w-0 max-w-[100%] hyphens-none break-words text-center text-[48px] leading-tight tracking-[-0.024em] sm:max-w-4xl md:text-[80px] lg:text-[140px] lg:leading-[1.05] xl:max-w-6xl xl:text-[180px]">
        <span className="text-[hsl(var(--foreground))]">Study Smarter with </span>
        <span className="bg-gradient-to-l from-indigo-500 via-purple-500 to-amber-300 bg-clip-text text-transparent">
          AI
        </span>
      </h1>

      <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-[hsl(var(--hero-sub))] opacity-80 md:mt-5 md:text-lg md:leading-8">
        Ask doubts, summarize notes, and generate quizzes instantly with your personal AI study
        assistant
      </p>

      <div className="mt-4 flex w-full max-w-md flex-col items-stretch gap-4 sm:mt-6 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
        <button
          type="button"
          className="liquid-glass w-full shrink-0 rounded-full px-8 py-4 text-base font-medium text-[hsl(var(--foreground))] transition hover:bg-white/5 md:py-5 transition-all duration-200 ease-in-out hover:scale-105 hover:bg-white/10 active:scale-95"
          onClick={() => {
            const loggedIn = !!localStorage.getItem('user')
            if (loggedIn) {
              navigate('/dashboard')
            } else {
              navigate('/signup')
            }
          }}
        >
          Get Started Free
        </button>
        <button
          type="button"
          className="w-full shrink-0 rounded-full border border-white/15 bg-white/[0.03] px-8 py-4 text-base font-medium text-[hsl(var(--foreground))]/90 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.06] md:py-5 sm:w-auto transition-all duration-200 ease-in-out hover:scale-105 hover:bg-white/10 active:scale-95"
          onClick={() => navigate('/chat')}
        >
          Try Demo
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-white/50 sm:mt-4">
        No login required • Free to start • Built for students
      </p>
    </div>
  )
}
