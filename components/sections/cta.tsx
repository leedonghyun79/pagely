import { resolveHref, type SectionProps } from './util'

export function Cta({ section, base }: SectionProps<'cta'>) {
  const { title, body, button } = section.props
  const card = section.variant === 'card'
  return (
    <section data-section-id={section.id} className="px-6 py-16" style={{ background: 'var(--o-bg)' }}>
      <div
        className={`mx-auto max-w-4xl px-8 py-12 text-center ${card ? 'border bg-white/70' : 'text-white'}`}
        style={{
          borderRadius: 'var(--o-radius)',
          background: card ? undefined : 'var(--o-primary)',
          borderColor: card ? 'color-mix(in srgb, var(--o-text) 12%, transparent)' : undefined,
        }}
      >
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
        {body && <p className="mt-3 opacity-80">{body}</p>}
        <a
          href={resolveHref(base, button.href)}
          className="mt-6 inline-block px-6 py-3 text-sm font-semibold"
          style={{
            borderRadius: 'var(--o-radius)',
            background: card ? 'var(--o-primary)' : '#fff',
            color: card ? '#fff' : 'var(--o-primary)',
          }}
        >
          {button.label}
        </a>
      </div>
    </section>
  )
}
