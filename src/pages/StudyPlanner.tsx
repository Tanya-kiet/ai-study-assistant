import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { StepIndicator } from '../components/planner/StepIndicator'
import { PlannerForm, type PlannerFormData } from '../components/planner/PlannerForm'
import { ScheduleOutput, type DaySchedule } from '../components/planner/ScheduleOutput'

export default function StudyPlanner() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<PlannerFormData>({
    subjects: '',
    studyHours: '4',
    examDate: '',
    preference: 'Flexible',
    difficulty: 'Medium',
  })
  
  const [schedule, setSchedule] = useState<DaySchedule[]>([])

  const handleGenerate = () => {
    if (!formData.subjects.trim()) {
      alert('Please enter at least one subject.')
      return
    }

    setCurrentStep(2)

    // Simulate AI generation delay
    setTimeout(() => {
      // Mock generated schedule based on inputs
      const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(s => s)
      const hours = parseInt(formData.studyHours, 10)
      
      const mockSchedule: DaySchedule[] = [
        {
          id: 'day-1',
          day: 'Day 1',
          tasks: [
            `${subjectsArray[0] || 'Core Subject'} (${Math.ceil(hours / 2)} hrs)`,
            `${subjectsArray[1] || 'Secondary Subject'} (${Math.floor(hours / 2)} hrs)`,
            'Review & Notes (30 mins)'
          ]
        },
        {
          id: 'day-2',
          day: 'Day 2',
          tasks: [
            `${subjectsArray[1] || 'Secondary Subject'} (${Math.ceil(hours / 2)} hrs)`,
            'Practice Problems (1 hr)',
            `${subjectsArray[2] || 'Elective / Review'} (${Math.max(1, Math.floor(hours / 2) - 1)} hrs)`
          ]
        },
        {
          id: 'day-3',
          day: 'Day 3',
          tasks: [
            'Mock Test / Deep Dive (2 hrs)',
            `${subjectsArray[0] || 'Core Subject'} Revision (1 hr)`,
            'Relax & Recharge'
          ]
        }
      ]

      setSchedule(mockSchedule)
      setCurrentStep(3)
    }, 2500) // 2.5 second delay to show the loading step
  }

  const handleReset = () => {
    setCurrentStep(1)
    setSchedule([])
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-14">
        {/* Header */}
        <header className="mb-12 flex flex-col items-center text-center">
          <div className="w-full flex justify-start mb-6">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 transition hover:bg-white/10 active:scale-95 text-white"
              title="Go to Home"
            >
              ← Back
            </button>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            Create Your AI Study Schedule
          </h1>
          <p className="text-lg md:text-xl text-[hsl(var(--hero-sub))] opacity-90 max-w-2xl mx-auto">
            Plan smarter, not harder. Generate a personalized study schedule based on your subjects, time, and goals.
          </p>
        </header>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Main Content Area */}
        <div className="w-full flex flex-col items-center">
          {currentStep === 1 && (
            <div className="w-full max-w-3xl animate-fadeInUp">
              <PlannerForm formData={formData} setFormData={setFormData} />
              
              <button
                onClick={handleGenerate}
                className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-lg shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Generate Study Plan
              </button>
              
              <div className="mt-8 text-center text-white/40 text-sm">
                Enter your study details to create your personalized schedule
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="w-full max-w-3xl py-20 flex flex-col items-center justify-center animate-fadeInUp">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-400 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-r-2 border-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl">🤖</div>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">AI is creating your optimized schedule...</h2>
              <p className="text-white/50">Analyzing your subjects and time constraints.</p>
            </div>
          )}

          {currentStep === 3 && (
            <ScheduleOutput initialSchedule={schedule} onReset={handleReset} />
          )}
        </div>
      </div>
    </PageLayout>
  )
}
