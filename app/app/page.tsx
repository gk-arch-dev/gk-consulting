import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import CaseStudies from '@/components/sections/CaseStudies'
import BlogPreview from '@/components/sections/BlogPreview'
import Contact from '@/components/sections/Contact'
import Reveals from '@/components/Reveals'
import JsonLd from '@/components/JsonLd'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gk-consulting.eu'

export const metadata: Metadata = {
  title: {
    absolute: 'GK Consulting — Java & AWS Architect for European Companies',
  },
  description:
    'Java & AWS architect helping European engineering leaders design, build, and modernize backend systems on AWS. Solutions Architect Professional. Based in EU.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'GK Consulting — Java & AWS Architect for European Companies',
    url: '/',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Grzegorz Karolak',
      givenName: 'Grzegorz',
      familyName: 'Karolak',
      jobTitle: 'Principal Architect & Founder',
      description:
        'Java & AWS architect specializing in backend systems, cloud-native migrations, and AWS serverless architecture.',
      url: `${SITE_URL}/`,
      email: 'hello@gk-consulting.eu',
      worksFor: { '@id': `${SITE_URL}/#service` },
      knowsAbout: [
        'Java', 'Kotlin', 'Spring Boot',
        'AWS', 'Amazon Web Services', 'AWS Lambda', 'AWS CDK',
        'Cloud Architecture', 'Serverless Architecture', 'Event-Driven Architecture',
        'Legacy Modernization', 'Strangler Fig Pattern',
        'Microservices', 'CQRS', 'DynamoDB', 'PostgreSQL',
        'TypeScript', 'React', 'Terraform', 'Docker',
      ],
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          name: 'AWS Certified Solutions Architect – Professional',
          credentialCategory: 'certification',
          recognizedBy: { '@type': 'Organization', name: 'Amazon Web Services' },
        },
        {
          '@type': 'EducationalOccupationalCredential',
          name: 'AWS Certified Solutions Architect – Associate',
          credentialCategory: 'certification',
          recognizedBy: { '@type': 'Organization', name: 'Amazon Web Services' },
        },
      ],
      address: { '@type': 'PostalAddress', addressCountry: 'PL' },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: 'GK Consulting',
      alternateName: 'GK Consulting — Java & AWS Architecture',
      description:
        'Independent consulting practice providing Java & AWS architecture, legacy modernization, and embedded tech leadership to European engineering teams.',
      url: `${SITE_URL}/`,
      email: 'hello@gk-consulting.eu',
      founder: { '@id': `${SITE_URL}/#person` },
      areaServed: [
        { '@type': 'Place', name: 'European Union' },
        { '@type': 'Place', name: 'Germany' },
        { '@type': 'Place', name: 'Austria' },
        { '@type': 'Place', name: 'Switzerland' },
      ],
      serviceType: [
        'Cloud Architecture Consulting',
        'AWS Architecture',
        'Legacy System Modernization',
        'Cloud Migration',
        'Embedded Tech Lead',
        'Backend Architecture',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'GK Consulting',
      description: 'Java & AWS architecture consulting for European companies.',
      publisher: { '@id': `${SITE_URL}/#service` },
      inLanguage: 'en',
    },
  ],
}

export default function Home() {
  return (
    <main>
      <JsonLd data={jsonLd} />
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
