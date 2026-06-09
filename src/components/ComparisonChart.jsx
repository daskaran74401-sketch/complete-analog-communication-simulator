import React from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0d1b3e]/95 border border-white/15 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-white font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-mono">
          {p.name}: {p.value} Hz
        </p>
      ))}
    </div>
  )
}

/**
 * ComparisonChart – grouped bar chart for AM vs FM bandwidth comparison.
 */
export default function ComparisonChart({ amBW, fmBW }) {
  const data = [
    { name: 'Bandwidth', AM: amBW, FM: fmBW },
  ]

  return (
    <div className="glass-card p-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
        Bandwidth Comparison (Hz)
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => `${v}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Legend iconType="square" wrapperStyle={{ fontSize: '11px' }} />
          <Bar dataKey="AM" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={60} />
          <Bar dataKey="FM" fill="#818cf8" radius={[4, 4, 0, 0]} maxBarSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
