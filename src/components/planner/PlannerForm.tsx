import React from 'react'

export type PlannerFormData = {
  subjects: string
  studyHours: string
  examDate: string
  preference: string
  difficulty: string
}

type PlannerFormProps = {
  formData: PlannerFormData
  setFormData: React.Dispatch<React.SetStateAction<PlannerFormData>>
}

export function PlannerForm({ formData, setFormData }: PlannerFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="liquid-glass rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 backdrop-blur shadow-2xl">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="text-indigo-400">📝</span> Study Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subjects - Full Width */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]/80 ml-1">
            Subjects or Topics to Cover
          </label>
          <textarea
            name="subjects"
            value={formData.subjects}
            onChange={handleChange}
            placeholder="e.g. Operating Systems, DBMS, Data Structures, Mathematics..."
            rows={3}
            className="liquid-glass w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-[hsl(var(--foreground))] outline-none placeholder:text-white/30 focus:ring-2 focus:ring-indigo-500/50 transition-shadow resize-none"
          />
        </div>

        {/* Study Hours */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]/80 ml-1">
            Study Hours Per Day
          </label>
          <div className="relative">
            <select
              name="studyHours"
              value={formData.studyHours}
              onChange={handleChange}
              className="liquid-glass w-full appearance-none rounded-xl border border-white/10 bg-transparent px-4 py-3 pr-10 text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <option value="2" className="bg-[#0f0a1c] text-white">2 Hours</option>
              <option value="4" className="bg-[#0f0a1c] text-white">4 Hours</option>
              <option value="6" className="bg-[#0f0a1c] text-white">6 Hours</option>
              <option value="8" className="bg-[#0f0a1c] text-white">8+ Hours</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>

        {/* Exam Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]/80 ml-1">
            Exam Date (Target)
          </label>
          <input
            type="date"
            name="examDate"
            value={formData.examDate}
            onChange={handleChange}
            className="liquid-glass w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow [color-scheme:dark]"
          />
        </div>

        {/* Study Preference */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]/80 ml-1">
            Study Preference
          </label>
          <div className="relative">
            <select
              name="preference"
              value={formData.preference}
              onChange={handleChange}
              className="liquid-glass w-full appearance-none rounded-xl border border-white/10 bg-transparent px-4 py-3 pr-10 text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <option value="Morning" className="bg-[#0f0a1c] text-white">Morning Person 🌅</option>
              <option value="Evening" className="bg-[#0f0a1c] text-white">Night Owl 🦉</option>
              <option value="Flexible" className="bg-[#0f0a1c] text-white">Flexible 🕒</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]/80 ml-1">
            Pacing / Difficulty Level
          </label>
          <div className="relative">
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="liquid-glass w-full appearance-none rounded-xl border border-white/10 bg-transparent px-4 py-3 pr-10 text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <option value="Easy" className="bg-[#0f0a1c] text-white">Relaxed (Easy)</option>
              <option value="Medium" className="bg-[#0f0a1c] text-white">Balanced (Medium)</option>
              <option value="Hard" className="bg-[#0f0a1c] text-white">Intense (Hard)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
