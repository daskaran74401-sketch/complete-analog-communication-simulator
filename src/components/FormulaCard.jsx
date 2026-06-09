import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

/**
 * FormulaCard – collapsible card showing LaTeX-like formula strings and variable explanations.
 */
export default function FormulaCard({ title, formulas = [], variables = [] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="glass-card overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/4 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-sm font-semibold text-cyan-400">{title}</span>
        {open
          ? <ChevronDown size={15} className="text-slate-400" />
          : <ChevronRight size={15} className="text-slate-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-white/8 pt-3 space-y-3">
          {formulas.map((f, i) => (
            <div key={i} className="bg-[#0d1b3e] rounded-lg px-3 py-2 font-mono text-sm text-cyan-300 select-all">
              {f}
            </div>
          ))}
          {variables.length > 0 && (
            <div className="space-y-1.5 mt-2">
              {variables.map((v, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="font-mono text-cyan-400 shrink-0 w-20">{v.sym}</span>
                  <span className="text-slate-400">{v.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
