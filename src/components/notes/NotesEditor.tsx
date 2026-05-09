import { useState, useEffect, useRef } from 'react'
import { UploadCloud, CheckCircle2, Clock } from 'lucide-react'
import type { Note } from '../../services/notes'

interface NotesEditorProps {
  note: Note | null
  onUpdateNote: (id: string, content: string) => void
  onFileUpload: (text: string, filename: string) => void
}

export function NotesEditor({ note, onUpdateNote, onFileUpload }: NotesEditorProps) {
  const [content, setContent] = useState(note?.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setContent(note?.content || '')
  }, [note?.id]) // Only reset content when switching notes, not on every render

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setIsSaving(true)

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    
    saveTimeoutRef.current = setTimeout(() => {
      if (note) {
        onUpdateNote(note.id, newContent)
        setIsSaving(false)
      }
    }, 1000) // Auto-save after 1 second of inactivity
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    processFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
    e.target.value = '' // Reset
  }

  const processFile = async (file: File) => {
    // Basic text extraction for now
    if (file.type === 'text/plain') {
      const text = await file.text()
      onFileUpload(text, file.name)
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      // Mock PDF extraction
      onFileUpload(`[Extracted from PDF: ${file.name}]\n\n(This is a mock extraction. True PDF parsing in-browser requires heavy libraries like pdfjs-dist. Imagine your PDF text is here!)`, file.name)
    } else if (file.name.endsWith('.docx')) {
      // Mock DOCX extraction
      onFileUpload(`[Extracted from DOCX: ${file.name}]\n\n(This is a mock extraction. Imagine your document text is here!)`, file.name)
    } else {
      alert('Unsupported file type. Please upload TXT, PDF, or DOCX.')
    }
  }

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-black/10">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <UploadCloud size={40} className="text-white/20" />
        </div>
        <h2 className="text-2xl font-semibold text-white/90 mb-2">Select a note or create a new one</h2>
        <p className="text-white/50 max-w-md">
          You can also drag and drop a TXT, PDF, or DOCX file anywhere here to instantly extract its contents into a new note.
        </p>
      </div>
    )
  }

  return (
    <div 
      className="flex-1 flex flex-col h-full bg-black/10 relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-indigo-500/20 backdrop-blur-sm border-2 border-dashed border-indigo-400 rounded-xl m-4 flex flex-col items-center justify-center">
          <UploadCloud size={64} className="text-indigo-300 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-white">Drop file to extract to a new note</h2>
        </div>
      )}

      {/* Editor Header Info */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 shrink-0 bg-transparent">
        <h1 className="text-2xl font-semibold text-white/90 truncate mr-4">{note.title}</h1>
        <div className="flex items-center gap-4 text-sm text-white/40 shrink-0">
          <span className="flex items-center gap-1.5">
            {isSaving ? (
              <>
                <span className="w-3 h-3 border-2 border-white/20 border-t-indigo-400 rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 size={14} className="text-emerald-400" />
                Saved
              </>
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span>
            {content.trim().split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      </div>

      {/* Editor Textarea */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Start typing your notes here..."
          className="flex-1 w-full h-full bg-transparent border-none resize-none p-8 text-[hsl(var(--foreground))] text-base md:text-lg leading-relaxed focus:outline-none focus:ring-0 custom-scrollbar font-sans"
        />
        
        {/* Hidden File Input for manual upload */}
        <div className="absolute bottom-6 right-8">
           <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full cursor-pointer transition-colors text-sm text-white/70 shadow-lg backdrop-blur-md">
             <UploadCloud size={16} />
             Upload File
             <input type="file" className="hidden" accept=".txt,.pdf,.docx" onChange={handleFileSelect} />
           </label>
        </div>
      </div>
    </div>
  )
}
