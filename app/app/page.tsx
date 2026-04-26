import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import CaseStudies from '@/components/sections/CaseStudies'
import BlogPreview from '@/components/sections/BlogPreview'
import Contact from '@/components/sections/Contact'
import Reveals from '@/components/Reveals'

export const metadata: Metadata = {
  title: 'GK Consulting — Java & AWS Architect for European Companies',
  description:
    'Java & AWS architect helping European engineering leaders design, build, and modernize backend systems on AWS. Solutions Architect Professional. Based in EU.',
}

export default function Home() {
  return (
    <main>
      <Reveals />
      <Hero />
      <About />
      <Services />
      <CaseStudies />
      <BlogPreview />
      <Contact />
    </main>
  )
}
