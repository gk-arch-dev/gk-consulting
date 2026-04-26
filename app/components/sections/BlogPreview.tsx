import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/content'

function formatDate(d: string) {
  const [y, m, day] = d.split('-')
  return `${y} · ${m} · ${day}`
}

export default function BlogPreview() {
  const posts = getAllBlogPosts().slice(0, 6)

  return (
    <section className="section" id="blog">
      <div className="spine">
        <div className="section-head reveal">
          <span className="section-num">04.</span>
          <span className="section-label">Blog</span>
        </div>
        <h2 className="reveal">Notes from the field.</h2>
        <p className="section-lede reveal">
          Architecture decisions, AWS deep dives, and engineering patterns I&apos;ve seen
          in production.
        </p>

        <div className="blog-list-header reveal">
          <span className="blog-list-label">Recent</span>
        </div>
        <ul className="blog-list reveal">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}/`} className="blog-entry">
                <span className="blog-date">{formatDate(post.date)}</span>
                <span className="blog-text">
                  <h3>{post.title}</h3>
                  <span className="blog-thesis">{post.thesis}</span>
                </span>
                <span className="blog-meta">
                  <span>{post.readTime}</span>
                  <span className="blog-arrow">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/blog" className="view-all">
          All posts → archive
        </Link>
      </div>
    </section>
  )
}
