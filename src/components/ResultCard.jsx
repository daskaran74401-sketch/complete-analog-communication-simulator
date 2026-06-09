import React from 'react'

/**
 * ResultCard – displays a single computed metric with label, value, unit and optional sub-text.
 */
export default function ResultCard({ label, value, unit = '', sub = '', accent = false, icon: Icon }) {
  return (
    <div className={`glass-card p-4 flex flex-col gap-1.5 ${accent ? 'border-cyan-400/30 shadow-[0_0_18px_rgba(34,211,238,0.08)]' : ''}`}>
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="w-7 h-7 rounded-md bg-cyan-400/10 flex items-center justify-center">
            <Icon size={14} className="text-cyan-400" />
          </span>
        )}
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-xl font-bold text-white">{value}</span>
        {unit && <span className="text-sm text-cyan-400 font-medium">{unit}</span>}
      </div>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  )
}
