import React, { useState, useMemo } from 'react'
import { AlertTriangle, CheckCircle, ArrowRight, Download } from 'lucide-react'
import SidebarControls, { SliderRow } from '../components/SidebarControls'
import ResultCard from '../components/ResultCard'
import QualityBadge from '../components/QualityBadge'
import FormulaCard from '../components/FormulaCard'
import ParameterTable from '../components/ParameterTable'
import { calcReceiverFreqs, receiverAnalysis } from '../utils/receiverUtils'
import { downloadJSON, formatFreq } from '../utils/calculationUtils'

export default function ReceiverPlanner() {
  const [fs,        setFs]        = useState(1000)
  const [IF,        setIF]        = useState(455)
  const [injection, setInjection] = useState('high')

  const results  = useMemo(() => calcReceiverFreqs({ fs, IF, injection }), [fs, IF, injection])
  const analysis = useMemo(() => receiverAnalysis({ ...results }), [results])

  const handleExport = () => {
    downloadJSON({ parameters: { fs, IF, injection }, results }, 'receiver_plan.json')
  }

  const freqBlockColor = (f, ref) => {
    const ratio = Math.abs(f - ref) / ref
    if (ratio < 0.05) return 'border-red-500/50 bg-red-500/8'
    if (ratio < 0.15) return 'border-yellow-500/50 bg-yellow-500/8'
    return 'border-white/15 bg-white/4'
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-6 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Superheterodyne Receiver Planner</h1>
          <p className="text-sm text-slate-400 mt-1">Calculate LO and image frequencies for a superheterodyne receiver design</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
          text-xs font-medium bg-white/6 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors w-fit">
          <Download size={13} /> Export JSON
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <SidebarControls title="Receiver Parameters">
            <SliderRow label="Signal Frequency fs" value={fs} min={100} max={10000} step={50} unit=" Hz" onChange={setFs} description="Incoming RF signal frequency." />
            <SliderRow label="Intermediate Frequency IF" value={IF} min={50} max={5000} step={25} unit=" Hz" onChange={setIF} description="Fixed IF amplifier center frequency." />
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Injection Type</label>
              <div className="flex gap-2">
                {['high', 'low'].map(type => (
                  <button
                    key={type}
                    onClick={() => setInjection(type)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all
                      ${injection === type
                        ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-400'
                        : 'bg-white/4 border-white/10 text-slate-400 hover:text-white'}`}
                  >
                    {type === 'high' ? 'High-Side' : 'Low-Side'}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                {injection === 'high'
                  ? 'fLO = fs + IF  |  fimg = fs + 2·IF'
                  : 'fLO = fs − IF  |  fimg = fs − 2·IF'}
              </p>
            </div>
          </SidebarControls>

          <FormulaCard
            title="Receiver Formulas"
            formulas={[
              `High-side: fLO = fs + IF`,
              `High-side: fimg = fs + 2·IF`,
              `Low-side:  fLO = fs − IF`,
              `Low-side:  fimg = |fs − 2·IF|`,
              `IF = |fLO − fs|`,
            ]}
            variables={[
              { sym: 'fs',   desc: 'Received signal frequency' },
              { sym: 'fLO',  desc: 'Local oscillator frequency' },
              { sym: 'IF',   desc: 'Intermediate frequency' },
              { sym: 'fimg', desc: 'Image frequency (must be rejected)' },
            ]}
          />
        </div>

        {/* Main content */}
        <div className="space-y-5">
          {/* Result cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label="Signal Freq fs" value={results.fs} unit="Hz" />
            <ResultCard label="LO Frequency fLO" value={results.fLO} unit="Hz" accent />
            <ResultCard label="IF" value={results.IF} unit="Hz" />
            <ResultCard label="Image Freq fimg" value={results.fImage} unit="Hz" />
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 flex-wrap">
            {results.warning ? (
              <QualityBadge label="Image Frequency Warning" color="warning" large pulse />
            ) : (
              <QualityBadge label="Valid Receiver Plan" color="success" large />
            )}
            <span className="text-xs text-slate-500">
              Injection: {injection === 'high' ? 'High-Side' : 'Low-Side'}
            </span>
          </div>

          {/* Warning banner */}
          {results.warning && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-300">{results.warning}</p>
            </div>
          )}

          {/* Frequency conversion diagram */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Frequency Conversion Diagram</h3>
            <div className="flex flex-wrap items-center gap-2 justify-center">
              {[
                { label: 'RF Signal',       freq: results.fs,     color: 'border-cyan-500/50  bg-cyan-500/8',    sub: 'Antenna Input' },
                { label: 'Mixer',           freq: '×',            color: 'border-white/20 bg-white/5',           sub: 'Nonlinear Mix' },
                { label: 'Local Osc. fLO',  freq: results.fLO,    color: 'border-indigo-500/50 bg-indigo-500/8', sub: injection === 'high' ? 'fs + IF' : 'fs − IF' },
                { label: '→ IF Out',        freq: results.IF,     color: 'border-emerald-500/50 bg-emerald-500/8',sub: 'Amplified & Filtered' },
              ].map((b, i) => (
                <React.Fragment key={i}>
                  <div className={`flex flex-col items-center px-4 py-3 rounded-xl border min-w-[110px] text-center ${b.color}`}>
                    <span className="text-xs font-semibold text-white">{b.label}</span>
                    <span className="font-mono text-base font-bold text-cyan-400 my-0.5">
                      {typeof b.freq === 'number' ? `${b.freq} Hz` : b.freq}
                    </span>
                    <span className="text-[10px] text-slate-500">{b.sub}</span>
                  </div>
                  {i < 3 && <ArrowRight size={16} className="text-slate-600 shrink-0" />}
                </React.Fragment>
              ))}
            </div>

            {/* Image frequency callout */}
            <div className="mt-4 p-3 rounded-lg bg-red-500/8 border border-red-500/20">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-xs font-semibold text-red-400">Image Frequency = {results.fImage} Hz</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Any signal at this frequency will mix with fLO = {results.fLO} Hz to produce
                the same IF = {results.IF} Hz, causing interference. It must be suppressed by
                the RF pre-selector bandpass filter before the mixer.
              </p>
            </div>
          </div>

          {/* Dynamic analysis */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2">Technical Analysis</p>
            <p className="text-sm text-slate-300 leading-relaxed">{analysis}</p>
          </div>

          <ParameterTable
            title="Receiver Frequency Plan"
            rows={[
              { label: 'Signal Frequency fs', value: results.fs,     unit: 'Hz' },
              { label: 'Intermediate Freq IF', value: results.IF,    unit: 'Hz' },
              { label: 'Injection Type',       value: injection === 'high' ? 'High-Side (fLO = fs + IF)' : 'Low-Side (fLO = fs − IF)' },
              { label: 'Local Oscillator fLO', value: results.fLO,   unit: 'Hz', highlight: true },
              { label: 'Image Frequency fimg', value: results.fImage, unit: 'Hz', highlight: true },
              { label: 'Image/Signal Ratio',   value: results.imageRatio },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
