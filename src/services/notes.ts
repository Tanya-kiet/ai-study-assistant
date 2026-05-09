export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'ai_study_assistant_notes'

export function getNotes(): Note[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data) as Note[]
  } catch (error) {
    console.error('Failed to parse notes from localStorage', error)
    return []
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (error) {
    console.error('Failed to save notes to localStorage', error)
  }
}

export function createNote(title: string = 'Untitled Note', content: string = ''): Note {
  const notes = getNotes()
  const newNote: Note = {
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  saveNotes([newNote, ...notes])
  return newNote
}

export function updateNote(id: string, updates: Partial<Pick<Note, 'title' | 'content'>>): Note | null {
  const notes = getNotes()
  const noteIndex = notes.findIndex(n => n.id === id)
  
  if (noteIndex === -1) return null

  const updatedNote = {
    ...notes[noteIndex],
    ...updates,
    updatedAt: Date.now()
  }

  notes[noteIndex] = updatedNote
  saveNotes(notes)
  
  return updatedNote
}

export function deleteNote(id: string): void {
  const notes = getNotes()
  saveNotes(notes.filter(n => n.id !== id))
}
