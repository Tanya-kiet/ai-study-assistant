import { Download, Upload } from 'lucide-react'
import type { Note } from '../../services/notes'

interface NotesToolbarProps {
  notes: Note[]
  onImport: (notes: Note[]) => void
}

export function NotesToolbar({ notes, onImport }: NotesToolbarProps) {
  const handleExport = (format: 'json' | 'txt') => {
    if (notes.length === 0) {
      alert("No notes to export.")
      return
    }

    let dataStr = ""
    let mimeType = ""
    let filename = `study_notes_export_${new Date().toISOString().split('T')[0]}`

    if (format === 'json') {
      dataStr = JSON.stringify(notes, null, 2)
      mimeType = "application/json"
      filename += ".json"
    } else {
      dataStr = notes.map(n => `TITLE: ${n.title}\nCREATED: ${new Date(n.createdAt).toLocaleString()}\n\n${n.content}\n\n${'='.repeat(40)}\n\n`).join('')
      mimeType = "text/plain"
      filename += ".txt"
    }

    const blob = new Blob([dataStr], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string) as Note[]
        if (Array.isArray(imported)) {
          // Check if it has correct shape
          if (imported.length > 0 && typeof imported[0].title !== 'undefined') {
            onImport(imported)
            alert(`Successfully imported ${imported.length} notes.`)
          } else {
            alert("Invalid JSON format.")
          }
        }
      } catch (err) {
        alert("Failed to parse JSON file.")
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Reset
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md border-b border-white/10 shrink-0 justify-end md:justify-start overflow-x-auto">
      <button 
        onClick={() => handleExport('json')}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap"
      >
        <Download size={14} /> Export JSON
      </button>
      <button 
        onClick={() => handleExport('txt')}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap"
      >
        <Download size={14} /> Export TXT
      </button>
      
      <div className="w-[1px] h-4 bg-white/10 mx-1 shrink-0" />

      <label className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 rounded-lg text-xs font-medium text-indigo-200 cursor-pointer transition-colors whitespace-nowrap">
        <Upload size={14} /> Import JSON
        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
      </label>
    </div>
  )
}
