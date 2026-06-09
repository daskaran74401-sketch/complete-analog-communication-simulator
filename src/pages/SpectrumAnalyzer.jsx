import React, { useState, useMemo } from 'react'
import SidebarControls, { SliderRow } from '../components/SidebarControls'
import SpectrumChart from '../components/SpectrumChart'
import ResultCard from '../components/ResultCard'
import FormulaCard from '../components/FormulaCard'
import ParameterTable from '../components/ParameterTable'
import { amSpectrumData, fmSpectrumData, spectrumAnalysis } from '../utils/spectrumUtils'

export default function SpectrumAnalyzer() {
  const [Am,    setAm]    = useState(1)
  const [Ac,    setAc]    = useState(2)
  const [fm,    setFm]    = useState(5)
  const [fc,    setFc]    = useState(50)
  const [deltaF,setDeltaF]= useState(25)

  const amData   = useMemo(() => amSpectrumData({ Ac, Am, fc, fm }), [Ac, Am, fc, fm])
  const fmData   = useMemo(() => fmSpectrumData({ Ac, fc, fm, deltaF }), [Ac, fc, fm, deltaF])
  const analysis = useMemo(() => spectrumAnalysis({ fc, fm, Ac, Am, deltaF }), [fc, fm, Ac, Am, deltaF])

  const amBW = 2 * fm
  const fmBW = 2 * (deltaF + fm)
  const beta = (deltaF / fm).toFixed(3)

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-white">Spectrum Analyzer</h1>
        <p className="text-sm text-slate-400 mt-1">Frequency-domain spectral component visualization for AM and FM signals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <SidebarControls title="Signal Parameters">
            <SliderRow label="Message Amplitude Am" value={Am} min={0.1} max={5} step={0.1} unit=" V" onChange={setAm} />
            <SliderRow label="Carrier Amplitude Ac" value={Ac} min={0.5} max={5} step={0.1} unit=" V" onChange={setAc} />
            <SliderRow label="Message Frequency fm" value={fm} min={1} max={30} step={1} unit=" Hz" onChange={setFm} />
            <SliderRow label="Carrier Frequency fc" value={fc} min={20} max={300} step={5} unit=" Hz" onChange={setFc} />
            <SliderRow label="FM Deviation Δf" value={deltaF} min={1} max={100} step={1} unit=" Hz" onChange={setDeltaF} />
          </SidebarControls>

          <FormulaCard
            title="Spectrum Formulas"
            formulas={[
              `AM: Carrier at fc = ${fc} Hz`,
              `AM: LSB at fc−fm = ${fc - fm} Hz`,
              `AM: USB at fc+fm = ${fc + fm} Hz`,
              `AM BW = 2·fm = ${amBW} Hz`,
              `FM: fc ± n·fm  (n=0,1,2,3...)`,
              `FM BW = 2(Δf+fm) = ${fmBW} Hz`,
              `FM β = Δf/fm = ${beta}`,
            ]}
            variables={[
              { sym: 'fc', desc: 'Carrier frequency' },
              { sym: 'fm', desc: 'Message frequency' },
              { sym: 'Δf', desc: 'FM frequency deviation' },
              { sym: 'Jn(β)', desc: 'Bessel function (FM sideband amplitude)' },
            ]}
          />
        </div>

        {/* Main content */}
        <div className="space-y-5">
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label="AM Bandwidth"   value={amBW}    unit="Hz" accent />
            <ResultCard label="FM Bandwidth"   value={fmBW}    unit="Hz" accent />
            <ResultCard label="FM Index β"     value={beta} />
            <ResultCard label="BW Ratio FM/AM" value={(fmBW / amBW).toFixed(2)} unit="×" />
          </div>

          {/* AM spectrum */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-1">AM Frequency Spectrum</h3>
            <p className="text-xs text-slate-500 mb-4">
              AM has exactly 3 spectral lines: carrier at fc and two sidebands at fc ± fm.
              Only the sidebands carry information.
            </p>
            <SpectrumChart data={amData} title="AM Spectral Components" />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              {amData.map((d, i) => (
                <div key={i} className="bg-white/4 rounded-lg p-2">
                  <p className="text-slate-400">{d.name}</p>
                  <p className="font-mono text-cyan-400 font-semibold">{d.freq} Hz</p>
                  <p className="text-slate-500">A = {d.amplitude}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FM spectrum */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-1">FM Frequency Spectrum</h3>
            <p className="text-xs text-slate-500 mb-4">
              FM has infinite sidebands (Bessel function weights J_n(β)). The first 3 orders are shown.
              Sideband amplitudes depend on modulation index β = {beta}.
            </p>
            <SpectrumChart data={fmData} title="FM Spectral Components (Bessel Approx.)" />
          </div>

          {/* Comparison table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ParameterTable
              title="AM Spectral Lines"
              rows={amData.map(d => ({
                label: d.name,
                value: `${d.freq} Hz`,
                unit: `A=${d.amplitude}`
              }))}
            />
            <ParameterTable
              title="FM Bandwidth Summary"
              rows={[
                { label: 'Carrier fc',      value: fc,    unit: 'Hz' },
                { label: 'fm',              value: fm,    unit: 'Hz' },
                { label: 'Δf',              value: deltaF,unit: 'Hz' },
                { label: 'β = Δf/fm',       value: beta,  highlight: true },
                { label: 'FM BW (Carson)',   value: fmBW,  unit: 'Hz', highlight: true },
                { label: 'AM BW',           value: amBW,  unit: 'Hz' },
                { label: 'FM/AM BW ratio',  value: (fmBW/amBW).toFixed(2), unit: '×' },
              ]}
            />
          </div>

          {/* Dynamic analysis */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2">Spectrum Analysis</p>
            <p className="text-sm text-slate-300 leading-relaxed">{analysis}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
