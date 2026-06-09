/**
 * noiseUtils.js
 * Noise analysis utilities for analog communication systems.
 */
import { timeAxis, deterministicNoise, buildChartData } from './signalUtils'

const K_BOLTZMANN = 1.38e-23   // J/K

/**
 * Generate clean signal, noise, and noisy signal for display.
 */
export function generateNoiseSignals({ signalPower, noiseLevel, duration = 1, points = 800 }) {
  const t          = timeAxis(duration, points)
  const amplitude  = Math.sqrt(2 * signalPower)           // peak = √(2P) for sinusoid into 1Ω
  const clean      = t.map(ti => amplitude * Math.sin(2 * Math.PI * 5 * ti))
  const noiseArr   = deterministicNoise(points, noiseLevel * amplitude * 2, 77)
  const noisy      = clean.map((v, i) => v + noiseArr[i])

  const chartData  = buildChartData(t, { clean, noise: noiseArr, noisy })
  return { t, clean, noiseArr, noisy, chartData }
}

/**
 * Calculate SNR and noise parameters.
 */
export function calcNoiseParams({ signalPower, noisePower, temperature, bandwidth }) {
  const snrLinear  = signalPower / noisePower
  const snrDB      = 10 * Math.log10(snrLinear)
  const thermalN   = K_BOLTZMANN * temperature * bandwidth   // thermal noise power (W)
  const thermalNdBm = 10 * Math.log10(thermalN / 1e-3)       // in dBm

  let quality, qualityColor
  if      (snrDB >= 20) { quality = 'Excellent';             qualityColor = 'success' }
  else if (snrDB >= 10) { quality = 'Good';                  qualityColor = 'info'    }
  else if (snrDB >= 3 ) { quality = 'Weak / Noisy';          qualityColor = 'warning' }
  else                  { quality = 'Poor / Highly Distorted'; qualityColor = 'danger'}

  return {
    snrLinear:   +snrLinear.toFixed(3),
    snrDB:       +snrDB.toFixed(2),
    thermalN:    thermalN,
    thermalNdBm: +thermalNdBm.toFixed(2),
    quality,
    qualityColor
  }
}

/** Noise presets */
export const NOISE_PRESETS = {
  low:    { noisePower: 0.1, noiseLevel: 0.05, label: 'Low Noise'    },
  medium: { noisePower: 1,   noiseLevel: 0.20, label: 'Medium Noise' },
  high:   { noisePower: 10,  noiseLevel: 0.60, label: 'High Noise'   },
}

/**
 * Dynamic analysis text.
 */
export function noiseAnalysis({ snrDB, snrLinear, quality, thermalNdBm }) {
  return `SNR = ${snrLinear.toFixed(1)} (linear) = ${snrDB.toFixed(1)} dB. ` +
    `Signal quality is classified as "${quality}". ` +
    `Thermal noise floor at given temperature and bandwidth is ${thermalNdBm.toFixed(1)} dBm. ` +
    (snrDB >= 20
      ? `At this SNR level, the recovered signal is virtually indistinguishable from the original.`
      : snrDB >= 10
      ? `SNR is acceptable for voice communication; some distortion may be noticeable.`
      : snrDB >= 3
      ? `The signal is heavily masked by noise — FM's discriminator would outperform AM at this level.`
      : `At SNR < 3 dB the signal is buried in noise. FM's capture effect provides a decisive advantage over AM.`)
}
