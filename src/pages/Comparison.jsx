import React, { useState, useMemo } from 'react'
import SidebarControls, { SliderRow } from '../components/SidebarControls'
import SignalChart from '../components/SignalChart'
import ComparisonChart from '../components/ComparisonChart'
import ResultCard from '../components/ResultCard'
import FormulaCard from '../components/FormulaCard'
import ParameterTable from '../components/ParameterTable'
import { generateAMSignals, calcAMParams } from '../utils/amUtils'
import { generateFMSignals, calcFMParams } from '../utils/fmUtils'

const TABLE_DATA = [
  { property: 'Quantity Varied',     am: 'Carrier Amplitude',         fm: 'Carrier Frequency' },
  { property: 'Modulation Index',    am: 'μ = Am / Ac',               fm: 'β = Δf / fm' },
  { property: 'Bandwidth Formula',   am: 'BW = 2·fm',                 fm: "BW = 2(Δf + fm) [Carson's]" },
  { property: 'Noise Immunity',      am: 'Lower (amplitude noise)',    fm: 'Higher (capture effect)' },
  { property: 'Receiver Complexity', am: 'Simple envelope detector',  fm: 'Complex discriminator needed' },
  { property: 'Power Efficiency',    am: 'Lower (carrier wasted)',     fm: 'Better noise performance' },
  { property: 'Bandwidth Usage',     am: 'Narrower',                   fm: 'Wider (trade-off for noise)' },
  { property: 'Distortion Source',   am: 'Overmodulation (μ > 1)',    fm: 'None for constant amplitude' },
  { property: 'Practical Use',       am: 'AM broadcast, aviation',    fm: 'FM broadcast, stereo audio' },
]

export default function Comparison() {
  const [Am,     setAm]    = useState(1)
  const [Ac,     setAc]    = useState(2)
  const [fm,     setFm]    = useState(5)
  const [fc,     setFc]    = useState(50)
  const [deltaF, setDeltaF]= useState(25)
  const [noise,  setNoise] = useState(0.2)

  const amParams = useMemo(() => ({ Am, Ac, fm, fc, noiseLevel: noise, duration: 1, points: 800 }), [Am, Ac, fm, fc, noise])
  const fmParams = useMemo(() => ({ Am, Ac, fm, fc, deltaF, noiseLevel: noise, duration: 1, points: 800 }), [Am, Ac, fm, fc, deltaF, noise])

  const amSig  = useMemo(() => generateAMSignals(amParams), [amParams])
  const fmSig  = useMemo(() => generateFMSignals(fmParams), [fmParams])
  const amRes  = useMemo(() => calcAMParams({ Am, Ac, fm }),     [Am, Ac, fm])
  const fmRes  = useMemo(() => calcFMParams({ fm, fc, deltaF }), [fm, fc, deltaF])

  // Build combined chart data for overlay
  const combinedData = useMemo(() => {
    const len = Math.min(amSig.chartData.length, fmSig.chartData.length)
    return Array.from({ length: len }, (_, i) => ({
      t:    amSig.chartData[i].t,
      am1:  amSig.chartData[i].am,
      fm1:  fmSig.chartData[i].fmSig,
      am2:  amSig.chartData[i].noisyAM,
      fm2:  fmSig.chartData[i].noisyFM,
    }))
  }, [amSig, fmSig])

  const analysis = useMemo(() => {
    return `AM bandwidth = ${amRes.bw} Hz vs FM bandwidth = ${fmRes.bw} Hz ` +
      `(${(fmRes.bw / amRes.bw).toFixed(1)}× wider). ` +
      `AM modulation index μ = ${amRes.mu} (${amRes.condition}); ` +
      `FM modulation index β = ${fmRes.beta} (${fmRes.type}). ` +
      `FM's wider bandwidth is the trade-off for its superior noise immunity — ` +
      `a frequency discriminator rejects amplitude noise that degrades AM receivers. ` +
      `For the same carrier power, FM provides approximately 3β² improvement in SNR over AM (for β >> 1).`
  }, [amRes, fmRes])

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-white">AM vs FM Comparison</h1>
        <p className="text-sm text-slate-400 mt-1">Side-by-side waveform, bandwidth and noise performance analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <SidebarControls title="Shared Parameters">
            <SliderRow label="Message Amplitude Am" value={Am} min={0.1} max={5} step={0.1} unit=" V" onChange={setAm} />
            <SliderRow label="Carrier Amplitude Ac" value={Ac} min={0.5} max={5} step={0.1} unit=" V" onChange={setAc} />
            <SliderRow label="Message Frequency fm" value={fm} min={1} max={20} step={1} unit=" Hz" onChange={setFm} />
            <SliderRow label="Carrier Frequency fc" value={fc} min={10} max={200} step={5} unit=" Hz" onChange={setFc} />
            <SliderRow label="FM Deviation Δf" value={deltaF} min={1} max={100} step={1} unit=" Hz" onChange={setDeltaF} />
            <SliderRow label="Noise Level" value={noise} min={0} max={1.5} step={0.05} onChange={setNoise} />
          </SidebarControls>
        </div>

        {/* Main content */}
        <div className="space-y-5">
          {/* Quick stat comparison */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label="AM Bandwidth" value={amRes.bw} unit="Hz" />
            <ResultCard label="FM Bandwidth" value={fmRes.bw} unit="Hz" accent />
            <ResultCard label="AM Index μ" value={amRes.mu} />
            <ResultCard label="FM Index β" value={fmRes.beta} />
          </div>

          {/* Waveform comparison */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <SignalChart data={combinedData} keys={['am1', 'fm1']} title="AM vs FM Signal (Clean)" height={200} />
            <SignalChart data={combinedData} keys={['am2', 'fm2']} title="AM vs FM Signal (After Noise)" height={200} />
          </div>

          {/* Bandwidth chart */}
          <ComparisonChart amBW={amRes.bw} fmBW={fmRes.bw} />

          {/* Comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-4 border-emerald-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">AM — Amplitude Modulation</span>
              </div>
              <div className="space-y-1 text-xs text-slate-400">
                <p>• Modulation index μ = Am/Ac = <span className="text-white font-mono">{amRes.mu}</span></p>
                <p>• Bandwidth = 2fm = <span className="text-white font-mono">{amRes.bw} Hz</span></p>
                <p>• Power efficiency = <span className="text-white font-mono">{amRes.eta}%</span></p>
                <p>• Status: <span className="text-white font-mono">{amRes.condition}</span></p>
                <p>• Simple envelope detector receiver</p>
                <p>• Susceptible to amplitude noise</p>
              </div>
            </div>
            <div className="glass-card p-4 border-indigo-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-sm font-semibold text-indigo-400">FM — Frequency Modulation</span>
              </div>
              <div className="space-y-1 text-xs text-slate-400">
                <p>• Modulation index β = Δf/fm = <span className="text-white font-mono">{fmRes.beta}</span></p>
                <p>• Bandwidth = 2(Δf+fm) = <span className="text-white font-mono">{fmRes.bw} Hz</span></p>
                <p>• Type: <span className="text-white font-mono">{fmRes.type}</span></p>
                <p>• Frequency deviation Δf = <span className="text-white font-mono">{deltaF} Hz</span></p>
                <p>• Requires FM discriminator</p>
                <p>• Superior noise immunity (capture effect)</p>
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="glass-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/8 grid grid-cols-3 gap-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Property</span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">AM</span>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">FM</span>
            </div>
            {TABLE_DATA.map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 px-4 py-2.5 border-b border-white/5 last:border-0 hover:bg-white/3 text-xs">
                <span className="text-slate-400 font-medium">{row.property}</span>
                <span className="text-emerald-300/80">{row.am}</span>
                <span className="text-indigo-300/80">{row.fm}</span>
              </div>
            ))}
          </div>

          {/* Dynamic analysis */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2">Comparative Analysis</p>
            <p className="text-sm text-slate-300 leading-relaxed">{analysis}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
