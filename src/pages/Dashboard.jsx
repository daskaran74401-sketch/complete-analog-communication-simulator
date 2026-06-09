import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Radio, Waves, Activity, Zap, BarChart2, ArrowRight,
  GitCompare, Info, ChevronRight
} from 'lucide-react'
import SystemFlow from '../components/SystemFlow'
import { PROJECT_INFO } from '../data/projectInfo'

const ICON_MAP = {
  Waves: Waves, Activity: Activity, Zap: Zap,
  BarChart2: BarChart2, Radio: Radio, GitCompare: GitCompare
}

const QUICK_STATS = [
  { label: 'AM Bandwidth',    formula: 'BW = 2fm',         example: '@ fm=5Hz → 10 Hz', color: 'text-emerald-400' },
  { label: 'FM Bandwidth',    formula: 'BW = 2(Δf + fm)',  example: 'Carson\'s Rule',    color: 'text-indigo-400' },
  { label: 'SNR (dB)',        formula: '10·log₁₀(S/N)',    example: '≥20 dB Excellent', color: 'text-amber-400'  },
  { label: 'Image Frequency', formula: 'fi = fs ± 2·IF',   example: 'High-side injection',color:'text-rose-400'  },
  { label: 'Mod Index AM',    formula: 'μ = Am/Ac',        example: 'μ < 1 = no distortion', color: 'text-cyan-400' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8 space-y-10">

      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden border border-white/10
                          bg-gradient-to-br from-[#0d1b3e] to-[#0a1628] p-8 lg:p-12">
        {/* decorative glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full
                        bg-cyan-400/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-info text-[10px]">v1.0.0</span>
            <span className="badge-success text-[10px]">Analog Communication</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
            Analog Communication<br />
            <span className="text-gradient">System Simulator</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl mb-6">
            An interactive engineering simulation tool covering AM, FM, noise analysis,
            frequency spectrum, superheterodyne receiver planning, and comparative analysis —
            all in one integrated dashboard.
          </p>
          <SystemFlow />
        </div>
      </section>

      {/* Module Navigation Cards */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-5">Simulation Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECT_INFO.modules.map(mod => {
            const Icon = ICON_MAP[mod.icon] ?? Radio
            return (
              <button
                key={mod.id}
                onClick={() => navigate(mod.path)}
                className="glass-card-hover p-5 text-left group flex flex-col gap-3 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20
                                  flex items-center justify-center group-hover:bg-cyan-400/20 transition-colors">
                    <Icon size={20} className="text-cyan-400" />
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">{mod.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{mod.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Quick-reference formula strip */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-5">Key Formulas at a Glance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {QUICK_STATS.map((s, i) => (
            <div key={i} className="glass-card p-3 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide">{s.label}</span>
              <p className={`font-mono text-sm font-semibold ${s.color}`}>{s.formula}</p>
              <p className="text-[10px] text-slate-600">{s.example}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Communication concepts covered */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-5">Concepts Covered</h2>
        <div className="glass-card p-5">
          <div className="flex flex-wrap gap-2">
            {PROJECT_INFO.concepts.map((c, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10
                                       text-slate-300 hover:border-cyan-400/30 hover:text-cyan-300 transition-colors">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* System flow diagram detail */}
      <section className="glass-card p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Radio size={16} className="text-cyan-400" />
          Communication System Flow
        </h2>
        <div className="flex flex-wrap gap-3 items-center">
          {[
            { label: 'Source',         sub: 'Audio / Data',      color: 'border-slate-600' },
            { label: 'Message Signal', sub: 'm(t) = Am·sin(2πfm t)', color: 'border-cyan-600' },
            { label: 'Modulator',      sub: 'AM or FM',          color: 'border-indigo-600' },
            { label: 'Channel',        sub: 'AWGN Noise',        color: 'border-yellow-700' },
            { label: 'Receiver / Demod',sub: 'Envelope / Discriminator', color: 'border-emerald-700' },
            { label: 'Output Signal',  sub: 'Recovered m(t)',    color: 'border-green-600' },
          ].map((step, i, arr) => (
            <React.Fragment key={i}>
              <div className={`flex flex-col items-center px-4 py-3 rounded-xl border bg-white/3 ${step.color} min-w-[110px]`}>
                <span className="text-xs font-semibold text-white">{step.label}</span>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5 text-center leading-tight">{step.sub}</span>
              </div>
              {i < arr.length - 1 && <ArrowRight size={16} className="text-slate-600 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </section>

    </div>
  )
}
