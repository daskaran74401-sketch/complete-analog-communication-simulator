/**
 * receiverUtils.js
 * Superheterodyne receiver frequency planning calculations.
 */

/**
 * Calculate receiver frequencies given fs, IF and injection type.
 * @param {number} fs          – received signal frequency (Hz)
 * @param {number} IF          – intermediate frequency (Hz)
 * @param {'high'|'low'} injection
 */
export function calcReceiverFreqs({ fs, IF, injection }) {
  let fLO, fImage

  if (injection === 'high') {
    fLO    = fs + IF
    fImage = fs + 2 * IF
  } else {
    fLO    = fs - IF
    fImage = Math.abs(fs - 2 * IF)
  }

  const imageRatio = fImage / fs
  let warning = null

  if (fLO <= 0)    warning = 'Local oscillator frequency is non-positive. Increase fs or reduce IF.'
  if (fImage <= 0) warning = 'Image frequency is non-positive. Check your parameters.'
  if (Math.abs(fImage - fs) < IF * 0.5)
    warning = `⚠ Image frequency (${fImage.toFixed(1)} Hz) is close to signal frequency. Image rejection may be insufficient.`
  if (IF <= 0)     warning = 'Intermediate frequency must be positive.'

  return {
    fs:        +fs.toFixed(2),
    IF:        +IF.toFixed(2),
    fLO:       +fLO.toFixed(2),
    fImage:    +fImage.toFixed(2),
    injection,
    imageRatio: +imageRatio.toFixed(3),
    warning,
    valid: !warning || warning.startsWith('⚠')
  }
}

/**
 * Dynamic analysis text.
 */
export function receiverAnalysis({ fs, IF, fLO, fImage, injection, warning }) {
  const side = injection === 'high' ? 'high-side' : 'low-side'
  return `${side.charAt(0).toUpperCase() + side.slice(1)} injection: ` +
    `LO at ${fLO.toFixed(1)} Hz mixes with RF signal at ${fs.toFixed(1)} Hz ` +
    `to produce IF = ${IF.toFixed(1)} Hz. ` +
    `Image frequency = ${fImage.toFixed(1)} Hz must be rejected by the RF pre-selector filter ` +
    `before the mixer to prevent interference. ` +
    (warning
      ? warning
      : `The image frequency is sufficiently separated from the desired signal — ` +
        `standard RF bandpass filter provides adequate image rejection.`)
}
