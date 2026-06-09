# 📡 Complete Analog Communication System Simulator

**Interactive Analog Communication System Simulator for AM, FM, Noise, Spectrum and Receiver Analysis**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 Objective

A fully client-side, interactive engineering simulation tool that visualizes and analyzes core **Analog Communication** concepts in one integrated dashboard. Designed for students, educators, and engineers who need a hands-on, formula-accurate tool that bridges textbook theory and practical system design.

---

## ✨ Features

| Module | What it does |
|--------|-------------|
| **AM Simulator** | DSB-TC modulation, envelope detection, overmodulation warning, power & efficiency |
| **FM Simulator** | Frequency modulation, Carson bandwidth, narrowband/wideband classification |
| **Noise Analyzer** | SNR, thermal noise (kTB), signal quality classification with presets |
| **Spectrum Analyzer** | Conceptual AM & FM frequency-domain spectral line viewer |
| **Receiver Planner** | Superheterodyne LO & image frequency calculator |
| **AM vs FM Comparison** | Side-by-side waveforms, bandwidth chart and comparison table |
| **About Page** | Concepts, tech stack, real-world relevance, future scope |

---

## 🛠 Tech Stack

- **React 18** — Component-based UI
- **Vite 5** — Lightning-fast dev server and build
- **Tailwind CSS 3** — Utility-first dark engineering theme
- **Recharts** — Waveform and spectrum charts
- **React Router 6** — Client-side SPA routing
- **Lucide React** — Crisp SVG icons

> ⚡ Fully client-side — no backend, no server, no API keys required.

---

## 🔄 Communication System Flow

```
Source        Message Signal   Modulator     Channel        Receiver       Output
(Audio)  →   m(t)=Am·sin(·)  →  AM/FM    →  + AWGN Noise  →  Demod    →  Recovered m(t)
```

---

## 📐 Formulas Used

### Amplitude Modulation (AM)
```
m(t) = Am · sin(2π·fm·t)
c(t) = Ac · sin(2π·fc·t)
sAM(t) = Ac · [1 + μ · sin(2π·fm·t)] · sin(2π·fc·t)
μ = Am / Ac                (modulation index)
BW_AM = 2·fm               (bandwidth)
Pc = Ac² / (2R)            (carrier power)
Pt = Pc · (1 + μ²/2)       (total power)
η  = μ² / (2 + μ²)         (power efficiency)
```

### Frequency Modulation (FM)
```
sFM(t) = Ac · sin(2π·fc·t + β · sin(2π·fm·t))
β = Δf / fm                (FM modulation index)
BW_FM = 2·(Δf + fm)        (Carson's rule)
β < 1  → Narrowband FM
β ≥ 1  → Wideband FM
```

### Noise Analysis
```
SNR = Signal Power / Noise Power
SNR_dB = 10 · log₁₀(SNR)
N = k · T · B              (thermal noise power)
k = 1.38 × 10⁻²³ J/K
```

### Superheterodyne Receiver
```
High-side injection:  fLO = fs + IF,  fimage = fs + 2·IF
Low-side  injection:  fLO = fs − IF,  fimage = |fs − 2·IF|
```

---

## 📁 Project Structure

```
complete-analog-communication-simulator/
│
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── README.md
├── .gitignore
│
├── public/
│   ├── favicon.svg
│   └── screenshots/
│
└── src/
    ├── App.jsx             ← Root component + routing
    ├── main.jsx            ← React entry point
    ├── index.css           ← Tailwind + custom styles
    │
    ├── components/
    │   ├── Header.jsx          ← Responsive nav bar
    │   ├── SidebarControls.jsx ← Slider controls
    │   ├── SignalChart.jsx      ← Recharts time-domain chart
    │   ├── SpectrumChart.jsx    ← Recharts bar spectrum chart
    │   ├── ComparisonChart.jsx  ← AM vs FM bar chart
    │   ├── ResultCard.jsx       ← Metric display card
    │   ├── QualityBadge.jsx     ← Colored status badge
    │   ├── SystemFlow.jsx       ← Pipeline flow diagram
    │   ├── ParameterTable.jsx   ← Parameter/result table
    │   └── FormulaCard.jsx      ← Collapsible formula panel
    │
    ├── pages/
    │   ├── Dashboard.jsx        ← Landing page + navigation
    │   ├── AMSimulator.jsx      ← Full AM simulation
    │   ├── FMSimulator.jsx      ← Full FM simulation
    │   ├── NoiseAnalyzer.jsx    ← SNR + noise analysis
    │   ├── SpectrumAnalyzer.jsx ← Frequency spectrum viewer
    │   ├── ReceiverPlanner.jsx  ← Superheterodyne planner
    │   ├── Comparison.jsx       ← AM vs FM comparison
    │   └── About.jsx            ← Project info page
    │
    ├── utils/
    │   ├── signalUtils.js       ← Core signal generation
    │   ├── amUtils.js           ← AM formulas & waveforms
    │   ├── fmUtils.js           ← FM formulas & waveforms
    │   ├── noiseUtils.js        ← SNR & thermal noise
    │   ├── spectrumUtils.js     ← Spectral line data
    │   ├── receiverUtils.js     ← Superheterodyne calcs
    │   └── calculationUtils.js  ← Generic math helpers
    │
    └── data/
        └── projectInfo.js       ← Project metadata
```

---

## 🚀 Installation & Running Locally

### Prerequisites
- Node.js ≥ 18
- npm ≥ 8

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/complete-analog-communication-simulator.git
cd complete-analog-communication-simulator

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# → Opens at http://localhost:5173

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

---

## 📸 Screenshots

> Add screenshots to `public/screenshots/` and reference them here.

| Dashboard | AM Simulator | FM Simulator |
|-----------|-------------|-------------|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

| Noise Analyzer | Spectrum Analyzer | Receiver Planner |
|---------------|------------------|-----------------|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

---

## 🔭 Future Scope

- [ ] DSB-SC (Double-Sideband Suppressed Carrier) simulation
- [ ] SSB (Single Sideband) simulation
- [ ] VSB (Vestigial Sideband) concept analyzer
- [ ] Real audio input modulation
- [ ] FFT-based real spectrum analysis using Web Audio API
- [ ] FM discriminator / demodulator
- [ ] Advanced envelope detector simulation
- [ ] Downloadable PDF report generation

---

## 👥 Team Members

| Name | Role |
|------|------|
| *(Add team member)* | Frontend + Signal Processing |
| *(Add team member)* | UI Design + Documentation |

---

## 📜 License

MIT License — free to use for educational purposes.

---

> **Note:** This project covers Analog Communication only.
> Digital modulation schemes (ASK, FSK, PSK, QAM, OFDM) are out of scope.
