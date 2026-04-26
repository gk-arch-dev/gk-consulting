'use client'

import Link from 'next/link'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <div
      id="mobile-menu"
      className={`mobile-menu${open ? ' open' : ''}`}
      aria-hidden={!open}
    >
      <div className="mobile-menu-header">
        <span className="mobile-menu-label">Menu</span>
        <button
          className="mobile-menu-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <Link href="/#about" onClick={onClose}>
        about
      </Link>
      <Link href="/#services" onClick={onClose}>
        services
      </Link>
      <Link href="/case-studies" onClick={onClose}>
        case_studies
      </Link>
      <Link href="/blog" onClick={onClose}>
        blog
      </Link>
      <Link href="/#contact" onClick={onClose}>
        contact
      </Link>
      <Link href="/#contact" className="btn-book" onClick={onClose}>
        book_a_call
      </Link>
    </div>
  )
}
