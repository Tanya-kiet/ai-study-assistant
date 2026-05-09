import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim()) return

    // Simulate sending email
    setSubmitted(true)
  }

  return (
    <PageLayout>
      <div className="relative flex min-h-[calc(100svh-140px)] flex-col px-6 pb-12 pt-4 md:px-10">
        <div className="flex items-center gap-4 mb-6 shrink-0 px-4 md:px-8">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 transition hover:bg-white/10 active:scale-95 text-white"
            title="Go Back"
          >
            ←
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-white">
            Reset Password
          </h1>
        </div>
        <div className="h-[1px] w-full bg-white/10 mb-6 shrink-0"></div>

        <div className="flex flex-1 flex-col items-center justify-center pb-12 mt-4 animate-in fade-in zoom-in-95 duration-500">
          <div className="liquid-glass w-full max-w-md rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            {submitted ? (
              <div className="flex flex-col items-center text-center gap-4 py-8 relative z-10 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-2xl font-semibold text-white">Check your email</h2>
                <p className="text-white/60">
                  We've sent a password reset link to <br/><span className="text-white font-medium">{email}</span>
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-6 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <div className="relative z-10">
                <h2 className="text-center font-general-sans text-2xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
                  Forgot Password?
                </h2>
                <p className="text-center text-white/50 text-sm mt-2">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
                  <label className="flex flex-col gap-1.5 text-left text-sm font-medium text-[hsl(var(--foreground))]/80">
                    Email Address
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="liquid-glass rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-[hsl(var(--foreground))] outline-none placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-transparent transition-all shadow-inner"
                      placeholder="you@school.edu"
                    />
                  </label>
                  
                  <button
                    type="submit"
                    className="liquid-glass mt-2 rounded-full px-6 py-3.5 text-center text-base font-medium text-white transition hover:bg-white/5 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] active:scale-95 bg-gradient-to-r from-indigo-500/80 to-purple-500/80 border-none"
                  >
                    Send Reset Link
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
