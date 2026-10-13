import type { SectionProps } from './util'

export function Faq({ section }: SectionProps<'faq'>) {
  const { title, items } = section.props
  const two = section.variant === 'two-column'
  return (
    <section
      data-section-id={section.id}
      className="px-6 py-16"
      style={{ background: 'var(--o-bg)' }}
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>
        {two ? (
          <dl className="grid gap-6 md:grid-cols-2">
            {items.map((it, i) => (
              <div key={i}>
                <dt className="font-semibold">{it.q}</dt>
                <dd className="mt-1 text-sm opacity-70">{it.a}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((it, i) => (
              <details
                key={i}
                className="border bg-white/70 px-5 py-4"
                style={{
                  borderRadius: 'var(--o-radius)',
                  borderColor: 'color-mix(in srgb, var(--o-text) 12%, transparent)',
                }}
              >
                <summary className="cursor-pointer font-semibold">{it.q}</summary>
                <p className="mt-2 text-sm opacity-70">{it.a}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
