import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateQuiz, type QuizQuestion } from '../services/ai'
import { PageLayout } from '../components/PageLayout'
import { QuizInput, type QuizMode } from '../components/quiz/QuizInput'
import { QuizSettings } from '../components/quiz/QuizSettings'
import { QuizResults } from '../components/quiz/QuizResults'

export default function Quiz() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<QuizMode>('topic')
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(5)
  const [difficulty, setDifficulty] = useState('Medium')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showScore, setShowScore] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locked = showScore

  const handleGenerate = useCallback(async () => {
    if (mode === 'topic' && !topic.trim()) {
      alert('Please enter a topic (e.g. DBMS, OS, DSA).')
      return
    }

    setLoading(true)
    setError(null)
    setQuestions([])
    setSelectedAnswers({})
    setShowScore(false)
    setScore(0)

    setScore(0)
      // If mode is upload or notes, we would ideally extract text. 
      // For now, we simulate using the topic or a default string.
      const query = mode === 'topic' ? topic.trim() : `Random Quiz about ${mode === 'upload' ? 'Uploaded Content' : 'Saved Notes'}`
      
      const generated = await generateQuiz(query, difficulty, count)
      setQuestions(generated)
      setLoading(false)
  }, [topic, mode, difficulty, count])

  const selectAnswer = useCallback(
    (qIndex: number, option: string) => {
      if (locked || loading) return
      setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }))
    },
    [locked, loading],
  )

  const handleSubmit = useCallback(() => {
    if (!questions.length) return
    let correct = 0
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) correct += 1
    })
    setScore(correct)
    setShowScore(true)
  }, [questions, selectedAnswers])

  const handleReset = useCallback(() => {
    setQuestions([])
    setSelectedAnswers({})
    setShowScore(false)
    setScore(0)
  }, [])

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-14">
        <header className="mb-8 md:mb-10 flex flex-col">
          <div className="flex items-center gap-4 mb-6 px-2 md:px-4">
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
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Quiz Generator
            </h1>
          </div>
          <div className="h-[1px] w-full bg-white/10 mb-6 shrink-0"></div>

          <p className="px-2 md:px-4 mt-2 text-[hsl(var(--hero-sub))] opacity-90 text-lg">
            Generate smart quizzes from topics, files, or your saved notes.
          </p>
        </header>

        <section className="flex flex-col gap-6 md:px-4">
          <QuizInput 
            mode={mode} 
            setMode={setMode} 
            topic={topic} 
            setTopic={setTopic} 
            loading={loading} 
          />

          <QuizSettings 
            count={count}
            setCount={setCount}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />

          <button
            type="button"
            disabled={loading}
            onClick={() => void handleGenerate()}
            className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/40 disabled:pointer-events-none disabled:opacity-50 text-lg flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <span className="inline-block size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
                Generating Quiz...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Generate Quiz
              </>
            )}
          </button>
        </section>

        <div className="md:px-4">
          {error ? (
            <div className="mt-8 rounded-xl border border-rose-400/40 bg-rose-500/15 px-5 py-4 text-sm text-rose-100/90 shadow-lg shadow-rose-500/10" role="alert">
              {error}
            </div>
          ) : null}

          {questions.length > 0 ? (
            <QuizResults
              questions={questions}
              selectedAnswers={selectedAnswers}
              selectAnswer={selectAnswer}
              showScore={showScore}
              score={score}
              loading={loading}
              handleSubmit={handleSubmit}
              onReset={handleReset}
            />
          ) : !loading && !error ? (
            <div className="mt-12 liquid-glass rounded-2xl p-10 border border-white/5 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl mb-2">
                ✨
              </div>
              <p className="text-[hsl(var(--hero-sub))] text-lg">Start by entering a topic or uploading content</p>
              <p className="text-sm text-white/40 max-w-sm">We'll analyze the material and generate a custom multiple-choice quiz for you.</p>
            </div>
          ) : null}
        </div>
      </div>
    </PageLayout>
  )
}

