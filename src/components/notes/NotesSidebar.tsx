import { Plus, Search, Trash2, Edit2, FileText } from 'lucide-react'
import type { Note } from '../../services/notes'
import { useState } from 'react'

interface NotesSidebarProps {
  notes: Note[]
  activeNoteId: string | null
  onSelectNote: (id: string) => void
  onCreateNote: () => void
  onDeleteNote: (id: string) => void
  onRenameNote: (id: string, newTitle: string) => void
}

export function NotesSidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onRenameNote
}: NotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRenameSubmit = (id: string) => {
    if (editTitle.trim()) {
      onRenameNote(id, editTitle.trim())
    }
    setEditingId(null)
  }

  return (
    <div className="w-full md:w-[280px] shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col h-[calc(100svh-64px)] md:h-full transition-all duration-300 z-20 overflow-hidden">
      <div className="p-4 flex flex-col gap-4">
        <button
          onClick={onCreateNote}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 active:scale-95"
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
        {filteredNotes.length === 0 ? (
          <div className="text-center text-white/30 text-sm mt-10 px-4">
            {searchQuery ? 'No notes found' : 'Create your first note to get started'}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                activeNoteId === note.id ? 'bg-indigo-500/20 text-indigo-100' : 'hover:bg-white/5 text-white/70'
              }`}
            >
              {editingId === note.id ? (
                <input
                  autoFocus
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleRenameSubmit(note.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit(note.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  className="bg-black/50 border border-white/20 rounded px-2 py-1 text-sm w-full text-white outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <FileText size={16} className={activeNoteId === note.id ? 'text-indigo-400' : 'text-white/30'} />
                  <span className="truncate text-sm font-medium">{note.title}</span>
                </div>
              )}

              {editingId !== note.id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingId(note.id)
                      setEditTitle(note.title)
                    }}
                    className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteNote(note.id)
                    }}
                    className="p-1.5 rounded-md hover:bg-rose-500/20 text-white/50 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
