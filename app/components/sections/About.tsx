import type { IconType } from 'react-icons'
import {
  SiOpenjdk, SiKotlin, SiSpringboot, SiHibernate, SiTypescript,
  SiReact, SiPython, SiDocker, SiTerraform, SiSpring,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa6'
import {
  LuDatabase, LuDatabaseZap, LuRefreshCw, LuCpu, LuHardDrive,
  LuSend, LuNetwork, LuShieldCheck, LuActivity, LuBlocks,
} from 'react-icons/lu'

const STACK: { name: string; Icon: IconType }[] = [
  { name: 'Java', Icon: SiOpenjdk },
  { name: 'Kotlin', Icon: SiKotlin },
  { name: 'Spring Boot', Icon: SiSpringboot },
  { name: 'AWS', Icon: FaAws },
  { name: 'TypeScript', Icon: SiTypescript },
  { name: 'React', Icon: SiReact },
  { name: 'Python', Icon: SiPython },
  { name: 'SQL', Icon: LuDatabase },
  { name: 'Hibernate', Icon: SiHibernate },
  { name: 'DynamoDB', Icon: LuDatabaseZap },
  { name: 'Docker', Icon: SiDocker },
  { name: 'Terraform', Icon: SiTerraform },
  { name: 'CI/CD', Icon: LuRefreshCw },
]

const AWS_CATEGORIES: { label: string; Icon: IconType; items: string[] }[] = [
  { label: 'Compute', Icon: LuCpu, items: ['Lambda', 'EC2', 'ECS'] },
  { label: 'Storage', Icon: LuHardDrive, items: ['S3', 'EFS', 'EBS'] },
  { label: 'Database', Icon: LuDatabase, items: ['RDS', 'DynamoDB'] },
  { label: 'Messaging & events', Icon: LuSend, items: ['SQS', 'SNS', 'Kinesis', 'EventBridge'] },
  { label: 'Networking', Icon: LuNetwork, items: ['CloudFront', 'API Gateway', 'VPC', 'Route 53', 'ELB'] },
  { label: 'Security & identity', Icon: LuShieldCheck, items: ['IAM', 'Cognito', 'Secrets Manager', 'KMS'] },
  { label: 'Observability & ops', Icon: LuActivity, items: ['CloudWatch', 'CloudTrail', 'SSM'] },
  { label: 'Infra as code', Icon: LuBlocks, items: ['CloudFormation', 'CDK'] },
]

const SPRING_ITEMS = [
  'Boot', 'Cloud', 'Security', 'Data', 'JPA',
  'MVC', 'WebFlux', 'AOP', 'Integration', 'Retry',
]

export default function About() {
  return (
    <section className="section" id="about">
      <div className="spine">
        <div className="section-head reveal">
          <span className="section-num">01.</span>
          <span className="section-label">About</span>
        </div>

        <div className="about-intro reveal">
          <div className="portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/picture.jpg"
              alt="Grzegorz Karolak — Java and AWS architect"
              width={88}
              height={104}
            />
          </div>
          <div>
            <div className="portrait-meta">Grzegorz Karolak</div>
            <div className="portrait-name">AWS Solutions Architect &amp; Full-Stack Engineer</div>
            <div className="portrait-role">
              GK Consulting &middot; Poland &middot; Serving clients across Europe
            </div>
          </div>
        </div>

        <div className="prose reveal">
          <p>
            I&apos;m <strong>Grzegorz Karolak</strong>, an AWS-certified{' '}
            <strong>Solutions Architect (Professional)</strong> and full-stack
            engineer, focused on <strong>Java</strong>. Based in Poland, I work
            with clients across Europe. You work with me directly — no project manager
            translating between you and a team in a different time zone, no junior
            swap-out partway through. Engagements range from focused architecture reviews to multi-month
            end-to-end builds where I write code, lead the team, and ship the system.
            I scope to what you need, not to fill a calendar. It&apos;s the right shape when continuity of ownership
            matters more than team size — and I&apos;ll tell you up front when it
            isn&apos;t.
          </p>
          <p>
            The proof: AWS Solutions Architect Professional and Associate
            certifications. A PHP-to-Kotlin migration for a German real-estate
            platform, an
            IoT backend over gRPC and MQTT for a Swiss power-grid operator, a
            portfolio management modernization for a Swiss financial institution, and a
            medical-device companion platform for a UK medtech startup. Production
            systems, not pilots.
          </p>
          <blockquote className="pullquote">
            I don&apos;t just draw diagrams. I design, build, and ship working
            systems — pragmatic, business-focused, AI in the workflow.
          </blockquote>
          <p>
            My deepest experience is with{' '}
            <strong>AWS, Kotlin, Java, and Spring</strong> — that&apos;s where
            most of my production work has lived. But I&apos;m a full-stack
            engineer: comfortable with React and TypeScript front-ends,
            infrastructure-as-code, and CI/CD pipelines, and ready to reach for
            a different language when it&apos;s the right call. <strong>AI</strong>{' '}
            is part of how I work now — Claude Code and similar tooling earn
            their place with faster scaffolding, tighter review loops, and more
            time on the work that needs judgment. Used well, it speeds the
            typing, not the thinking. The architecture and the decisions are
            still mine.
          </p>
        </div>

        <div className="aws-badges reveal" aria-label="AWS Certifications">
          <span className="aws-badges-label">Verified Credentials</span>
          <span className="aws-badges-meta">EU-based &middot; GDPR-aligned</span>
          <div className="aws-badges-row">
            <a
              href="https://www.credly.com/badges/d2d48f47-4b91-4a27-bcfc-668fa325bffc/public_url"
              className="aws-badge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View AWS Solutions Architect Professional certification on Credly"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/aws-sap.png"
                alt="AWS Certified Solutions Architect – Professional badge"
                width={64}
                height={64}
              />
              <span className="aws-badge-text">
                <span className="aws-badge-eyebrow">AWS Certified</span>
                <span className="aws-badge-name-row">
                  <span className="aws-badge-name">Solutions Architect</span>
                  <span className="aws-badge-tier aws-badge-tier--pro">Professional</span>
                </span>
                <span className="aws-badge-link">Verify on Credly →</span>
              </span>
            </a>
            <a
              href="https://www.credly.com/badges/45327add-e316-45c3-a80c-c83afe333222/linked_in_profile"
              className="aws-badge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View AWS Solutions Architect Associate certification on Credly"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/aws-saa.png"
                alt="AWS Certified Solutions Architect – Associate badge"
                width={64}
                height={64}
              />
              <span className="aws-badge-text">
                <span className="aws-badge-eyebrow">AWS Certified</span>
                <span className="aws-badge-name-row">
                  <span className="aws-badge-name">Solutions Architect</span>
                  <span className="aws-badge-tier aws-badge-tier--assoc">Associate</span>
                </span>
                <span className="aws-badge-link">Verify on Credly →</span>
              </span>
            </a>
          </div>
        </div>

        <div className="tech-strip reveal">
          <span className="tech-strip-label">Working stack</span>
          <div className="tech-tags">
            {STACK.map(({ name, Icon }) => (
              <span key={name} className="tag">
                <Icon className="tag-icon" aria-hidden="true" />
                {name}
              </span>
            ))}
          </div>
          <div className="depth-block">
            <div className="depth-head">
              <FaAws className="depth-logo" aria-hidden="true" />
              <span className="depth-title">AWS</span>
            </div>
            <div className="depth-cats">
              {AWS_CATEGORIES.map(({ label, Icon, items }) => (
                <div key={label} className="depth-cat">
                  <span className="depth-cat-label">
                    <Icon className="depth-cat-icon" aria-hidden="true" />
                    {label}
                  </span>
                  <div className="depth-chips">
                    {items.map((s) => (
                      <span key={s} className="chip">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="depth-block">
            <div className="depth-head">
              <SiSpring className="depth-logo" aria-hidden="true" />
              <span className="depth-title">Spring</span>
            </div>
            <div className="depth-chips">
              {SPRING_ITEMS.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
