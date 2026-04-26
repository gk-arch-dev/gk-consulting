import type { ReactNode } from 'react'

export default function Note({ children }: { children: ReactNode }) {
  return (
    <div className="callout">
      <span className="callout-label">Note</span>
      <div>{children}</div>
    </div>
  )
}
