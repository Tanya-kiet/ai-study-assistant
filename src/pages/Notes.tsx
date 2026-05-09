import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { NotesSidebar } from '../components/notes/NotesSidebar'
import { NotesEditor } from '../components/notes/NotesEditor'
import { NotesChat } from '../components/notes/NotesChat'
import { NotesToolbar } from '../components/notes/NotesToolbar'
import { getNotes, createNote, updateNote, deleteNote, saveNotes, type Note } from '../services/notes'

export default function Notes() {
  const navigate = useNavigate()
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const loaded = getNotes()
    setNotes(loaded)
    if (loaded.length > 0 && !activeNoteId) {
      setActiveNoteId(loaded[0].id)
    }
  }, [])

  const handleCreateNote = () => {
    const newNote = createNote('Untitled Note', '')
    setNotes(getNotes())
    setActiveNoteId(newNote.id)
  }

  const handleDeleteNote = (id: string) => {
    deleteNote(id)
    const updated = getNotes()
    setNotes(updated)
    if (activeNoteId === id) {
      setActiveNoteId(updated.length > 0 ? updated[0].id : null)
    }
  }

  const handleUpdateNote = (id: string, content: string) => {
    updateNote(id, { content })
    setNotes(getNotes()) // refresh to update timestamps
  }

  const handleRenameNote = (id: string, newTitle: string) => {
    updateNote(id, { title: newTitle })
    setNotes(getNotes())
  }

  const handleFileUpload = (text: string, filename: string) => {
    const newNote = createNote(`Extracted: ${filename}`, text)
    setNotes(getNotes())
    setActiveNoteId(newNote.id)
  }

  const handleImportNotes = (importedNotes: Note[]) => {
    // Merge or just add them
    const existing = getNotes()
    // give them new IDs just to avoid collisions
    const safeImports = importedNotes.map(n => ({ ...n, id: crypto.randomUUID() }))
    const combined = [...safeImports, ...existing]
    saveNotes(combined)
    setNotes(combined)
  }

  const activeNote = notes.find(n => n.id === activeNoteId) || null

  return (
    <PageLayout>
      {/* We use a full-height, edge-to-edge layout inside the container for the notion-like feel */}
      <div className="flex flex-col h-[calc(100svh-64px)] md:h-[calc(100svh-80px)] mt-4 md:mt-0 mx-4 md:mx-10 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl relative z-10">
        
        {/* Top Header / Nav for mobile / Desktop */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
             <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 transition hover:bg-white/10 active:scale-95 text-white"
              title="Go Back"
            >
              ←
            </button>
            <h1 className="text-xl font-semibold text-white/90">My Notes</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotesToolbar notes={notes} onImport={handleImportNotes} />
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isChatOpen 
                ? 'bg-indigo-500 text-white shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]' 
                : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
              }`}
            >
              <span className="hidden md:inline">Ask AI</span>
              <span className="md:hidden">AI</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <NotesSidebar 
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={setActiveNoteId}
            onCreateNote={handleCreateNote}
            onDeleteNote={handleDeleteNote}
            onRenameNote={handleRenameNote}
          />
          
          <NotesEditor 
            note={activeNote}
            onUpdateNote={handleUpdateNote}
            onFileUpload={handleFileUpload}
          />
          
          <NotesChat 
            note={activeNote}
            isOpen={isChatOpen}
            onToggle={() => setIsChatOpen(!isChatOpen)}
          />
        </div>

      </div>
    </PageLayout>
  )
}
