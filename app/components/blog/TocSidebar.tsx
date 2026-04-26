'use client'

import { useEffect, useState } from 'react'
import type { TocHeading } from '@/lib/toc'

interface TocTree {
  heading: TocHeading
  children: TocHeading[]
}

function buildTree(headings: TocHeading[]): TocTree[] {
  const result: TocTree[] = []
  for (const h of headings) {
    if (h.level === 2) {
      result.push({ heading: h, children: [] })
    } else if (result.length > 0) {
      result[result.length - 1].children.push(h)
    }
  }
  return result
}

export default function TocSidebar({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const ids = headings.map((h) => h.id)
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    function update() {
      const scrollY = window.scrollY + 140
      let active = sections[0]
      for (const sec of sections) {
        if (sec.offsetTop <= scrollY) active = sec
      }
      if (active) setActiveId(active.id)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [headings])

  const tree = buildTree(headings)

  return (
    <aside className="toc" aria-label="On this page">
      <span className="toc-label">On this page</span>
      <ul>
        {tree.map(({ heading, children }) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`} className={activeId === heading.id ? 'active' : ''}>
              {heading.text}
            </a>
            {children.length > 0 && (
              <ul>
                {children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      className={activeId === child.id ? 'active' : ''}
                    >
                      {child.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  )
}
