import React from 'react'
import { ArrowRight, Radio, Cpu, Waves, Zap, BarChart2, Activity, GitCompare, BookOpen } from 'lucide-react'
import SystemFlow from '../components/SystemFlow'
import { PROJECT_INFO } from '../data/projectInfo'

const TECH_ICONS = { 'React 18': '⚛', 'Vite 5': '⚡', 'Tailwind CSS 3': '🎨', 'Recharts': '📊', 'React Router 6': '🔀', 'Lucide React': '✨' }

export default function About() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8 space-y-8">

      {/* Hero */}
      <section className="glass-card p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center">
              <Radio size={24} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{PROJECT_INFO.title}</h1>
              <p className="text-cyan-400 text-sm">{PROJECT_INFO.subtitle}</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
            An interactive, fully client-side engineering simulation tool built to visualize and analyze
            core analog communication concepts. Designed for students, educators and engineers who need
            a hands-on, formula-accurate tool that goes beyond textbook theory.
          </p>
        </div>
      </section>

      {/* System flow */}
      <section className="glass-card p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu size={16} className="text-cyan-400" /> Communication System Flow
        </h2>
        <SystemFlow />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs text-slate-400">
          {[
            { step: '1. Source',         desc: 'Analog information signal from audio/sensor source' },
            { step: '2. Modulation',     desc: 'AM: vary amplitude | FM: vary frequency of carrier' },
            { step: '3. Channel',        desc: 'AWGN additive white Gaussian noise degrades signal' },
            { step: '4. Demodulation',   desc: 'AM: envelope detector | FM: frequency discriminator' },
            { step: '5. Sink',           desc: 'Recovered message signal delivered to user/speaker' },
          ].map((s, i) => (
            <div key={i} className="bg-white/3 rounded-lg p-2.5">
              <p className="font-semibold text-white text-[11px] mb-1">{s.step}</p>
              <p className="leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Simulation Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECT_INFO.modules.map(mod => (
            <div key={mod.id} className="glass-card p-4">
              <h3 className="text-sm font-semibold text-cyan-400 mb-1">{mod.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Concepts */}
      <section className="glass-card p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen size={16} className="text-cyan-400" /> Analog Communication Concepts Covered
        </h2>
        <div className="flex flex-wrap gap-2">
          {PROJECT_INFO.concepts.map((c, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-cyan-400/8 border border-cyan-400/20 text-cyan-300">
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="glass-card p-6">
        <h2 className="text-base font-semibold text-white mb-4">Technology Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PROJECT_INFO.techStack.map((tech, i) => (
            <div key={i} className="bg-white/4 rounded-xl p-3 text-center border border-white/8 hover:border-cyan-400/20 transition-colors">
              <span className="text-2xl">{TECH_ICONS[tech] ?? '🔧'}</span>
              <p className="text-xs font-medium text-white mt-1">{tech}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real-world relevance */}
      <section className="glass-card p-6">
        <h2 className="text-base font-semibold text-white mb-4">Real-World Relevance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-400">
          {[
            { title: 'AM Broadcasting',       desc: 'Medium and short-wave AM radio uses DSB-TC modulation exactly as simulated here. μ must stay ≤ 1.' },
            { title: 'FM Broadcasting',       desc: 'Commercial FM radio (88–108 MHz) uses wideband FM (β ≈ 5) — Carson bandwidth ≈ 200 kHz per channel.' },
            { title: 'Noise & Link Budgets',  desc: 'SNR and thermal noise calculations are fundamental to any RF link budget and receiver sensitivity analysis.' },
            { title: 'Superheterodyne Radio', desc: 'Virtually every AM/FM radio, TV tuner and radar receiver uses the superheterodyne architecture designed here.' },
          ].map((item, i) => (
            <div key={i} className="bg-white/3 rounded-xl p-4">
              <p className="font-semibold text-white text-sm mb-1">{item.title}</p>
              <p className="text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Future scope */}
      <section className="glass-card p-6">
        <h2 className="text-base font-semibold text-white mb-4">Future Scope</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PROJECT_INFO.futureScope.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <ArrowRight size={14} className="text-cyan-400 mt-0.5 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <div className="text-center text-xs text-slate-600 py-4">
        Built with React + Vite + Tailwind CSS · All calculations are client-side · No backend required
      </div>
    </div>
  )
}
