import type { ReactNode } from 'react'

export default function Pullquote({ children }: { children: ReactNode }) {
  return <div className="pullquote">{children}</div>
}
