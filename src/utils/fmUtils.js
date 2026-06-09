/**
 * fmUtils.js
 * Frequency Modulation signal generation and parameter calculations.
 */
import {
  timeAxis, messageSignal, carrierSignal,
  deterministicNoise, addNoise, buildChartData
} from './signalUtils'

/**
 * Generate all FM waveforms and chart datasets.
 */
export function generateFMSignals({ Am, Ac, fm, fc, deltaF, noiseLevel, duration, points }) {
  const t    = timeAxis(duration, points)
  const beta = deltaF / fm                         // FM modulation index

  const msg     = messageSignal(t, Am, fm)
  const carrier = carrierSignal(t, Ac, fc)
  // FM: s(t) = Ac · sin(2π·fc·t + β·sin(2π·fm·t))
  const fmSig   = t.map((ti) => Ac * Math.sin(2 * Math.PI * fc * ti + beta * Math.sin(2 * Math.PI * fm * ti)))
  const noise   = deterministicNoise(points, noiseLevel, 99)
  const noisyFM = addNoise(fmSig, noise)

  const chartData = buildChartData(t, { msg, carrier, fmSig, noisyFM })
  return { t, beta, msg, carrier, fmSig, noisyFM, chartData }
}

/**
 * Calculate FM parameters.
 */
export function calcFMParams({ fm, fc, deltaF }) {
  const beta  = deltaF / fm
  const bw    = 2 * (deltaF + fm)            // Carson's rule
  const type  = beta < 1 ? 'Narrowband FM' : 'Wideband FM'
  const typeColor = beta < 1 ? 'info' : 'purple'

  return {
    beta:       +beta.toFixed(4),
    bw:         +bw.toFixed(2),
    deltaF:     +deltaF.toFixed(2),
    type,
    typeColor
  }
}

/**
 * Dynamic analysis text for the FM page.
 */
export function fmAnalysis({ beta, bw, deltaF, fm, type }) {
  return `FM modulation index β = Δf/fm = ${deltaF}/${fm} = ${beta.toFixed(3)}. ` +
    `This classifies as ${type} (${beta < 1 ? 'β < 1' : 'β ≥ 1'}). ` +
    `By Carson's Rule, BW = 2(Δf + fm) = 2(${deltaF} + ${fm}) = ${bw.toFixed(1)} Hz. ` +
    (beta >= 1
      ? `Wideband FM offers superior noise immunity because the discriminator provides a 3β² SNR improvement over AM for the same carrier power.`
      : `Narrowband FM has bandwidth comparable to AM but still benefits from the FM capture effect in high-noise environments.`)
}
