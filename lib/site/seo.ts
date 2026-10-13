import type { Site } from '@/lib/schema/site'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function buildSitemap(site: Site, origin: string): string {
  const urls = site.pages
    .filter((p) => !p.seo.noindex)
    .map((p) => `  <url><loc>${esc(origin + p.route)}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function buildRobots(origin: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
}

export function buildJsonLd(site: Site): object[] {
  const out: object[] = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: site.name },
  ]
  const faqs = site.pages.flatMap((p) =>
    p.sections.flatMap((s) => (s.type === 'faq' ? s.props.items : []))
  )
  if (faqs.length > 0) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  return out
}
