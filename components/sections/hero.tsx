import { resolveHref, type SectionProps } from './util'

export function Hero({ section, base }: SectionProps<'hero'>) {
  const { eyebrow, title, subtitle, cta } = section.props
  const split = section.variant === 'split'
  return (
    <section
      data-section-id={section.id}
      className="px-6 py-20 md:py-28"
      style={{ background: 'var(--o-bg)' }}
    >
      <div
        className={`mx-auto max-w-5xl ${split ? 'grid items-center gap-10 md:grid-cols-2' : 'text-center'}`}
      >
        <div>
          {eyebrow && (
            <p
              className="mb-3 text-sm font-semibold tracking-wide"
              style={{ color: 'var(--o-primary)' }}
            >
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl leading-tight font-bold md:text-5xl">{title}</h1>
          {subtitle && <p className="mt-4 text-lg opacity-70">{subtitle}</p>}
          {cta.length > 0 && (
            <div className={`mt-8 flex flex-wrap gap-3 ${split ? '' : 'justify-center'}`}>
              {cta.map((c, i) => (
                <a
                  key={i}
                  href={resolveHref(base, c.href)}
                  className="px-6 py-3 text-sm font-semibold text-white"
                  style={{ background: 'var(--o-primary)', borderRadius: 'var(--o-radius)' }}
                >
                  {c.label}
                </a>
              ))}
            </div>
          )}
        </div>
        {split && (
          <div
            aria-hidden
            className="aspect-[4/3] w-full"
            style={{
              background: 'color-mix(in srgb, var(--o-primary) 14%, transparent)',
              borderRadius: 'var(--o-radius)',
            }}
          />
        )}
      </div>
    </section>
  )
}
