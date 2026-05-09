import type { KeyboardEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { askAI } from '../services/ai'
import { Bot, Send, Sparkles, Paperclip, MessageSquare, Code, BookOpen, Calculator } from 'lucide-react'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  { icon: <Code size={16} />, text: "Explain OS scheduling" },
  { icon: <BookOpen size={16} />, text: "Summarize my DBMS notes" },
  { icon: <MessageSquare size={16} />, text: "Create a quiz on normalization" },
  { icon: <Calculator size={16} />, text: "Explain FCFS algorithm" },
]

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  const sendMessage = useCallback(async (overrideText?: string) => {
    const textToSend = overrideText || input.trim()
    if (!textToSend || loading) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
    }

    setMessages((prev) => [...prev, userMsg])
    if (!overrideText) setInput('')
    setLoading(true)

    const aiReply = await askAI(textToSend)

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: aiReply,
    }
    setMessages((prev) => [...prev, assistantMsg])
    setLoading(false)
  }, [input, loading])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleFileSelect = () => {
    // Mock file upload interaction for the premium UI
    alert("File analysis context is coming soon. Use the Notes section to extract text for now!")
  }

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100svh-64px)] md:h-[calc(100svh-80px)] mt-4 md:mt-0 mx-4 md:mx-10 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl relative z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl shrink-0 relative z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 transition hover:bg-white/10 active:scale-95 text-white"
              title="Go Back"
            >
              ←
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white/90">AI Study Assistant</h1>
              <p className="text-xs text-white/50 hidden md:block">Ask anything about your subjects, notes, quizzes, or uploaded files.</p>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 custom-scrollbar relative z-10"
        >
          {messages.length === 0 && !loading ? (
            <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto text-center mt-[-40px]">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                <Bot size={40} className="text-indigo-300 relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">How can I help you study?</h2>
              <p className="text-white/50 text-base mb-10 max-w-md">
                I can explain complex concepts, summarize your long notes, or generate quick quizzes to test your knowledge.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt.text)}
                    className="liquid-glass flex items-center gap-3 p-4 rounded-xl border border-white/5 text-left text-sm text-white/80 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 group"
                  >
                    <span className="p-2 rounded-lg bg-white/5 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                      {prompt.icon}
                    </span>
                    <span className="font-medium">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mr-3 mt-1 shadow-sm">
                    <Sparkles size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] md:max-w-[75%] p-4 text-sm md:text-base leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl rounded-tr-sm shadow-md'
                      : 'bg-white/5 border border-white/10 text-white/90 rounded-2xl rounded-tl-sm backdrop-blur-md shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex w-full justify-start animate-in fade-in duration-300">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mr-3 mt-1 shadow-sm">
                 <Sparkles size={14} className="text-white" />
               </div>
               <div className="p-4 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 backdrop-blur-md flex items-center h-[52px]">
                 <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                   <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-black/40 backdrop-blur-xl border-t border-white/10 relative z-20 shrink-0">
          
          {/* Suggested Prompts (if chat has started) */}
          {messages.length > 0 && !loading && (
             <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
               {SUGGESTED_PROMPTS.map((prompt, i) => (
                 <button
                   key={i}
                   onClick={() => setInput(prompt.text)}
                   className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white/70 hover:text-white transition-colors"
                 >
                   {prompt.text}
                 </button>
               ))}
             </div>
          )}

          <div className="relative max-w-4xl mx-auto flex items-end gap-2 group">
            {/* Ambient focus glow */}
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative flex-1 liquid-glass rounded-2xl border border-white/10 flex items-end p-2 bg-black/20 focus-within:border-indigo-500/50 transition-colors">
              <button
                type="button"
                onClick={handleFileSelect}
                className="p-3 text-white/40 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                title="Attach file (mock)"
              >
                <Paperclip size={20} />
              </button>
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Message AI Study Assistant..."
                rows={1}
                className="w-full bg-transparent border-none text-white placeholder:text-white/30 resize-none px-3 py-3 max-h-[150px] focus:outline-none custom-scrollbar"
                style={{ minHeight: '48px' }}
              />
            </div>

            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="p-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/5 disabled:text-white/30 disabled:border disabled:border-white/5 text-white transition-all duration-300 shadow-lg shrink-0 flex items-center justify-center"
            >
              <Send size={20} className={input.trim() && !loading ? 'translate-x-0.5 -translate-y-0.5 transition-transform' : ''} />
            </button>
          </div>
          
          <div className="text-center mt-3 text-[10px] text-white/30">
            AI can make mistakes. Always verify important study facts.
          </div>
        </div>

      </div>
    </PageLayout>
  )
}
