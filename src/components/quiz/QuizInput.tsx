import React, { useState, useEffect } from 'react'
import { getNotes, type Note } from '../../services/notes'
import { UploadCloud, CheckCircle2, FileText, Search } from 'lucide-react'

export type QuizSources = {
  topic: string
  files: { name: string; content: string }[]
  noteIds: string[]
}

type QuizInputProps = {
  sources: QuizSources
  setSources: React.Dispatch<React.SetStateAction<QuizSources>>
  loading: boolean
}

export function QuizInput({ sources, setSources, loading }: QuizInputProps) {
  const [savedNotes, setSavedNotes] = useState<Note[]>([])
  const [searchNotes, setSearchNotes] = useState('')

  useEffect(() => {
    setSavedNotes(getNotes())
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList) return

    const newFiles = []
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      if (file.type === 'text/plain') {
        const content = await file.text()
        newFiles.push({ name: file.name, content })
      } else {
        newFiles.push({ name: file.name, content: `[Mock Extracted Content for ${file.name}]` })
      }
    }

    setSources(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }))
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setSources(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const toggleNote = (id: string) => {
    setSources(prev => {
      if (prev.noteIds.includes(id)) {
        return { ...prev, noteIds: prev.noteIds.filter(nid => nid !== id) }
      }
      return { ...prev, noteIds: [...prev.noteIds, id] }
    })
  }

  const filteredNotes = savedNotes.filter(n => n.title.toLowerCase().includes(searchNotes.toLowerCase()))

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Source 1: Topic */}
        <div className="liquid-glass rounded-2xl p-6 border border-white/[0.08] flex flex-col h-full relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
          <h3 className="text-lg font-semibold text-white mb-4">1. Specific Topic</h3>
          <input
            type="text"
            value={sources.topic}
            onChange={(e) => setSources(prev => ({ ...prev, topic: e.target.value }))}
            placeholder="e.g. Database Normalization, OSI Model..."
            disabled={loading}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
          />
        </div>

        {/* Source 2: Upload Files */}
        <div className="liquid-glass rounded-2xl p-6 border border-white/[0.08] flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50" />
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
            <span>2. Upload Material</span>
            <span className="text-xs font-normal text-white/50 bg-white/5 px-2 py-1 rounded-md">PDF/TXT/DOCX</span>
          </h3>
          
          <label className="flex-1 min-h-[60px] border border-dashed border-white/20 hover:border-purple-400/50 hover:bg-white/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all">
            <UploadCloud size={24} className="text-white/40 mb-2" />
            <span className="text-sm text-white/60">Click to upload files</span>
            <input type="file" multiple accept=".txt,.pdf,.docx" className="hidden" onChange={handleFileSelect} disabled={loading} />
          </label>

          {sources.files.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 max-h-[80px] overflow-y-auto custom-scrollbar">
              {sources.files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs px-2 py-1 rounded-md">
                  <FileText size={12} />
                  <span className="truncate max-w-[100px]">{file.name}</span>
                  <button onClick={() => removeFile(i)} className="hover:text-white ml-1">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Source 3: Saved Notes */}
        <div className="md:col-span-2 liquid-glass rounded-2xl p-6 border border-white/[0.08] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-pink-500/50" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <h3 className="text-lg font-semibold text-white">3. Your Saved Notes</h3>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text" 
                placeholder="Search notes..." 
                value={searchNotes}
                onChange={e => setSearchNotes(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-pink-500/50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
            {savedNotes.length === 0 ? (
              <p className="text-white/40 text-sm col-span-full py-4 text-center">No saved notes found. Create some in the Notes section!</p>
            ) : filteredNotes.length === 0 ? (
              <p className="text-white/40 text-sm col-span-full py-4 text-center">No matching notes.</p>
            ) : (
              filteredNotes.map(note => {
                const isSelected = sources.noteIds.includes(note.id)
                return (
                  <div 
                    key={note.id}
                    onClick={() => !loading && toggleNote(note.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                      ? 'border-pink-500/40 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.15)]' 
                      : 'border-white/10 hover:bg-white/5 hover:border-white/20 bg-black/20'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isSelected ? <CheckCircle2 size={16} className="text-pink-400" /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm font-medium truncate">{note.title}</p>
                      <p className="text-white/40 text-xs truncate mt-1">{note.content.substring(0, 40) || 'Empty note'}...</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
