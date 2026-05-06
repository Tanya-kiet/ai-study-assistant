import type { KeyboardEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { askAI } from '../services/ai'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}


export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const aiReply = await askAI(trimmed)

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: aiReply,
    }
    setMessages((prev) => [...prev, assistantMsg])
    setLoading(false)
  }, [input, loading])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <PageLayout>
      <div className="mx-auto flex max-w-5xl flex-col px-6 pb-[max(env(safe-area-inset-bottom),1rem)] pt-6 md:px-10 md:pt-10">
        <div className="flex items-center gap-4 mb-6 shrink-0 px-4 md:px-8">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1)
              } else {
                navigate("/")
              }
            }}
            className="rounded-full p-2 transition hover:bg-white/10 active:scale-95 text-white"
            title="Go to Home"
          >
            ←
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-white">
            Chat demo
          </h1>
        </div>
        <div className="h-[1px] w-full bg-white/10 mb-6 shrink-0"></div>

        <div className="mt-4 flex max-h-[min(68svh,720px)] min-h-[min(52svh,420px)] flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-black/25 backdrop-blur-sm md:mt-6 md:max-h-none md:h-[calc(100svh-168px)]">
          <div
            ref={listRef}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-3 py-4 md:gap-4 md:px-5 md:py-5"
          >
            {messages.length === 0 && !loading ? (
              <div className="mx-auto mt-6 max-w-xs text-center text-sm leading-relaxed text-[hsl(var(--hero-sub))] opacity-75">
                Try{' '}
                <span className="text-white/55">FCFS</span>,{' '}
                <span className="text-white/55">Round Robin</span>,{' '}
                <span className="text-white/55">normalization</span>,{' '}
                <span className="text-white/55">SQL</span>, or broader topics like{' '}
                <span className="text-white/55">DBMS</span> / <span className="text-white/55">OS</span> /{' '}
                <span className="text-white/55">DSA</span> — keyword order picks specific answers first (demo mode).
              </div>
            ) : null}

            {messages.map((m) =>
              m.role === 'assistant' ? (
                <article
                  key={m.id}
                  className="mr-auto flex max-w-[min(100%,32rem)] flex-col items-start animate-[fadeInUp_0.4s_ease-out_forwards]"
                >
                  <span className="mb-1 text-[11px] font-medium uppercase tracking-wider text-purple-300/65">
                    Assistant
                  </span>
                  <div className="rounded-2xl rounded-tl-md border border-white/[0.1] bg-gradient-to-br from-white/[0.09] to-white/[0.03] px-4 py-3 text-left shadow-sm">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-[hsl(var(--foreground))]/95">
                      {m.content}
                    </p>
                  </div>
                </article>
              ) : (
                <article key={m.id} className="ml-auto flex max-w-[min(100%,26rem)] flex-col items-end animate-[fadeInUp_0.4s_ease-out_forwards]">
                  <span className="mb-1 text-[11px] font-medium uppercase tracking-wider text-indigo-200/65">
                    You
                  </span>
                  <div className="rounded-2xl rounded-tr-md bg-gradient-to-bl from-indigo-500/40 to-indigo-600/25 px-4 py-3 text-right shadow-inner ring-1 ring-indigo-400/35">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-[hsl(var(--foreground))]">
                      {m.content}
                    </p>
                  </div>
                </article>
              ),
            )}

            {loading ? (
              <div className="mr-auto flex max-w-[min(100%,32rem)] flex-col items-start">
                <span className="mb-1 text-[11px] font-medium uppercase tracking-wider text-purple-300/50">
                  Assistant
                </span>
                <div className="rounded-2xl rounded-tl-md border border-white/[0.08] bg-white/[0.06] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-2 animate-pulse rounded-full bg-purple-400/80" aria-hidden />
                    <p className="text-sm italic text-white/55">AI is thinking...</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="shrink-0 border-t border-white/[0.06] bg-[hsl(260_87%_3%)]/80 p-3 backdrop-blur-md md:p-4">
            <div className="flex flex-wrap items-end gap-2 md:gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                disabled={loading}
                placeholder="Ask about OS, DBMS, algorithms..."
                aria-label="Message"
                className="liquid-glass min-h-[48px] min-w-0 flex-1 resize-none rounded-xl border-none bg-transparent px-4 py-3 text-[hsl(var(--foreground))] outline-none placeholder:text-white/35 focus-visible:ring-2 focus-visible:ring-white/20 disabled:opacity-50"
              />
              <button
                type="button"
                disabled={loading || !input.trim()}
                onClick={() => sendMessage()}
                className="liquid-glass min-h-[48px] shrink-0 rounded-full px-7 py-3 text-base font-medium text-[hsl(var(--foreground))] transition hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
