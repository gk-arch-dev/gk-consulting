export default function Services() {
  return (
    <section className="section" id="services">
      <div className="spine">
        <div className="section-head reveal">
          <span className="section-num">02.</span>
          <span className="section-label">Services</span>
        </div>
        <h2 className="reveal">Three ways we work together.</h2>
        <p className="section-lede reveal">
          Every engagement starts with a scoped discovery conversation. No six-stage sales
          funnel, no signing NDAs to get a quote. Pick the shape that fits.
        </p>

        <div className="service reveal">
          <div className="service-num">
            <span className="service-numeral">01 /</span>
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
            <span className="service-num-label">Embedded</span>
          </div>
          <h3>Embedded Architect / Tech Lead</h3>
          <p>
            You need architectural leadership for the next few months. I join your team as
            a hands-on architect or tech lead — design reviews, code review, mentoring,
            CI/CD, cloud infrastructure. I can lead your existing developers or assemble a
            dedicated delivery team for you.
          </p>
          <div className="service-deliverables">
            <span>2–6 month engagements</span>
            <span>Weekly stand-ups, not daily</span>
            <span>Async-first documentation</span>
            <span>Clean handover on exit</span>
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
