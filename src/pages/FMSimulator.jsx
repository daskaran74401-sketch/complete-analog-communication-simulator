import React, { useState, useMemo, useCallback } from 'react'
import { Download } from 'lucide-react'
import SidebarControls, { SliderRow } from '../components/SidebarControls'
import SignalChart from '../components/SignalChart'
import ResultCard from '../components/ResultCard'
import QualityBadge from '../components/QualityBadge'
import FormulaCard from '../components/FormulaCard'
import ParameterTable from '../components/ParameterTable'
import SystemFlow from '../components/SystemFlow'
import { generateFMSignals, calcFMParams, fmAnalysis } from '../utils/fmUtils'
import { downloadJSON, downloadCSV } from '../utils/calculationUtils'

const FLOW_STEPS = [
  { label: 'Message m(t)',  sub: 'Am·sin(2πfm t)' },
  { label: 'FM Modulator',  sub: 'Angle Mod.' },
  { label: 'Channel Noise', sub: 'AWGN' },
  { label: 'Discriminator', sub: 'FM Demod' },
  { label: 'Recovered',     sub: 'Output' },
]

export default function FMSimulator() {
  const [Am,       setAm]       = useState(1)
  const [Ac,       setAc]       = useState(2)
  const [fm,       setFm]       = useState(5)
  const [fc,       setFc]       = useState(50)
  const [deltaF,   setDeltaF]   = useState(25)
  const [noiseLevel, setNoise]  = useState(0.2)
  const [duration, setDuration] = useState(1)
  const [points,   setPoints]   = useState(1000)

  const params  = useMemo(() => ({ Am, Ac, fm, fc, deltaF, noiseLevel, duration, points }), [Am, Ac, fm, fc, deltaF, noiseLevel, duration, points])
  const signals = useMemo(() => generateFMSignals(params), [params])
  const results = useMemo(() => calcFMParams({ fm, fc, deltaF }), [fm, fc, deltaF])
  const analysis = useMemo(() => fmAnalysis({ beta: results.beta, bw: results.bw, deltaF, fm, type: results.type }), [results, deltaF, fm])

  const handleExport = useCallback(() => downloadJSON({ parameters: params, results }, 'fm_parameters.json'), [params, results])
  const handleCSV    = useCallback(() => downloadCSV(signals.chartData, 'fm_waveform.csv'), [signals])

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-6 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">FM Simulator</h1>
          <p className="text-sm text-slate-400 mt-1">Frequency Modulation — Angle Modulation with Constant Amplitude</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-xs font-medium bg-white/6 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
            <Download size={13} /> Export JSON
          </button>
          <button onClick={handleCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-xs font-medium bg-white/6 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      <SystemFlow steps={FLOW_STEPS} activeIndex={2} />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <SidebarControls title="Signal Parameters">
            <SliderRow label="Message Amplitude Am" value={Am} min={0.1} max={5} step={0.1} unit=" V" onChange={setAm} />
            <SliderRow label="Carrier Amplitude Ac" value={Ac} min={0.5} max={5} step={0.1} unit=" V" onChange={setAc} />
            <SliderRow label="Message Frequency fm" value={fm} min={1} max={20} step={1} unit=" Hz" onChange={setFm} />
            <SliderRow label="Carrier Frequency fc" value={fc} min={10} max={200} step={5} unit=" Hz" onChange={setFc} />
            <SliderRow label="Frequency Deviation Δf" value={deltaF} min={1} max={100} step={1} unit=" Hz" onChange={setDeltaF} description="Peak frequency deviation from carrier." />
          </SidebarControls>
          <SidebarControls title="Simulation Settings">
            <SliderRow label="Noise Level" value={noiseLevel} min={0} max={2} step={0.05} onChange={setNoise} />
            <SliderRow label="Duration" value={duration} min={0.5} max={5} step={0.5} unit=" s" onChange={setDuration} />
            <SliderRow label="Sample Points" value={points} min={200} max={2000} step={100} onChange={setPoints} />
          </SidebarControls>

          <FormulaCard
            title="FM Formulas"
            formulas={[
              `m(t) = Am · sin(2π·fm·t)`,
              `sFM(t) = Ac · sin(2π·fc·t + β·sin(2π·fm·t))`,
              `β = Δf / fm = ${deltaF}/${fm} = ${results.beta}`,
              `BW_FM = 2(Δf + fm) = ${results.bw} Hz  [Carson's Rule]`,
            ]}
            variables={[
              { sym: 'β',  desc: 'FM modulation index (Δf/fm)' },
              { sym: 'Δf', desc: 'Peak frequency deviation (Hz)' },
              { sym: 'BW', desc: "Carson's rule bandwidth" },
            ]}
          />
        </div>

        {/* Main content */}
        <div className="space-y-5">
          {/* Result cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultCard label="FM Modulation Index β" value={results.beta} accent />
            <ResultCard label="Carson Bandwidth" value={results.bw} unit="Hz" />
            <ResultCard label="Frequency Deviation Δf" value={deltaF} unit="Hz" />
          </div>

          {/* Type badge */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">FM Type:</span>
            <QualityBadge label={results.type} color={results.typeColor} large />
            <span className="text-xs text-slate-500">(β {results.beta < 1 ? '< 1' : '≥ 1'})</span>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <SignalChart data={signals.chartData} keys={['msg', 'carrier']} title="Message & Carrier Signals" height={180} />
            <SignalChart data={signals.chartData} keys={['fmSig']} title="FM Modulated Signal" height={180} />
            <SignalChart data={signals.chartData} keys={['noisyFM']} title="Noisy FM Signal (After Channel)" height={180} />
            <SignalChart data={signals.chartData} keys={['msg', 'fmSig']} title="Message vs FM Overlay" height={180} />
          </div>

          {/* Dynamic analysis */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2">Dynamic Analysis</p>
            <p className="text-sm text-slate-300 leading-relaxed">{analysis}</p>
          </div>

          <ParameterTable
            title="Calculated Parameters"
            rows={[
              { label: 'β = Δf / fm',          value: results.beta,  highlight: true },
              { label: 'BW = 2(Δf + fm)',       value: results.bw,    unit: 'Hz', highlight: true },
              { label: 'Frequency Deviation Δf', value: deltaF,       unit: 'Hz' },
              { label: 'FM Type',               value: results.type },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
