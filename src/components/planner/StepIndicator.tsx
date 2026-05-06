import React from 'react'

type StepIndicatorProps = {
  currentStep: number
}

const steps = [
  { num: 1, label: 'Add Details' },
  { num: 2, label: 'AI Optimizes' },
  { num: 3, label: 'Use Your Schedule' },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full flex items-center justify-center mb-10">
      <div className="flex items-center w-full max-w-3xl">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.num
          const isActive = currentStep === step.num
          const isPending = currentStep < step.num

          return (
            <React.Fragment key={step.num}>
              {/* Step Circle & Label */}
              <div className="flex flex-col items-center relative z-10 w-24">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    isActive
                      ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110'
                      : isCompleted
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-white/5 text-white/30 border border-white/10'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    step.num
                  )}
                </div>
                <span
                  className={`absolute -bottom-8 w-max text-xs font-medium transition-colors duration-300 ${
                    isActive ? 'text-indigo-200' : isCompleted ? 'text-white/60' : 'text-white/30'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 relative overflow-hidden bg-white/5 rounded-full">
                  <div
                    className="absolute inset-0 bg-indigo-500 transition-all duration-700 ease-in-out"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
