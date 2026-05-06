import React, { useState } from 'react'

export type DaySchedule = {
  id: string
  day: string
  tasks: string[]
}

type ScheduleOutputProps = {
  initialSchedule: DaySchedule[]
  onReset: () => void
}

export function ScheduleOutput({ initialSchedule, onReset }: ScheduleOutputProps) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule)
  const [copied, setCopied] = useState(false)

  const handleTaskChange = (dayId: string, taskIndex: number, newValue: string) => {
    setSchedule((prev) =>
      prev.map((dayObj) => {
        if (dayObj.id === dayId) {
          const newTasks = [...dayObj.tasks]
          newTasks[taskIndex] = newValue
          return { ...dayObj, tasks: newTasks }
        }
        return dayObj
      })
    )
  }

  const copyToClipboard = () => {
    const textToCopy = schedule
      .map((d) => `${d.day}:\n${d.tasks.map((t) => `- ${t}`).join('\n')}`)
      .join('\n\n')

    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full animate-fadeInUp">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Optimized Schedule</h2>
          <p className="text-white/50 text-sm mt-1">Feel free to click and edit any slot directly.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={copyToClipboard}
            className="flex-1 sm:flex-none liquid-glass px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                Copy Plan
              </>
            )}
          </button>
          
          <button
            onClick={onReset}
            className="flex-1 sm:flex-none liquid-glass px-4 py-2 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 border-rose-500/20 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {schedule.map((dayObj) => (
          <div key={dayObj.id} className="liquid-glass p-5 md:p-6 rounded-2xl border border-white/[0.08] hover:border-indigo-500/30 transition-colors group">
            <h3 className="text-lg font-semibold text-indigo-300 mb-4">{dayObj.day}</h3>
            <ul className="flex flex-col gap-3">
              {dayObj.tasks.map((task, idx) => (
                <li key={idx} className="flex items-start gap-3 relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 mt-2 shrink-0"></div>
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => handleTaskChange(dayObj.id, idx, e.target.value)}
                    className="w-full bg-transparent text-[hsl(var(--foreground))]/90 outline-none hover:bg-white/5 focus:bg-white/10 px-2 py-1 -ml-2 rounded transition-colors text-sm md:text-base border border-transparent focus:border-white/20"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
