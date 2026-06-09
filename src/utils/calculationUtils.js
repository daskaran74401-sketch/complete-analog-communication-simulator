/**
 * calculationUtils.js
 * Generic math helpers and cross-module utilities.
 */

/** Convert linear power ratio to dB */
export const linTodB = (ratio) => 10 * Math.log10(ratio)

/** Convert dB to linear power ratio */
export const dBtoLin = (dB) => Math.pow(10, dB / 10)

/** Round to N significant figures */
export const sigFig = (val, n = 4) => parseFloat(val.toPrecision(n))

/** Format a frequency nicely (Hz / kHz / MHz) */
export function formatFreq(hz) {
  if (hz >= 1e6) return `${(hz / 1e6).toFixed(3)} MHz`
  if (hz >= 1e3) return `${(hz / 1e3).toFixed(3)} kHz`
  return `${hz.toFixed(2)} Hz`
}

/** Format power */
export function formatPower(w) {
  if (w < 1e-9) return `${(w * 1e12).toFixed(2)} pW`
  if (w < 1e-6) return `${(w * 1e9).toFixed(2)} nW`
  if (w < 1e-3) return `${(w * 1e6).toFixed(2)} µW`
  if (w < 1)    return `${(w * 1e3).toFixed(2)} mW`
  return `${w.toFixed(4)} W`
}

/** Clamp value between min and max */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

/**
 * Export parameter set as JSON and trigger browser download.
 */
export function downloadJSON(data, filename = 'parameters.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Export waveform data as CSV and trigger browser download.
 * @param {Object[]} chartData  – array of { t, ...signals }
 * @param {string}   filename
 */
export function downloadCSV(chartData, filename = 'waveform.csv') {
  if (!chartData || chartData.length === 0) return
  const headers = Object.keys(chartData[0]).join(',')
  const rows    = chartData.map(row => Object.values(row).join(','))
  const csv     = [headers, ...rows].join('\n')
  const blob    = new Blob([csv], { type: 'text/csv' })
  const url     = URL.createObjectURL(blob)
  const a       = document.createElement('a')
  a.href        = url
  a.download    = filename
  a.click()
  URL.revokeObjectURL(url)
}
