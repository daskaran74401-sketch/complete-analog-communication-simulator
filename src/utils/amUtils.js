/**
 * amUtils.js
 * Amplitude Modulation signal generation and parameter calculations.
 */
import {
  timeAxis, messageSignal, carrierSignal,
  deterministicNoise, addNoise, movingAverage, buildChartData
} from './signalUtils'

/**
 * Generate all AM waveforms and derived chart datasets.
 */
export function generateAMSignals({ Am, Ac, fm, fc, noiseLevel, duration, points }) {
  const t   = timeAxis(duration, points)
  const mu  = Am / Ac                                         // modulation index

  const msg   = messageSignal(t, Am, fm)
  const carrier = carrierSignal(t, Ac, fc)
  // AM DSB-TC: s(t) = Ac[1 + μ·sin(2π·fm·t)]·sin(2π·fc·t)
  const am = t.map((ti) => Ac * (1 + mu * Math.sin(2 * Math.PI * fm * ti)) * Math.sin(2 * Math.PI * fc * ti))
  const noise  = deterministicNoise(points, noiseLevel, 42)
  const noisyAM = addNoise(am, noise)
  // Envelope detection approximation: rectify + low-pass smooth
  const rectified = noisyAM.map(v => Math.abs(v))
  const windowSize = Math.max(1, Math.floor(points / (fc * duration * 2)))
  const recovered = movingAverage(rectified, windowSize)

  const chartData = buildChartData(t, { msg, carrier, am, noisyAM, recovered })
  return { t, mu, msg, carrier, am, noisyAM, recovered, chartData }
}

/**
 * Calculate AM parameters.
 */
export function calcAMParams({ Am, Ac, fm, R = 50 }) {
  const mu   = Am / Ac
  const bw   = 2 * fm
  const Pc   = (Ac * Ac) / (2 * R)
  const Pt   = Pc * (1 + mu * mu / 2)
  const eta  = (mu * mu) / (2 + mu * mu)

  let condition, conditionColor
  if      (mu < 0.99)  { condition = 'Under Modulation';    conditionColor = 'success' }
  else if (mu <= 1.01) { condition = 'Critical Modulation'; conditionColor = 'warning' }
  else                 { condition = 'Over Modulation ⚠';   conditionColor = 'danger'  }

  return {
    mu:        +mu.toFixed(4),
    bw:        +bw.toFixed(2),
    Pc:        +Pc.toFixed(4),
    Pt:        +Pt.toFixed(4),
    eta:       +(eta * 100).toFixed(2),   // percent
    condition,
    conditionColor,
    overmod: mu > 1
  }
}

/**
 * Dynamic analysis text for the AM page.
 */
export function amAnalysis({ mu, bw, eta, condition }) {
  const muStr  = mu.toFixed(3)
  const bwStr  = bw.toFixed(1)
  const etaStr = eta.toFixed(1)
  return `With a modulation index μ = ${muStr}, the system is in ${condition} state. ` +
    `The AM signal occupies a bandwidth of ${bwStr} Hz (two sidebands at ±fm around the carrier). ` +
    `Power efficiency η = ${etaStr}% — only the sideband power carries information; ` +
    `the carrier itself is wasted power. ` +
    (mu > 1
      ? `⚠ Over-modulation (μ > 1) causes envelope crossing zero, producing severe distortion at the receiver.`
      : mu === 1
      ? `At critical modulation (μ = 1) the signal achieves maximum efficiency without distortion.`
      : `Under-modulation (μ < 1) ensures distortion-free envelope detection at the cost of lower efficiency.`)
}
