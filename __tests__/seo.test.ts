import { describe, it, expect } from 'vitest'
import { createDraft } from '@/lib/site/draft'
import { applyOps } from '@/lib/site/ops'
import { buildJsonLd, buildRobots, buildSitemap } from '@/lib/site/seo'

const site = createDraft({ name: '은혜교회', industry: 'church', tone: 'warm' })

describe('seo', () => {
  it('sitemap은 noindex 페이지를 제외한다', () => {
    const hidden = applyOps(site, [{ op: 'update_page_seo', route: '/contact', noindex: true }])
    const xml = buildSitemap(hidden, 'https://x.test')
    expect(xml).toContain('https://x.test/about')
    expect(xml).not.toContain('https://x.test/contact')
  })

  it('robots에 Sitemap 줄이 있다', () => {
    expect(buildRobots('https://x.test')).toContain('Sitemap: https://x.test/sitemap.xml')
  })

  it('JSON-LD에 Organization과 FAQPage가 있다', () => {
    const types = buildJsonLd(site).map((o) => (o as { '@type': string })['@type'])
    expect(types).toEqual(['Organization', 'FAQPage'])
  })
})
