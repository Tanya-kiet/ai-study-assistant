import React from 'react'
import type { QuizQuestion } from '../../services/ai'

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
        {questions.map((q, qIndex) => {
          const isShortAnswer = !q.options || q.options.length === 0
          const chosen = selectedAnswers[qIndex] || ''
          const isCorrect = locked && chosen.toLowerCase().trim() === q.answer.toLowerCase().trim()

          return (
            <li key={`${q.question}-${qIndex}`} className="liquid-glass rounded-2xl p-6 md:p-8 border border-white/[0.08] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
              <p className="font-general-sans text-lg font-semibold leading-snug text-[hsl(var(--foreground))] md:text-xl mb-6">
                <span className="mr-3 text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg text-sm">{qIndex + 1}</span>
                {q.question}
              </p>
              
              {isShortAnswer ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={chosen}
                    onChange={(e) => selectAnswer(qIndex, e.target.value)}
                    disabled={locked || loading}
                    placeholder="Type your answer here..."
                    className={`w-full bg-black/20 border rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none transition-all ${
                      locked 
                        ? isCorrect ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100' : 'border-rose-500/50 bg-rose-500/10 text-rose-100'
                        : 'border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20'
                    } disabled:opacity-80`}
                  />
                  {locked && !isCorrect && (
                    <div className="text-sm text-rose-300 mt-1">
                      <span className="font-medium text-emerald-400">Correct Answer:</span> {q.answer}
                    </div>
                  )}
                </div>
              ) : (
                <ul className={`grid grid-cols-1 gap-3 ${q.options!.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
                  {q.options!.map((opt) => {
                    const pickedHere = chosen === opt
                    
                    const base = 'liquid-glass w-full rounded-xl border px-5 py-4 text-left text-sm font-medium transition-all duration-200 flex items-center justify-between'
                    const idle = 'border-white/10 hover:border-white/30 hover:bg-white/[0.06] active:scale-[0.995]'
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

                    const combo = locked ? `${base} ${afterSubmit}` : loading ? `${base} ${idle} ${loadingDim}` : `${base} ${idle} ${selectedIdle}`

                    return (
                      <li key={opt}>
                        <button
                          type="button"
                          disabled={locked || loading}
                          onClick={() => selectAnswer(qIndex, opt)}
                          className={combo}
                        >
                          <span>{opt}</span>
                          {locked && opt === q.answer && (
                            <span className="text-emerald-400 bg-emerald-400/10 rounded-full p-1 animate-in zoom-in">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </span>
                          )}
                          {locked && pickedHere && opt !== q.answer && (
                            <span className="text-rose-400 bg-rose-400/10 rounded-full p-1 animate-in zoom-in">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </span>
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}

              {/* Explanation block if available */}
              {locked && q.explanation && (
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 animate-in fade-in slide-in-from-top-2">
                  <span className="font-semibold text-indigo-300">Explanation:</span> {q.explanation}
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {!showScore ? (
        <div className="mt-10">
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 disabled:opacity-50 sm:w-auto flex items-center justify-center gap-2 mx-auto"
          >
            Submit Answers
          </button>
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-indigo-400/35 bg-indigo-500/10 px-8 py-8 text-center shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl"></div>
          
          <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-2 relative z-10">Quiz Completed</h3>
          <p className="font-general-sans text-5xl md:text-6xl font-bold text-white mb-4 relative z-10">
            {score} <span className="text-2xl text-white/50 font-medium">/ {questions.length}</span>
          </p>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto h-3 bg-black/40 rounded-full overflow-hidden mb-8 relative z-10 border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
              style={{ width: `${(score / questions.length) * 100}%` }}
            />
          </div>

          <p className="text-base text-white/70 max-w-md mx-auto mb-8 relative z-10">
            {score === questions.length ? 'Perfect score! Outstanding work!' : 'Great job! Review the explanations above to learn from your mistakes.'}
          </p>
          
          <button
            onClick={onReset}
            className="relative z-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3 text-sm font-medium text-white transition-all duration-200 shadow-lg backdrop-blur-sm"
          >
            Create New Quiz
          </button>
        </div>
      )}
    </div>
  )
}
