import type { SectionProps } from './util'

export function Testimonials({ section }: SectionProps<'testimonials'>) {
  const { title, items } = section.props
  const quote = section.variant === 'quote'
  return (
    <section
      data-section-id={section.id}
      className="px-6 py-16"
      style={{ background: 'var(--o-bg)' }}
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-3xl font-bold">{title}</h2>
        <div
          className={quote ? 'mx-auto flex max-w-2xl flex-col gap-8' : 'grid gap-5 md:grid-cols-2'}
        >
          {items.map((it, i) =>
            quote ? (
              <blockquote
                key={i}
                className="border-l-4 pl-5"
                style={{ borderColor: 'var(--o-primary)' }}
              >
                <p className="text-lg">“{it.quote}”</p>
                <footer className="mt-2 text-sm opacity-60">{it.name}</footer>
              </blockquote>
            ) : (
              <figure
                key={i}
                className="border bg-white/70 p-6"
                style={{
                  borderRadius: 'var(--o-radius)',
                  borderColor: 'color-mix(in srgb, var(--o-text) 12%, transparent)',
                }}
              >
                <blockquote className="text-sm">“{it.quote}”</blockquote>
                <figcaption className="mt-3 text-sm font-semibold">{it.name}</figcaption>
              </figure>
            )
          )}
        </div>
      </div>
    </section>
  )
}
