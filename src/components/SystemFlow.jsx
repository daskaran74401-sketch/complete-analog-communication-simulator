import React from 'react'
import { ArrowRight } from 'lucide-react'

const DEFAULT_STEPS = [
  { label: 'Message Signal', sub: 'm(t)' },
  { label: 'Modulation',     sub: 'AM / FM' },
  { label: 'Channel + Noise', sub: 'AWGN' },
  { label: 'Receiver',        sub: 'Demod' },
  { label: 'Output Signal',   sub: 'Recovered' },
]

export default function SystemFlow({ steps = DEFAULT_STEPS, activeIndex = -1 }) {
  return (
    <div className="flex flex-wrap items-center gap-1 justify-center sm:justify-start">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className={`flex flex-col items-center px-3 py-2 rounded-lg border text-center
                            transition-all duration-200
                            ${activeIndex === i
                              ? 'border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                              : 'border-white/10 bg-white/4'}`}>
            <span className={`text-xs font-semibold ${activeIndex === i ? 'text-cyan-400' : 'text-white'}`}>
              {step.label}
            </span>
            {step.sub && (
              <span className="text-[10px] font-mono text-slate-500 mt-0.5">{step.sub}</span>
            )}
          </div>
          {i < steps.length - 1 && (
            <ArrowRight size={14} className="text-slate-600 shrink-0" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
