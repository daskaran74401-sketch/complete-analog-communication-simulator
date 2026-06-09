import React, { useState, useMemo, useCallback } from 'react'
import { Download, AlertTriangle } from 'lucide-react'
import SidebarControls, { SliderRow } from '../components/SidebarControls'
import SignalChart from '../components/SignalChart'
import ResultCard from '../components/ResultCard'
import QualityBadge from '../components/QualityBadge'
import FormulaCard from '../components/FormulaCard'
import ParameterTable from '../components/ParameterTable'
import SystemFlow from '../components/SystemFlow'
import { generateAMSignals, calcAMParams, amAnalysis } from '../utils/amUtils'
import { downloadJSON, downloadCSV } from '../utils/calculationUtils'

const FLOW_STEPS = [
  { label: 'Message m(t)',   sub: 'Am·sin(2πfm t)' },
  { label: 'AM Modulator',   sub: 'DSB-TC' },
  { label: 'Channel Noise',  sub: 'AWGN' },
  { label: 'Envelope Det.',  sub: 'Rectify+LPF' },
  { label: 'Recovered',      sub: 'Output' },
]

export default function AMSimulator() {
  const [Am,       setAm]       = useState(1)
  const [Ac,       setAc]       = useState(2)
  const [fm,       setFm]       = useState(5)
  const [fc,       setFc]       = useState(50)
  const [R,        setR]        = useState(50)
  const [noiseLevel, setNoise]  = useState(0.2)
  const [duration, setDuration] = useState(1)
  const [points,   setPoints]   = useState(1000)

  const params = useMemo(() => ({ Am, Ac, fm, fc, R, noiseLevel, duration, points }), [Am, Ac, fm, fc, R, noiseLevel, duration, points])
  const signals = useMemo(() => generateAMSignals(params), [params])
  const results = useMemo(() => calcAMParams({ Am, Ac, fm, R }), [Am, Ac, fm, R])
  const analysis = useMemo(() => amAnalysis({ mu: results.mu, bw: results.bw, eta: results.eta, condition: results.condition }), [results])

  const handleExport = useCallback(() => {
    downloadJSON({ parameters: params, results }, 'am_parameters.json')
  }, [params, results])

  const handleCSV = useCallback(() => {
    downloadCSV(signals.chartData, 'am_waveform.csv')
  }, [signals])

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-6 space-y-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">AM Simulator</h1>
          <p className="text-sm text-slate-400 mt-1">Amplitude Modulation — DSB with Full Carrier (DSB-TC)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-xs font-medium bg-white/6 border border-white/10 text-slate-300
            hover:bg-white/10 hover:text-white transition-colors">
            <Download size={13} /> Export JSON
          </button>
          <button onClick={handleCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-xs font-medium bg-white/6 border border-white/10 text-slate-300
            hover:bg-white/10 hover:text-white transition-colors">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      <SystemFlow steps={FLOW_STEPS} activeIndex={2} />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <SidebarControls title="Signal Parameters">
            <SliderRow label="Message Amplitude Am" value={Am} min={0.1} max={5} step={0.1} unit=" V" onChange={setAm} description="Peak amplitude of the message signal." />
            <SliderRow label="Carrier Amplitude Ac" value={Ac} min={0.5} max={5} step={0.1} unit=" V" onChange={setAc} description="Peak amplitude of the carrier signal." />
            <SliderRow label="Message Frequency fm" value={fm} min={1} max={20} step={1} unit=" Hz" onChange={setFm} />
            <SliderRow label="Carrier Frequency fc" value={fc} min={10} max={200} step={5} unit=" Hz" onChange={setFc} />
            <SliderRow label="Load Resistance R" value={R} min={1} max={200} step={1} unit=" Ω" onChange={setR} />
          </SidebarControls>
          <SidebarControls title="Simulation Settings">
            <SliderRow label="Noise Level" value={noiseLevel} min={0} max={2} step={0.05} onChange={setNoise} description="Additive noise amplitude." />
            <SliderRow label="Duration" value={duration} min={0.5} max={5} step={0.5} unit=" s" onChange={setDuration} />
            <SliderRow label="Sample Points" value={points} min={200} max={2000} step={100} onChange={setPoints} />
          </SidebarControls>

          <FormulaCard
            title="AM Formulas"
            formulas={[
              `m(t) = Am · sin(2π·fm·t)`,
              `c(t) = Ac · sin(2π·fc·t)`,
              `sAM(t) = Ac·[1 + μ·sin(2π·fm·t)]·sin(2π·fc·t)`,
              `μ = Am / Ac = ${results.mu}`,
              `BW_AM = 2·fm = ${results.bw} Hz`,
              `Pc = Ac²/(2R) = ${results.Pc} W`,
              `Pt = Pc·(1 + μ²/2) = ${results.Pt} W`,
              `η = μ²/(2+μ²) = ${results.eta}%`,
            ]}
            variables={[
              { sym: 'μ',  desc: 'Modulation index (Am/Ac)' },
              { sym: 'Pc', desc: 'Carrier power' },
              { sym: 'Pt', desc: 'Total transmitted power' },
              { sym: 'η',  desc: 'Power efficiency' },
            ]}
          />
        </div>

        {/* Main content */}
        <div className="space-y-5">
          {/* Overmodulation warning */}
          {results.overmod && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400">Overmodulation Detected (μ = {results.mu})</p>
                <p className="text-xs text-red-400/80 mt-0.5">
                  When μ &gt; 1, the envelope crosses zero causing irreversible distortion. Reduce Am or increase Ac.
                </p>
              </div>
            </div>
          )}

          {/* Result cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label="Modulation Index μ" value={results.mu} accent />
            <ResultCard label="Bandwidth" value={results.bw} unit="Hz" />
            <ResultCard label="Efficiency η" value={`${results.eta}%`} />
            <ResultCard label="Total Power" value={results.Pt} unit="W" />
          </div>

          {/* Condition badge */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Modulation Status:</span>
            <QualityBadge label={results.condition} color={results.conditionColor} large pulse={results.overmod} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <SignalChart data={signals.chartData} keys={['msg', 'carrier']} title="Message & Carrier Signals" height={180} />
            <SignalChart data={signals.chartData} keys={['am']} title="AM Modulated Signal" height={180} />
            <SignalChart data={signals.chartData} keys={['noisyAM']} title="Noisy AM Signal (After Channel)" height={180} />
            <SignalChart data={signals.chartData} keys={['recovered']} title="Recovered Signal (Envelope Detection)" height={180} />
          </div>

          {/* Dynamic analysis */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2">Dynamic Analysis</p>
            <p className="text-sm text-slate-300 leading-relaxed">{analysis}</p>
          </div>

          <ParameterTable
            title="Calculated Parameters"
            rows={[
              { label: 'μ = Am / Ac',        value: results.mu,   highlight: true },
              { label: 'BW_AM = 2·fm',        value: results.bw,   unit: 'Hz', highlight: true },
              { label: 'Pc = Ac²/(2R)',       value: results.Pc,   unit: 'W' },
              { label: 'Pt = Pc(1+μ²/2)',     value: results.Pt,   unit: 'W' },
              { label: 'η = μ²/(2+μ²)',       value: `${results.eta}%` },
              { label: 'Condition',           value: results.condition },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
