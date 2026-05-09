import { useState, useRef, useEffect } from 'react'
import { Send, X, Bot, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react'
import { askAI } from '../../services/ai'
import type { Note } from '../../services/notes'

interface NotesChatProps {
  note: Note | null
  isOpen: boolean
  onToggle: () => void
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function NotesChat({ note, isOpen, onToggle }: NotesChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset chat when switching notes? Or keep it? Let's reset for context clarity.
    setMessages([])
  }, [note?.id])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const newMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed }
    setMessages(prev => [...prev, newMsg])
    setInput('')
    setLoading(true)

    const context = note ? `Note Title: ${note.title}\n\n${note.content}` : ''
    const reply = await askAI(trimmed, context)

    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: reply }])
    setLoading(false)
  }

  return (
    <div 
      className={`fixed top-0 right-0 h-full bg-black/40 backdrop-blur-2xl border-l border-white/10 z-30 transition-transform duration-300 flex flex-col shadow-2xl ${
        isOpen ? 'translate-x-0 w-[340px] md:w-[400px]' : 'translate-x-full w-[340px] md:w-[400px]'
      }`}
    >
      {/* Toggle Button when open/closed */}
      <button
        onClick={onToggle}
        className={`absolute top-1/2 -translate-y-1/2 bg-white/10 border border-white/20 hover:bg-white/20 p-2 text-white backdrop-blur-md rounded-l-xl transition-all duration-300 z-40 ${
          isOpen ? '-left-10' : '-left-10'
        }`}
      >
        {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium text-lg">AI Assistant</h3>
            <p className="text-white/50 text-xs">Chat with your notes</p>
          </div>
        </div>
        <button onClick={onToggle} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-white/40 space-y-4">
            <Bot size={48} className="opacity-20" />
            <p className="max-w-[200px] text-sm">
              {note 
                ? "Ask me anything about your current note! I'll use it as context." 
                : "Select or create a note first so I can help you understand it."}
            </p>
          </div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <span className="text-[10px] uppercase tracking-wider mb-1 text-white/30 px-1">
                {m.role === 'user' ? 'You' : 'Assistant'}
              </span>
              <div className={`p-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-indigo-500/80 text-white rounded-tr-sm border border-indigo-400/30' 
                  : 'bg-white/10 text-white/90 rounded-tl-sm border border-white/5 backdrop-blur-sm'
              }`}>
                {m.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex flex-col items-start animate-in fade-in">
             <span className="text-[10px] uppercase tracking-wider mb-1 text-white/30 px-1">Assistant</span>
             <div className="p-4 rounded-2xl rounded-tl-sm bg-white/5 border border-white/5 backdrop-blur-sm">
               <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                 <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={note ? "Ask about this note..." : "Open a note first..."}
            disabled={!note || loading}
            rows={1}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none min-h-[48px] max-h-[120px] custom-scrollbar disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!note || loading || !input.trim()}
            className="absolute right-2 bottom-2 p-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl transition-all shadow-md active:scale-95 disabled:active:scale-100"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
