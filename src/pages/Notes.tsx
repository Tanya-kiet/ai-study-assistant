import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'

export default function Notes() {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [savedNotes, setSavedNotes] = useState<string[]>([])

  const handleSaveNote = () => {
    if (!inputText.trim()) return
    setSavedNotes((prev) => [inputText, ...prev])
    setInputText('')
    setSummary('')
  }

  const handleSummarize = () => {
    if (!inputText.trim()) return

    setLoading(true)
    setSummary('')

    setTimeout(() => {
      // Fake smart summary: take first 2-3 lines of input
      const lines = inputText.split('\n').filter((line) => line.trim() !== '')
      const shortVersion = lines.slice(0, 3).join(' ')

      setSummary(shortVersion ? `Summary: ${shortVersion}...` : 'No text to summarize.')
      setLoading(false)
    }, 1000)
  }

  return (
    <PageLayout>
      <div className="px-6 py-10 md:px-10 md:py-14 max-w-5xl mx-auto flex flex-col gap-6 md:gap-10">

        {/* Header section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-6 px-4 md:px-8">
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
              Notes
            </h1>
          </div>
          <div className="h-[1px] w-full bg-white/10 mb-6 shrink-0"></div>

          <p className="text-base md:text-lg text-[hsl(var(--hero-sub))] max-w-2xl font-light mt-2">
            Paste your long study notes, lectures, or paragraphs and let AI condense them into the key takeaways instantly.
          </p>
        </div>

        {/* Main UI */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-stretch w-full mt-6 md:mt-10">

          {/* Input Section */}
          <div className="liquid-glass rounded-3xl p-5 md:p-6 flex-1 flex flex-col gap-5 shadow-2xl">
            <h2 className="text-xl font-medium text-white/90">Input Notes</h2>
            <textarea
              className="w-full flex-1 min-h-[300px] p-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all duration-300 shadow-inner"
              placeholder="Paste your notes here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <button
              onClick={handleSummarize}
              disabled={loading || !inputText.trim()}
              className="mt-2 w-full py-4 rounded-2xl font-medium text-white text-lg transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-105 hover:bg-white/10 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Summarizing...
                </span>
              ) : (
                'Summarize Notes'
              )}
            </button>
            <button
              onClick={handleSaveNote}
              disabled={!inputText.trim()}
              className="w-full py-3 rounded-2xl font-medium text-indigo-300 text-lg transition-all duration-300 ease-out transform hover:bg-white/10 active:scale-[0.98] border border-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-105 hover:bg-white/10 active:scale-95"
            >
              Save Note
            </button>
          </div>

          {/* Output Section */}
          <div className="liquid-glass rounded-3xl p-5 md:p-6 flex-1 flex flex-col gap-5 shadow-2xl relative overflow-hidden group">
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 blur-[100px] pointer-events-none transition-opacity duration-1000" style={{ opacity: summary ? 1 : 0.3 }} />

            <h2 className="text-xl font-medium text-white/90 z-10 flex items-center gap-2">
              ✨ Summarized Output
            </h2>

            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 z-10 relative overflow-y-auto min-h-[300px] shadow-inner backdrop-blur-sm">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-white/60 gap-5">
                  <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-indigo-400 animate-spin" />
                  <p className="text-lg font-medium animate-pulse">Analyzing your notes...</p>
                </div>
              ) : summary ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                    {summary}
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/30 text-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" x2="8" y1="13" y2="13" />
                    <line x1="16" x2="8" y1="17" y2="17" />
                    <line x1="10" x2="8" y1="9" y2="9" />
                  </svg>
                  <p className="max-w-[220px] text-lg">Your summarized notes will appear here.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Saved Notes Section */}
        <div className="mt-6 md:mt-10 flex flex-col gap-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[hsl(var(--foreground))]">Your Notes</h2>
          {savedNotes.length === 0 ? (
            <p className="text-white/40 italic">No saved notes yet. Type something above and click "Save Note".</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedNotes.map((note, idx) => (
                <div key={idx} className="liquid-glass rounded-2xl p-5 md:p-6 border border-white/10 shadow-lg relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
                  <p className="text-white/80 whitespace-pre-wrap text-sm line-clamp-6">{note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
