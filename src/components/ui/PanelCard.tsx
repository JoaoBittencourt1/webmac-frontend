import type { ReactNode } from 'react'
import './PanelCard.css'

interface PanelCardProps {
  title: string
  titleId?: string
  children: ReactNode
}

export function PanelCard({ title, titleId, children }: PanelCardProps) {
  const headingId = titleId ?? 'panel-title'

  return (
    <section className="panel-card" aria-labelledby={headingId}>
      <h1 id={headingId} className="panel-card__title">
        {title}
      </h1>
      {children}
    </section>
  )
}
