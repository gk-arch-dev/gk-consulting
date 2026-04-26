import type { ReactNode } from 'react'

export default function TradeOff({ children }: { children: ReactNode }) {
  return (
    <div className="callout">
      <span className="callout-label">Trade-off</span>
      <div>{children}</div>
    </div>
  )
}
