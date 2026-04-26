import { useEffect } from 'react'

export function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const siblings = el.parentElement?.querySelectorAll<HTMLElement>('.reveal')
          const idx = siblings ? Array.from(siblings).indexOf(el) : 0
          el.style.transitionDelay = `${Math.min(idx * 0.06, 0.3)}s`
          el.classList.add('visible')
          io.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    elements.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
