import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthBackButton } from '../components/AuthBackButton'
import { PageLayout } from '../components/PageLayout'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userData = { name, email, password }
    localStorage.setItem('user', JSON.stringify(userData))
    navigate('/dashboard')
  }

  return (
    <PageLayout>
      <div className="relative flex min-h-[calc(100svh-140px)] flex-col px-6 pb-12 pt-4 md:px-10">
        <div className="flex items-center gap-4 mb-6 shrink-0 px-4 md:px-8">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 transition hover:bg-white/10 active:scale-95 text-white"
            title="Go to Home"
          >
            ←
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-white">
            Sign Up
          </h1>
        </div>
        <div className="h-[1px] w-full bg-white/10 mb-6 shrink-0"></div>

        <div className="flex flex-1 flex-col items-center justify-center pb-12 mt-4">
          <div className="liquid-glass w-full max-w-md rounded-2xl p-8">
            <h2 className="text-center font-general-sans text-2xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
              Create your account
            </h2>

            <form className="mt-8 flex flex-col gap-5" onSubmit={handleSignup}>
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium text-[hsl(var(--foreground))]/80">
                Name
                <input
                  required
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="liquid-glass rounded-xl border-none bg-transparent px-4 py-3 text-[hsl(var(--foreground))] outline-none placeholder:text-white/35 focus-visible:ring-2 focus-visible:ring-white/20"
                  placeholder="Your name"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium text-[hsl(var(--foreground))]/80">
                Email
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="liquid-glass rounded-xl border-none bg-transparent px-4 py-3 text-[hsl(var(--foreground))] outline-none placeholder:text-white/35 focus-visible:ring-2 focus-visible:ring-white/20"
                  placeholder="you@school.edu"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium text-[hsl(var(--foreground))]/80">
                Password
                <input
                  required
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="liquid-glass rounded-xl border-none bg-transparent px-4 py-3 text-[hsl(var(--foreground))] outline-none placeholder:text-white/35 focus-visible:ring-2 focus-visible:ring-white/20"
                  placeholder="••••••••"
                />
              </label>
              <button
                type="submit"
                className="liquid-glass mt-2 rounded-full px-6 py-3 text-center text-base font-medium text-[hsl(var(--foreground))] transition hover:bg-white/5 transition-all duration-200 ease-in-out hover:scale-105 hover:bg-white/10 active:scale-95"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
