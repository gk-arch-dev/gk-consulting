import Link from 'next/link'

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="spine">
        <div className="section-head reveal">
          <span className="section-num">02.</span>
          <span className="section-label">Services</span>
        </div>
        <h2 className="reveal">How we work together.</h2>
        <p className="section-lede reveal">
          Every engagement starts with a free conversation — a call or just a
          message — to scope the work. Tell me what you&apos;re dealing with and
          I&apos;ll tell you straight whether I can help, and how.{' '}
          <Link href="/#contact">Get in touch →</Link>
        </p>

        <div className="service reveal">
          <div className="service-num">
            <span className="service-numeral">01 /</span>
            <span className="service-num-label">Review</span>
          </div>
          <h3>AWS Architecture &amp; Cost Review</h3>
          <p>
            You want to know whether your AWS setup is sound — cost, security,
            architecture — and what to fix first. I run a structured review
            against the Well-Architected framework and hand back a prioritized
            list of findings, with the cost wins called out.
          </p>
          <div className="service-deliverables">
            <span>Well-Architected review</span>
            <span>Prioritized findings</span>
            <span>Cost-optimization wins</span>
            <span>Read-out call</span>
          </div>
        </div>

        <div className="service reveal">
          <div className="service-num">
            <span className="service-numeral">02 /</span>
            <span className="service-num-label">Modernization</span>
          </div>
          <h3>Legacy Migration &amp; Modernization</h3>
          <p>
            Your monolith works but it&apos;s slowing you down. I lead incremental
            migrations to cloud-native architectures using the Strangler Fig pattern —
            shipping features the whole way through. No big-bang rewrites. No unnecessary
            risk.
          </p>
          <div className="service-deliverables">
            <span>Migration roadmap with risks scored</span>
            <span>Parallel-run strategy</span>
            <span>Team upskilling included</span>
            <span>Production rollout &amp; sign-off</span>
          </div>
        </div>

        <div className="service reveal">
          <div className="service-num">
            <span className="service-numeral">03 /</span>
            <span className="service-num-label">Greenfield</span>
          </div>
          <h3>Architecture &amp; Design</h3>
          <p>
            You have a new product to build and you want an architecture that won&apos;t
            need a rewrite in 18 months. I design the system end-to-end — service
            boundaries, data model, AWS infrastructure, CI/CD — then help your team build
            it, or build it myself.
          </p>
          <div className="service-deliverables">
            <span>Architecture decision records</span>
            <span>AWS account structure</span>
            <span>IaC scaffolding (CDK / Terraform)</span>
            <span>Hands-on implementation</span>
          </div>
        </div>

        <div className="service reveal">
          <div className="service-num">
            <span className="service-numeral">04 /</span>
            <span className="service-num-label">Advisory</span>
          </div>
          <h3>Fractional Architect</h3>
          <p>
            You don&apos;t need a full-time architect, but you need a senior one your
            team can check decisions against. On a light retainer, I run design and PR
            reviews and pressure-test the big calls — a senior brain on call, without
            the headcount.
          </p>
          <div className="service-deliverables">
            <span>Monthly retainer</span>
            <span>Design &amp; PR reviews</span>
            <span>Architecture decision support</span>
            <span>Async-first scheduling</span>
          </div>
        </div>

        <div className="tech-strip reveal">
          <span className="tech-strip-label">Working stack</span>
          <div className="tech-tags">
            {[
              'Java', 'Kotlin', 'Spring Boot', 'AWS', 'TypeScript',
              'React', 'Python', 'SQL', 'DynamoDB', 'Docker', 'Terraform', 'CI/CD',
            ].map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <div className="tech-aws-line">
            <span className="tech-aws-label">AWS depth</span>
            <span className="tech-aws-items">
              SQS · SNS · RDS · Lambda · S3 · CloudFront · API Gateway · EC2 · ECS · ELB
              · VPC · Route 53 · DynamoDB · EFS · EBS · Kinesis · EventBridge ·
              CloudFormation · CloudWatch · CloudTrail · IAM · Cognito · Secrets Manager ·
              KMS · SSM · CDK
            </span>
          </div>
          <div className="tech-aws-line">
            <span className="tech-aws-label">Spring depth</span>
            <span className="tech-aws-items">
              Boot · Cloud · Security · Data · JPA · MVC · WebFlux · AOP · Integration ·
              Retry
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
