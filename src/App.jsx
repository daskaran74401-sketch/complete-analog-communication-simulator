import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import AMSimulator from './pages/AMSimulator'
import FMSimulator from './pages/FMSimulator'
import NoiseAnalyzer from './pages/NoiseAnalyzer'
import SpectrumAnalyzer from './pages/SpectrumAnalyzer'
import ReceiverPlanner from './pages/ReceiverPlanner'
import Comparison from './pages/Comparison'
import About from './pages/About'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#080f24] bg-grid text-white">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/am"          element={<AMSimulator />} />
            <Route path="/fm"          element={<FMSimulator />} />
            <Route path="/noise"       element={<NoiseAnalyzer />} />
            <Route path="/spectrum"    element={<SpectrumAnalyzer />} />
            <Route path="/receiver"    element={<ReceiverPlanner />} />
            <Route path="/comparison"  element={<Comparison />} />
            <Route path="/about"       element={<About />} />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
