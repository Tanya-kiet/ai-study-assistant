import React from 'react'

type QuizSettingsProps = {
  count: number;
  setCount: (val: number) => void;
  difficulty: string;
  setDifficulty: (val: string) => void;
  questionType: string;
  setQuestionType: (val: string) => void;
};

export function QuizSettings({ count, setCount, difficulty, setDifficulty, questionType, setQuestionType }: QuizSettingsProps) {
  return (
    <div className="w-full mt-4">
      <p className="text-sm font-medium text-[hsl(var(--foreground))]/80 mb-3 ml-1">Quiz Settings</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="w-full">
          <label className="sr-only">Number of Questions</label>
          <div className="relative">
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="liquid-glass w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-5 py-3 pr-10 text-sm font-medium text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-white/5 transition-colors backdrop-blur-md"
            >
              <option value="5" className="bg-[#0f0a1c] text-white">5 Questions</option>
              <option value="10" className="bg-[#0f0a1c] text-white">10 Questions</option>
              <option value="15" className="bg-[#0f0a1c] text-white">15 Questions</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>

        <div className="w-full">
          <label className="sr-only">Difficulty</label>
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="liquid-glass w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-5 py-3 pr-10 text-sm font-medium text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-white/5 transition-colors backdrop-blur-md"
            >
              <option value="Easy" className="bg-[#0f0a1c] text-white">Easy Difficulty</option>
              <option value="Medium" className="bg-[#0f0a1c] text-white">Medium Difficulty</option>
              <option value="Hard" className="bg-[#0f0a1c] text-white">Hard Difficulty</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>

        <div className="w-full">
          <label className="sr-only">Question Type</label>
          <div className="relative">
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="liquid-glass w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-5 py-3 pr-10 text-sm font-medium text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-white/5 transition-colors backdrop-blur-md"
            >
              <option value="MCQ" className="bg-[#0f0a1c] text-white">Multiple Choice (MCQ)</option>
              <option value="True/False" className="bg-[#0f0a1c] text-white">True / False</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

