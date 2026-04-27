import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import { getAllBlogPosts, getBlogPost, TAG_DISPLAY } from '@/lib/content'
import { extractToc } from '@/lib/toc'
import { mdxComponents } from '@/components/mdx'
import TocSidebar from '@/components/blog/TocSidebar'
import JsonLd from '@/components/JsonLd'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gk-consulting.eu'

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      type: 'article',
      url: `/blog/${slug}/`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: ['Grzegorz Karolak'],
      tags: post.tags,
    },
    twitter: { title: post.title, description: post.description },
  }
}

function formatDate(d: string) {
  const [year, month, day] = d.split('-')
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${names[parseInt(month) - 1]} ${parseInt(day)}, ${year}`
}

function formatDateShort(d: string) {
  const [y, m, day] = d.split('-')
  return `${y} · ${m} · ${day}`
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const allPosts = getAllBlogPosts()
  const readNext = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2)
  const toc = extractToc(post.content)
  const primaryTag = post.tags[0] ? (TAG_DISPLAY[post.tags[0]] ?? post.tags[0]) : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: 'Grzegorz Karolak',
      url: `${SITE_URL}/#person`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'GK Consulting',
      url: SITE_URL,
    },
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE_URL}/blog/${post.slug}/`,
    keywords: post.tags.join(', '),
  }

  return (
    <div className="article-grid">
      <JsonLd data={jsonLd} />
      <article className="article">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">GK Consulting</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href="/blog">Blog</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{post.title}</span>
        </nav>

        {primaryTag && <span className="post-tag">{primaryTag}</span>}
        <h1 className="post-title">{post.title}</h1>
        <p className="post-thesis">{post.thesis}</p>

        <div className="post-meta">
          <span className="post-meta-author">Grzegorz Karolak</span>
          <span className="post-meta-sep">·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="post-meta-sep">·</span>
          <span>{post.readTime} read</span>
        </div>

        <div className="prose">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypePrettyCode,
                    {
                      theme: { light: 'github-light', dark: 'github-dark-dimmed' },
                    },
                  ],
                ],
              },
            }}
            components={mdxComponents}
          />
        </div>

        <div className="post-footer">
          <div className="post-author">
            <div className="post-author-avatar" aria-hidden="true">GK</div>
            <div>
              <div className="post-author-name">Grzegorz Karolak</div>
              <span className="post-author-role">
                Java &amp; AWS Architect · GK Consulting
              </span>
              <p className="post-author-bio">
                Independent consultant helping European engineering leaders modernize
                backend systems on AWS. Eighteen-month migrations, ten-week proofs of
                concept, and the architectural decisions in between.
              </p>
              <div className="post-author-links">
                <Link href="/#contact">Get in touch →</Link>
                <a
                  href="https://www.linkedin.com/in/grzegorz-karolak"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>

          {readNext.length > 0 && (
            <div className="read-next">
              <span className="read-next-label">Read next</span>
              <div className="read-next-list">
                {readNext.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}/`}
                    className="read-next-entry"
                  >
                    <span className="read-next-date">{formatDateShort(p.date)}</span>
                    <span className="read-next-title">{p.title}</span>
                    <span className="read-next-arrow">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="cta-strip">
            <div className="cta-strip-text">
              <span className="cta-strip-eyebrow">Working through a migration?</span>
              <span className="cta-strip-title">
                Let&apos;s talk about your architecture.
              </span>
            </div>
            <div className="cta-strip-actions">
              <Link href="/#contact" className="btn-primary">
                Book a 15-min call
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/blog" className="btn-ghost">
                All posts
              </Link>
            </div>
          </div>
        </div>
      </article>

      {toc.length > 0 && <TocSidebar headings={toc} />}
    </div>
  )
}
