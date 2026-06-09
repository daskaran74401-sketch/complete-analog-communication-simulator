/**
 * signalUtils.js
 * Core time-domain signal generation helpers.
 * All functions return Float64Array or plain JS arrays of sample values.
 */

/**
 * Generate a uniformly-spaced time axis.
 * @param {number} duration  – seconds
 * @param {number} points    – number of samples
 * @returns {number[]} time array
 */
export function timeAxis(duration, points) {
  const dt = duration / (points - 1)
  return Array.from({ length: points }, (_, i) => i * dt)
}

/**
 * Sinusoidal message signal: m(t) = Am · sin(2π·fm·t)
 */
export function messageSignal(t, Am, fm) {
  return t.map(ti => Am * Math.sin(2 * Math.PI * fm * ti))
}

/**
 * Sinusoidal carrier signal: c(t) = Ac · sin(2π·fc·t)
 */
export function carrierSignal(t, Ac, fc) {
  return t.map(ti => Ac * Math.sin(2 * Math.PI * fc * ti))
}

/**
 * Deterministic pseudo-random noise using a simple LCG seeded by seed.
 * Produces reproducible noise so charts don't jitter on every render.
 * @param {number} length  – number of samples
 * @param {number} level   – noise amplitude (0–1)
 * @param {number} seed    – integer seed (default 42)
 */
export function deterministicNoise(length, level, seed = 42) {
  const noise = new Array(length)
  let state = seed >>> 0
  for (let i = 0; i < length; i++) {
    // LCG parameters (Numerical Recipes)
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    noise[i] = (state / 0xffffffff - 0.5) * 2 * level
  }
  return noise
}

/**
 * Add noise to a signal sample by sample.
 */
export function addNoise(signal, noiseArray) {
  return signal.map((v, i) => v + noiseArray[i])
}

/**
 * Simple moving-average smoothing (approximates a low-pass filter).
 * @param {number[]} arr   – input array
 * @param {number}   win   – window half-width (integer)
 */
export function movingAverage(arr, win = 5) {
  const out = new Array(arr.length)
  for (let i = 0; i < arr.length; i++) {
    let sum = 0, count = 0
    for (let j = Math.max(0, i - win); j <= Math.min(arr.length - 1, i + win); j++) {
      sum += arr[j]; count++
    }
    out[i] = sum / count
  }
  return out
}

/**
 * Downsample an array to at most maxPoints using uniform stride.
 * Avoids sending 1000+ points to Recharts unnecessarily.
 */
export function downsample(arr, maxPoints = 400) {
  if (arr.length <= maxPoints) return arr
  const step = arr.length / maxPoints
  return Array.from({ length: maxPoints }, (_, i) => arr[Math.round(i * step)])
}

/**
 * Build a Recharts-compatible dataset from multiple signal arrays.
 * @param {number[]}    t        – time axis
 * @param {Object}      signals  – { key: values[] }
 * @param {number}      maxPts   – downsample target
 * @returns {{ t: number, ...signals }[]}
 */
export function buildChartData(t, signals, maxPts = 400) {
  const stride = t.length > maxPts ? Math.ceil(t.length / maxPts) : 1
  const out = []
  for (let i = 0; i < t.length; i += stride) {
    const point = { t: parseFloat(t[i].toFixed(4)) }
    for (const [key, arr] of Object.entries(signals)) {
      point[key] = parseFloat((arr[i] ?? 0).toFixed(5))
    }
    out.push(point)
  }
  return out
}
