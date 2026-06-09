import React from 'react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine
} from 'recharts'

const COLORS = {
  msg:      '#22d3ee',  // cyan
  carrier:  '#818cf8',  // indigo
  am:       '#34d399',  // emerald
  fmSig:    '#f59e0b',  // amber
  noisyAM:  '#f87171',  // red
  noisyFM:  '#fb923c',  // orange
  recovered:'#a78bfa',  // violet
  clean:    '#22d3ee',
  noise:    '#f87171',
  noisy:    '#fbbf24',
  am1:      '#34d399',
  am2:      '#f87171',
  fm1:      '#818cf8',
  fm2:      '#fb923c',
}

const LABEL = {
  msg:      'Message',
  carrier:  'Carrier',
  am:       'AM Signal',
  fmSig:    'FM Signal',
  noisyAM:  'Noisy AM',
  noisyFM:  'Noisy FM',
  recovered:'Recovered',
  clean:    'Clean Signal',
  noise:    'Noise',
  noisy:    'Noisy Signal',
  am1:      'AM Signal',
  am2:      'Noisy AM',
  fm1:      'FM Signal',
  fm2:      'Noisy FM',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0d1b3e]/95 border border-white/15 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">t = {label}s</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-mono">
          {LABEL[p.dataKey] ?? p.dataKey}: {p.value?.toFixed(4)}
        </p>
      ))}
    </div>
  )
}

/**
 * SignalChart – Recharts line chart for time-domain signals.
 * @param {Object[]}  data      – Recharts data array with { t, ...signals }
 * @param {string[]}  keys      – which signal keys to plot
 * @param {string}    title     – chart title
 * @param {number}    height    – px
 */
export default function SignalChart({ data = [], keys = [], title = '', height = 200 }) {
  return (
    <div className="glass-card p-4">
      {title && (
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 10, fill: '#64748b' }}
            tickFormatter={v => v.toFixed(2)}
            label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -4, fontSize: 10, fill: '#475569' }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#64748b' }}
            width={40}
            tickFormatter={v => v.toFixed(1)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="plainline"
            iconSize={16}
            wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
            formatter={(value) => LABEL[value] ?? value}
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
          {keys.map(k => (
            <Line
              key={k}
              type="monotone"
              dataKey={k}
              stroke={COLORS[k] ?? '#94a3b8'}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
