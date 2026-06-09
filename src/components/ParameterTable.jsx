import React from 'react'

/**
 * ParameterTable – simple two-column table for symbol/value pairs.
 * @param {Array<{label,value,unit?,highlight?}>} rows
 */
export default function ParameterTable({ rows = [], title = 'Parameters' }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/8">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{title}</span>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-white/5 last:border-0 ${row.highlight ? 'bg-cyan-400/5' : ''}`}>
              <td className="px-4 py-2 text-slate-400 font-medium">{row.label}</td>
              <td className="px-4 py-2 font-mono text-right">
                <span className={row.highlight ? 'text-cyan-400 font-semibold' : 'text-white'}>
                  {row.value}
                </span>
                {row.unit && <span className="text-slate-500 ml-1 text-xs">{row.unit}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
