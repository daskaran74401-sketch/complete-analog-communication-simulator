/**
 * spectrumUtils.js
 * Frequency spectrum data generation for AM and FM signals (conceptual bar/line view).
 */

/**
 * Build AM spectrum spectral lines.
 * AM has: carrier at fc, and two sidebands at fc ± fm.
 * Amplitudes: carrier = Ac, sidebands = μ·Ac/2 each.
 */
export function amSpectrumData({ Ac, Am, fc, fm }) {
  const mu = Am / Ac
  const sb = (mu * Ac) / 2          // sideband amplitude

  return [
    { freq: fc - fm, label: `fc−fm\n${fc - fm} Hz`, amplitude: +sb.toFixed(3),  type: 'sideband', name: 'LSB' },
    { freq: fc,      label: `fc\n${fc} Hz`,          amplitude: +Ac.toFixed(3),  type: 'carrier',  name: 'Carrier' },
    { freq: fc + fm, label: `fc+fm\n${fc + fm} Hz`,  amplitude: +sb.toFixed(3),  type: 'sideband', name: 'USB' },
  ]
}

/**
 * Build FM spectrum spectral lines (approximate Bessel-function weights for first 3 orders).
 * We use simplified normalized amplitudes J₀, J₁, J₂, J₃ for β.
 */
export function fmSpectrumData({ Ac, fc, fm, deltaF }) {
  const beta = deltaF / fm

  // Approximate Bessel values J_n(β) – simple polynomial approx valid for 0 < β < 5
  function besselApprox(n, b) {
    // Use series expansion truncated at n=0..3 for visualization
    if (b === 0) return n === 0 ? 1 : 0
    // Simple cos/sin approximation for display purposes
    const x = b
    if (n === 0) return Math.cos(x * 0.9)
    if (n === 1) return x / 2 * (1 - x * x / 8 + x * x * x * x / 192)
    if (n === 2) return (x * x / 8) * (1 - x * x / 12)
    if (n === 3) return (x * x * x / 48) * (1 - x * x / 10)
    return 0
  }

  const lines = []
  const orders = [0, 1, 2, 3]
  orders.forEach(n => {
    const amp = Math.abs(besselApprox(n, beta)) * Ac
    if (n === 0) {
      lines.push({ freq: fc, label: `fc\n${fc}Hz`, amplitude: +amp.toFixed(3), type: 'carrier', name: `J₀(β)` })
    } else {
      // Symmetric sidebands
      lines.push({ freq: fc - n * fm, label: `fc−${n}fm\n${fc - n * fm}Hz`, amplitude: +amp.toFixed(3), type: 'sideband', name: `−J${n}` })
      lines.push({ freq: fc + n * fm, label: `fc+${n}fm\n${fc + n * fm}Hz`, amplitude: +amp.toFixed(3), type: 'sideband', name: `+J${n}` })
    }
  })

  // Sort by frequency
  lines.sort((a, b) => a.freq - b.freq)
  return lines
}

/**
 * Dynamic analysis text for spectrum page.
 */
export function spectrumAnalysis({ fc, fm, Ac, Am, deltaF }) {
  const mu   = Am / Ac
  const amBW = 2 * fm
  const fmBW = 2 * (deltaF + fm)
  const beta = deltaF / fm

  return `AM spectrum: carrier at ${fc} Hz flanked by two sidebands at ${fc - fm} Hz and ${fc + fm} Hz. ` +
    `AM bandwidth = 2·fm = ${amBW} Hz. Modulation index μ = ${mu.toFixed(3)}. ` +
    `FM spectrum: carrier at ${fc} Hz with multiple sideband pairs spaced ${fm} Hz apart (Bessel functions J_n(β=${beta.toFixed(2)})). ` +
    `FM Carson bandwidth = 2(Δf + fm) = ${fmBW} Hz — ${(fmBW / amBW).toFixed(1)}× wider than AM. ` +
    `The extra bandwidth is the price FM pays for its superior noise immunity.`
}
