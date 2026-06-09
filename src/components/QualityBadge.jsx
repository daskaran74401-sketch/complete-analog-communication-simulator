import React from 'react'

const COLOR_MAP = {
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-yellow-500/20  text-yellow-400  border-yellow-500/30',
  danger:  'bg-red-500/20     text-red-400     border-red-500/30',
  info:    'bg-cyan-500/20    text-cyan-400    border-cyan-500/30',
  purple:  'bg-purple-500/20  text-purple-400  border-purple-500/30',
}

const DOT_COLOR = {
  success: 'bg-emerald-400',
  warning: 'bg-yellow-400',
  danger:  'bg-red-400',
  info:    'bg-cyan-400',
  purple:  'bg-purple-400',
}

/**
 * QualityBadge – a small colored pill with label and animated dot.
 */
export default function QualityBadge({ label, color = 'info', large = false, pulse = false }) {
  const cls  = COLOR_MAP[color] ?? COLOR_MAP.info
  const dot  = DOT_COLOR[color] ?? DOT_COLOR.info
  const size = large ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${cls} ${size}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${pulse ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  )
}
