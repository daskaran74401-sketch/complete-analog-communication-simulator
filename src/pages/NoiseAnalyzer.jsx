import React, { useState, useMemo, useCallback } from 'react'
import { Download, Zap } from 'lucide-react'
import SidebarControls, { SliderRow } from '../components/SidebarControls'
import SignalChart from '../components/SignalChart'
import ResultCard from '../components/ResultCard'
import QualityBadge from '../components/QualityBadge'
import FormulaCard from '../components/FormulaCard'
import ParameterTable from '../components/ParameterTable'
import { generateNoiseSignals, calcNoiseParams, noiseAnalysis, NOISE_PRESETS } from '../utils/noiseUtils'
import { downloadJSON, formatPower } from '../utils/calculationUtils'

export default function NoiseAnalyzer() {
  const [signalPower,  setSignalPower]  = useState(10)
  const [noisePower,   setNoisePower]   = useState(1)
  const [noiseLevel,   setNoiseLevel]   = useState(0.2)
  const [temperature,  setTemperature]  = useState(290)
  const [bandwidth,    setBandwidth]    = useState(1000)

  const params  = useMemo(() => ({ signalPower, noisePower, noiseLevel, temperature, bandwidth }), [signalPower, noisePower, noiseLevel, temperature, bandwidth])
  const signals = useMemo(() => generateNoiseSignals({ signalPower, noiseLevel }), [signalPower, noiseLevel])
  const results = useMemo(() => calcNoiseParams({ signalPower, noisePower, temperature, bandwidth }), [signalPower, noisePower, temperature, bandwidth])
  const analysis = useMemo(() => noiseAnalysis({ snrDB: results.snrDB, snrLinear: results.snrLinear, quality: results.quality, thermalNdBm: results.thermalNdBm }), [results])

  const applyPreset = useCallback((key) => {
    const p = NOISE_PRESETS[key]
    setNoisePower(p.noisePower)
    setNoiseLevel(p.noiseLevel)
  }, [])

  const handleExport = useCallback(() => downloadJSON({ parameters: params, results }, 'noise_analysis.json'), [params, results])

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-6 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Noise Analyzer</h1>
          <p className="text-sm text-slate-400 mt-1">Signal-to-Noise Ratio analysis and thermal noise calculation</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
          text-xs font-medium bg-white/6 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors w-fit">
          <Download size={13} /> Export JSON
        </button>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-slate-400">Quick Presets:</span>
        {Object.entries(NOISE_PRESETS).map(([key, p]) => (
          <button key={key} onClick={() => applyPreset(key)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/15
                       bg-white/5 text-slate-300 hover:bg-cyan-400/10 hover:border-cyan-400/30
                       hover:text-cyan-300 transition-all">
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <SidebarControls title="Signal Parameters">
            <SliderRow label="Signal Power" value={signalPower} min={0.1} max={100} step={0.1} unit=" W" onChange={setSignalPower} />
            <SliderRow label="Noise Power" value={noisePower} min={0.01} max={50} step={0.01} unit=" W" onChange={setNoisePower} />
            <SliderRow label="Noise Level (visual)" value={noiseLevel} min={0} max={2} step={0.05} onChange={setNoiseLevel} description="Visual noise amplitude for waveform display." />
          </SidebarControls>
          <SidebarControls title="Thermal Noise Parameters">
            <SliderRow label="Temperature" value={temperature} min={10} max={1000} step={10} unit=" K" onChange={setTemperature} description="System noise temperature (K). Room temp ≈ 290 K." />
            <SliderRow label="Bandwidth" value={bandwidth} min={100} max={100000} step={100} unit=" Hz" onChange={setBandwidth} />
          </SidebarControls>

          <FormulaCard
            title="Noise Formulas"
            formulas={[
              `SNR = Signal Power / Noise Power`,
              `SNR_dB = 10 · log₁₀(SNR)`,
              `N = k · T · B`,
              `k = 1.38 × 10⁻²³ J/K (Boltzmann)`,
            ]}
            variables={[
              { sym: 'SNR',  desc: 'Signal-to-Noise Ratio (linear)' },
              { sym: 'k',    desc: "Boltzmann's constant" },
              { sym: 'T',    desc: 'Temperature (Kelvin)' },
              { sym: 'B',    desc: 'Noise bandwidth (Hz)' },
              { sym: 'N',    desc: 'Thermal noise power (W)' },
            ]}
          />
        </div>

        {/* Main content */}
        <div className="space-y-5">
          {/* Result cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label="SNR (Linear)" value={results.snrLinear} accent />
            <ResultCard label="SNR (dB)" value={results.snrDB} unit="dB" accent />
            <ResultCard label="Thermal Noise" value={formatPower(results.thermalN)} />
            <ResultCard label="Thermal Noise" value={results.thermalNdBm} unit="dBm" />
          </div>

          {/* Quality badge */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Signal Quality:</span>
            <QualityBadge label={results.quality} color={results.qualityColor} large pulse />
          </div>

          {/* SNR meter */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">SNR Level Meter</p>
            <div className="relative h-5 rounded-full bg-white/5 border border-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, (results.snrDB / 40) * 100))}%`,
                  background: results.snrDB >= 20 ? '#10b981'
                             : results.snrDB >= 10 ? '#22d3ee'
                             : results.snrDB >= 3  ? '#f59e0b'
                             : '#ef4444'
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Poor (0 dB)</span>
              <span>Weak (3 dB)</span>
              <span>Good (10 dB)</span>
              <span>Excellent (20+ dB)</span>
            </div>
          </div>

          {/* Waveform charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <SignalChart data={signals.chartData} keys={['clean']} title="Clean Signal" height={160} />
            <SignalChart data={signals.chartData} keys={['noise']} title="Noise Waveform" height={160} />
            <SignalChart data={signals.chartData} keys={['noisy']} title="Noisy Signal" height={160} />
          </div>
          <SignalChart data={signals.chartData} keys={['clean', 'noisy']} title="Clean vs Noisy Signal Overlay" height={200} />

          {/* Dynamic analysis */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2">Dynamic Analysis</p>
            <p className="text-sm text-slate-300 leading-relaxed">{analysis}</p>
          </div>

          <ParameterTable
            title="Noise Calculations"
            rows={[
              { label: 'Signal Power',      value: signalPower,           unit: 'W' },
              { label: 'Noise Power',       value: noisePower,            unit: 'W' },
              { label: 'SNR (linear)',      value: results.snrLinear,     highlight: true },
              { label: 'SNR (dB)',          value: results.snrDB,         unit: 'dB', highlight: true },
              { label: 'Temperature',       value: temperature,           unit: 'K' },
              { label: 'Bandwidth',         value: bandwidth,             unit: 'Hz' },
              { label: 'Thermal Noise N=kTB', value: formatPower(results.thermalN) },
              { label: 'Signal Quality',    value: results.quality },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
