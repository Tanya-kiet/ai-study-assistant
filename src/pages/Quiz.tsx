import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateQuiz, type QuizQuestion } from '../services/ai'
import { PageLayout } from '../components/PageLayout'
import { QuizInput, type QuizSources } from '../components/quiz/QuizInput'
import { QuizSettings } from '../components/quiz/QuizSettings'
import { QuizResults } from '../components/quiz/QuizResults'
import { getNotes } from '../services/notes'
import { Sparkles } from 'lucide-react'

export default function Quiz() {
  const navigate = useNavigate()
  
  // New multi-source state
  const [sources, setSources] = useState<QuizSources>({
    topic: '',
    files: [],
    noteIds: []
  })
  
  const [count, setCount] = useState(5)
  const [difficulty, setDifficulty] = useState('Medium')
  const [questionType, setQuestionType] = useState('MCQ')
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showScore, setShowScore] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locked = showScore

  const handleGenerate = useCallback(async () => {
    if (!sources.topic.trim() && sources.files.length === 0 && sources.noteIds.length === 0) {
      alert('Please enter a topic, upload a file, or select a saved note.')
      return
    }

    setLoading(true)
    setError(null)
    setQuestions([])
    setSelectedAnswers({})
    setShowScore(false)
    setScore(0)

    // Build Context from Notes and Files
    let combinedContext = ""
    if (sources.noteIds.length > 0) {
      const allNotes = getNotes()
      const selectedNotes = allNotes.filter(n => sources.noteIds.includes(n.id))
      combinedContext += selectedNotes.map(n => `--- Note: ${n.title} ---\n${n.content}`).join('\n\n')
    }

    if (sources.files.length > 0) {
      combinedContext += '\n\n' + sources.files.map(f => `--- File: ${f.name} ---\n${f.content}`).join('\n\n')
    }

    // Determine fallback topic if none provided but context exists
    let finalTopic = sources.topic.trim()
    if (!finalTopic) {
      if (sources.noteIds.length > 0) finalTopic = "Saved Notes"
      else if (sources.files.length > 0) finalTopic = "Uploaded Files"
      else finalTopic = "General Knowledge"
    }

    try {
      const generated = await generateQuiz(finalTopic, difficulty, count, questionType, combinedContext)
      if (!generated || generated.length === 0) {
        setError("Failed to generate questions. Please try different settings or check your AI connection.")
      } else {
        setQuestions(generated)
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }, [sources, difficulty, count, questionType])

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
      const chosen = selectedAnswers[i] || ''
      if (chosen.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
        correct += 1
      }
    })
    setScore(correct)
    setShowScore(true)
  }, [questions, selectedAnswers])

  const handleReset = useCallback(() => {
    setQuestions([])
    setSelectedAnswers({})
    setShowScore(false)
    setScore(0)
    // Keep settings, maybe clear sources? Let's keep them for quick retry
  }, [])

  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-10 md:py-12">
        <header className="mb-8 md:mb-10 flex flex-col">
          <div className="flex items-center gap-4 mb-6 px-2 md:px-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 transition hover:bg-white/10 active:scale-95 text-white"
              title="Go Back"
            >
              ←
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Smart Quiz Generator
            </h1>
          </div>
          <div className="h-[1px] w-full bg-white/10 mb-6 shrink-0"></div>

          <p className="px-2 md:px-4 mt-2 text-[hsl(var(--hero-sub))] opacity-90 text-lg max-w-3xl">
            Create highly customized quizzes by combining a specific topic, your uploaded files, and your saved notes simultaneously.
          </p>
        </header>

        {questions.length === 0 && !error ? (
          <section className="flex flex-col gap-6 md:px-4 animate-in fade-in slide-in-from-bottom-4">
            <QuizInput 
              sources={sources}
              setSources={setSources}
              loading={loading}
            />

            <QuizSettings 
              count={count}
              setCount={setCount}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              questionType={questionType}
              setQuestionType={setQuestionType}
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => void handleGenerate()}
              className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/40 disabled:pointer-events-none disabled:opacity-50 text-lg flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {loading ? (
                <>
                  <span className="inline-block size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
                  Generating Your Quiz...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Smart Quiz
                </>
              )}
            </button>
          </section>
        ) : null}

        <div className="md:px-4">
          {error && questions.length === 0 ? (
            <div className="mt-8 rounded-xl border border-rose-400/40 bg-rose-500/15 px-6 py-5 text-sm text-rose-100/90 shadow-lg flex flex-col items-center text-center gap-4 animate-in fade-in">
              <p className="text-lg">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/40 rounded-lg transition-colors"
              >
                Try Again
              </button>
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
          ) : null}
        </div>
      </div>
    </PageLayout>
  )
}
