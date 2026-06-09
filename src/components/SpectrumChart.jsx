import React from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, ReferenceLine
} from 'recharts'

const TYPE_COLOR = {
  carrier:  '#22d3ee',
  sideband: '#818cf8',
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-[#0d1b3e]/95 border border-white/15 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400">{d.name ?? d.label}</p>
      <p className="font-mono text-cyan-400">Freq: {d.freq} Hz</p>
      <p className="font-mono text-white">Amplitude: {d.amplitude}</p>
    </div>
  )
}

/**
 * SpectrumChart – bar chart showing spectral components.
 * @param {Object[]} data  – [{ freq, amplitude, type, name }]
 * @param {string}   title
 */
export default function SpectrumChart({ data = [], title = 'Frequency Spectrum' }) {
  return (
    <div className="glass-card p-4">
      {title && (
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="freq"
            tick={{ fontSize: 10, fill: '#64748b' }}
            label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -20, fontSize: 10, fill: '#475569' }}
            tickFormatter={v => `${v}`}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#64748b' }}
            width={40}
            label={{ value: 'Amplitude', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#475569' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="amplitude" maxBarSize={40} radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={TYPE_COLOR[entry.type] ?? '#94a3b8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2 justify-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-sm bg-cyan-400" /> Carrier
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-sm bg-indigo-400" /> Sidebands
        </div>
      </div>
    </div>
  )
}
