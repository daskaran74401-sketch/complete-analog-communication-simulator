import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Radio, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',           label: 'Dashboard'  },
  { to: '/am',         label: 'AM'         },
  { to: '/fm',         label: 'FM'         },
  { to: '/noise',      label: 'Noise'      },
  { to: '/spectrum',   label: 'Spectrum'   },
  { to: '/receiver',   label: 'Receiver'   },
  { to: '/comparison', label: 'AM vs FM'   },
  { to: '/about',      label: 'About'      },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const linkCls = ({ isActive }) =>
    `text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-150 ` +
    (isActive
      ? 'bg-cyan-400/15 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
      : 'text-slate-400 hover:text-white hover:bg-white/8')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16
                        bg-[#080f24]/90 backdrop-blur border-b border-white/8">
      <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-400/15 border border-cyan-400/30
                          flex items-center justify-center">
            <Radio size={17} className="text-cyan-400" />
          </div>
          <span className="hidden sm:block font-semibold text-sm text-white leading-tight">
            Analog Comm<br />
            <span className="text-cyan-400 font-normal text-xs">Simulator</span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkCls}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/8"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#0d1b3e]/95
                        border-b border-white/8 backdrop-blur-md px-4 py-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={linkCls}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
