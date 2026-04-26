'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isCaseStudies =
    pathname === '/case-studies' || pathname.startsWith('/case-studies/')
  const isBlog = pathname === '/blog' || pathname.startsWith('/blog/')

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav
        className={`nav${scrolled ? ' scrolled' : ''}`}
        aria-label="Primary navigation"
      >
        <div className="nav-inner">
          <Link href="/" className="logo" aria-label="GK Consulting — home">
            GK Consulting
            <span className="logo-mark">/gk</span>
          </Link>

          <ul className="nav-links">
            <li>
              <Link href="/#about">about</Link>
            </li>
            <li>
              <Link href="/#services">services</Link>
            </li>
            <li>
              <Link
                href="/case-studies"
                className={isCaseStudies ? 'current' : undefined}
              >
                case_studies
              </Link>
            </li>
            <li>
              <Link href="/blog" className={isBlog ? 'current' : undefined}>
                blog
              </Link>
            </li>
            <li>
              <Link href="/#contact">contact</Link>
            </li>
          </ul>

          <div className="nav-actions">
            <ThemeToggle />
            <Link href="/#contact" className="btn-book">
              book_a_call
            </Link>
            <button
              ref={hamburgerRef}
              className="menu-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  )
}
