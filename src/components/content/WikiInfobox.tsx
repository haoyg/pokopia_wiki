import type { ReactNode } from 'react'
import { CreditedImage } from '@/components/media/CreditedImage'

type InfoboxImage = {
  src?: string
  alt?: string
  source?: string
  sourceUrl?: string
  licenseNote?: string
  originalMedia?: string
  rightsStatus?: string
  fallbackSrc?: string
  fallbackAlt?: string
}

type InfoboxFact = {
  label: string
  value: ReactNode
}

type WikiInfoboxProps = {
  title: string
  subtitle: string
  image: InfoboxImage
  facts: InfoboxFact[]
  footer?: ReactNode
}

export function WikiInfobox({ title, subtitle, image, facts, footer }: WikiInfoboxProps) {
  return (
    <aside className="wiki-infobox" aria-label={`${title} summary`}>
      <div className="wiki-infobox-title">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <CreditedImage
        src={image.src}
        alt={image.alt}
        source={image.source}
        sourceUrl={image.sourceUrl}
        licenseNote={image.licenseNote}
        originalMedia={image.originalMedia}
        rightsStatus={image.rightsStatus}
        fallbackSrc={image.fallbackSrc}
        fallbackAlt={image.fallbackAlt}
        className="wiki-infobox-image"
        sizes="260px"
        priority
        creditLink={false}
      />
      <dl className="wiki-infobox-facts">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      {footer && <div className="wiki-infobox-footer">{footer}</div>}
    </aside>
  )
}
