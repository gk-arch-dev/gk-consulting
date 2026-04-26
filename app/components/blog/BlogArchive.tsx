'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { BlogPost, TagInfo } from '@/lib/content'

const TAG_DISPLAY: Record<string, string> = {
  modernization: 'Legacy Modernization',
  aws: 'AWS',
  architecture: 'Architecture',
  kotlin: 'Kotlin & JVM',
  serverless: 'Serverless',
  practices: 'Practices',
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${y} · ${m} · ${d}`
}

interface Props {
  posts: BlogPost[]
  tags: TagInfo[]
}

export default function BlogArchive({ posts, tags }: Props) {
  const [active, setActive] = useState('all')

  const visible = active === 'all' ? posts : posts.filter((p) => p.tags.includes(active))

  return (
    <>
      <section className="spine filters">
        <span className="filters-label">Filter by topic</span>
        <div className="filter-pills" role="group" aria-label="Topic filter">
          <button
            className={`filter-pill${active === 'all' ? ' active' : ''}`}
            onClick={() => setActive('all')}
          >
            All <span className="filter-count">{posts.length}</span>
          </button>
          {tags.map((t) => (
            <button
              key={t.slug}
              className={`filter-pill${active === t.slug ? ' active' : ''}`}
              onClick={() => setActive(t.slug)}
            >
              {t.tag} <span className="filter-count">{t.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="spine archive">
        <ul className="entry-list">
          {posts.map((post) => {
            const hidden = active !== 'all' && !post.tags.includes(active)
            return (
              <li key={post.slug} className={hidden ? 'hidden' : ''}>
                <Link href={`/blog/${post.slug}/`} className="entry">
                  <span className="entry-date">{formatDate(post.date)}</span>
                  <span className="entry-text">
                    <span className="entry-title">{post.title}</span>
                    <span className="entry-thesis">{post.thesis}</span>
                    <span className="entry-tags">
                      {post.tags.map((t) => (
                        <span key={t} className="entry-tag">
                          {TAG_DISPLAY[t] ?? t}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="entry-meta">
                    <span>{post.readTime}</span>
                    <span className="entry-arrow">→</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        {visible.length === 0 && (
          <div className="empty-state visible">
            No posts in this topic yet — that&apos;s a hint about what to write next.
          </div>
        )}
      </section>
    </>
  )
}
