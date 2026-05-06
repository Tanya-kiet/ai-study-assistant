import { useNavigate } from 'react-router-dom'

export function AuthBackButton() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate('/')}
      className="rounded-full px-3 py-2 text-sm font-medium text-[hsl(var(--foreground))]/85 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
    >
      ← Back
    </button>
  )
}
