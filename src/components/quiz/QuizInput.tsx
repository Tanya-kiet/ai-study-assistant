import React, { useState } from 'react'

export type QuizMode = 'topic' | 'upload' | 'notes'

type QuizInputProps = {
  mode: QuizMode
  setMode: (mode: QuizMode) => void
  topic: string
  setTopic: (topic: string) => void
  loading: boolean
}

const mockNotes = [
  { id: '1', title: 'Operating Systems - Processes' },
  { id: '2', title: 'Data Structures - Trees' },
  { id: '3', title: 'Database Normalization' },
  { id: '4', title: 'Computer Networks - OSI Model' },
]

export function QuizInput({ mode, setMode, topic, setTopic, loading }: QuizInputProps) {
  const [selectedNote, setSelectedNote] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tabs */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {(['topic', 'upload', 'notes'] as const).map((m) => {
          const isActive = mode === m
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 capitalize shrink-0 ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'bg-white/[0.03] text-white/60 border border-transparent hover:bg-white/[0.08] hover:text-white/90'
              }`}
            >
              {m === 'upload' ? 'Upload File' : m === 'notes' ? 'From Notes' : 'Topic'}
            </button>
          )
        })}
      </div>

      {/* Input Area */}
      <div className="liquid-glass rounded-2xl p-6 border border-white/[0.08] min-h-[160px] flex flex-col justify-center">
        {mode === 'topic' && (
          <div className="w-full">
            <label className="flex flex-col gap-3 text-sm font-medium text-[hsl(var(--foreground))]/80">
              Enter a Topic
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic (e.g. DBMS, OS, DSA...)"
                disabled={loading}
                className="liquid-glass w-full rounded-xl border-none bg-transparent px-5 py-4 text-base text-[hsl(var(--foreground))] outline-none placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-indigo-500/50 transition-shadow disabled:opacity-50"
              />
            </label>
          </div>
        )}

        {mode === 'upload' && (
          <div className="border border-dashed border-white/20 rounded-xl p-10 text-center flex flex-col items-center justify-center gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">📁</span>
            </div>
            <p className="text-[hsl(var(--foreground))]/90 font-medium">Drag & drop file or click to upload</p>
            <p className="text-sm text-white/50">PDF, DOCX, TXT supported</p>
            <input type="file" className="hidden" />
          </div>
        )}

        {mode === 'notes' && (
          <div className="w-full">
            <p className="text-sm font-medium text-[hsl(var(--foreground))]/80 mb-3">Select from saved notes</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedNote === note.id
                      ? 'border-indigo-500/40 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <p className="text-[hsl(var(--foreground))]/90 font-medium text-sm truncate">{note.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
