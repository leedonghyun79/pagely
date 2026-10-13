import type { SectionProps } from './util'

export function Features({ section }: SectionProps<'features'>) {
  const { title, items } = section.props
  const list = section.variant === 'list'
  return (
    <section
      data-section-id={section.id}
      className="px-6 py-16"
      style={{ background: 'var(--o-bg)' }}
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-3xl font-bold">{title}</h2>
        <div
          className={list ? 'mx-auto flex max-w-2xl flex-col gap-4' : 'grid gap-5 md:grid-cols-3'}
        >
          {items.map((it, i) => (
            <div
              key={i}
              className="border bg-white/70 p-6"
              style={{
                borderRadius: 'var(--o-radius)',
                borderColor: 'color-mix(in srgb, var(--o-text) 12%, transparent)',
              }}
            >
              <h3 className="text-lg font-semibold" style={{ color: 'var(--o-primary)' }}>
                {it.title}
              </h3>
              <p className="mt-2 text-sm opacity-70">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
