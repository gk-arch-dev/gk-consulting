'use client'

import { useEffect, useRef } from 'react'

function getAriaLabel(theme: string | null) {
  return theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
}

export default function ThemeToggle() {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const current = document.documentElement.getAttribute('data-theme')
    ref.current.setAttribute('aria-label', getAriaLabel(current))
  }, [])

  const toggle = () => {
    const current = document.documentElement.getAttribute('data-theme')
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    if (ref.current) {
      ref.current.setAttribute('aria-label', getAriaLabel(next))
    }
    try {
      localStorage.setItem('gk-theme', next)
    } catch {}
  }

  return (
    <button
      ref={ref}
      className="theme-toggle"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      <svg
        className="moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg
        className="sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  )
}
