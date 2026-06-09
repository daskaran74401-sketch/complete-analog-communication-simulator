import React from 'react'

/**
 * SliderRow – a labelled range slider with live value display.
 */
export function SliderRow({ label, value, min, max, step = 0.01, unit = '', onChange, description }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-slate-400 font-medium">{label}</label>
        <span className="font-mono text-sm font-semibold text-cyan-400">
          {typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2) : value}
          {unit && <span className="text-slate-500 text-xs ml-0.5">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="slider-cyan w-full"
        style={{ '--val': `${pct}%` }}
      />
      <div className="flex justify-between text-[10px] text-slate-600">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
      {description && <p className="text-[10px] text-slate-500 leading-relaxed">{description}</p>}
    </div>
  )
}

/**
 * SidebarControls – container for a group of controls with a section title.
 */
export default function SidebarControls({ title, children }) {
  return (
    <div className="glass-card p-4 space-y-5">
      {title && (
        <h3 className="text-sm font-semibold text-white border-b border-white/8 pb-2.5">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
