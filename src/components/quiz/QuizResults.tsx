import React from 'react'
import type { QuizQuestion } from '../../api/openaiQuiz'

type QuizResultsProps = {
  questions: QuizQuestion[]
  selectedAnswers: Record<number, string>
  selectAnswer: (qIndex: number, option: string) => void
  showScore: boolean
  score: number
  loading: boolean
  handleSubmit: () => void
  onReset: () => void
}

export function QuizResults({
  questions,
  selectedAnswers,
  selectAnswer,
  showScore,
  score,
  loading,
  handleSubmit,
  onReset
}: QuizResultsProps) {
  if (questions.length === 0) return null

  const locked = showScore

  return (
    <div className="w-full mt-6">
      <ol className="flex flex-col gap-8 md:gap-10">
        {questions.map((q, qIndex) => (
          <li key={`${q.question}-${qIndex}`} className="liquid-glass rounded-2xl p-6 md:p-8 border border-white/[0.08]">
            <p className="font-general-sans text-lg font-semibold leading-snug text-[hsl(var(--foreground))] md:text-xl mb-6">
              <span className="mr-3 text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg text-sm">{qIndex + 1}</span>
              {q.question}
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {q.options.map((opt) => {
                const chosen = selectedAnswers[qIndex]
                const pickedHere = chosen === opt
                
                const base = 'liquid-glass w-full rounded-xl border px-5 py-4 text-left text-sm font-medium transition-all duration-200 motion-safe:active:scale-[0.995] disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-between'
                const idle = 'border-white/10 hover:border-white/30 hover:bg-white/[0.06]'
                const loadingDim = loading ? 'pointer-events-none border-white/[0.06] opacity-50' : ''
                
                const selectedIdle = pickedHere && !locked && !loading
                  ? 'border-indigo-400/55 bg-indigo-500/20 ring-1 ring-indigo-400/45 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : ''

                let afterSubmit = ''
                if (locked) {
                  if (opt === q.answer) {
                    afterSubmit = 'pointer-events-none border-emerald-400/55 bg-emerald-500/20 ring-1 ring-emerald-400/40 text-emerald-100'
                  } else if (pickedHere) {
                    afterSubmit = 'pointer-events-none border-rose-400/55 bg-rose-500/15 ring-1 ring-rose-400/40 text-rose-100'
                  } else {
                    afterSubmit = 'pointer-events-none border-white/[0.08] opacity-50'
                  }
                }

                const combo = locked ? `${idle} ${afterSubmit}` : loading ? `${idle} ${loadingDim}` : `${idle} ${selectedIdle}`

                return (
                  <li key={opt}>
                    <button
                      type="button"
                      disabled={locked || loading}
                      onClick={() => selectAnswer(qIndex, opt)}
                      className={`${base} ${combo}`}
                    >
                      <span>{opt}</span>
                      {locked && opt === q.answer && (
                        <span className="text-emerald-400 bg-emerald-400/10 rounded-full p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </span>
                      )}
                      {locked && pickedHere && opt !== q.answer && (
                        <span className="text-rose-400 bg-rose-400/10 rounded-full p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ol>

      {!showScore ? (
        <div className="mt-10">
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 disabled:opacity-50 sm:w-auto"
          >
            Submit Answers
          </button>
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-indigo-400/35 bg-indigo-500/10 px-8 py-8 text-center shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl"></div>
          
          <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-2">Quiz Completed</h3>
          <p className="font-general-sans text-4xl md:text-5xl font-bold text-white mb-4">
            {score} <span className="text-2xl text-white/50 font-medium">/ {questions.length}</span>
          </p>
          <p className="text-base text-white/70 max-w-md mx-auto mb-8">
            Great job! You can generate a new quiz to keep practicing or change your topic.
          </p>
          
          <button
            onClick={onReset}
            className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3 text-sm font-medium text-white transition-all duration-200"
          >
            Create New Quiz
          </button>
        </div>
      )}
    </div>
  )
}
