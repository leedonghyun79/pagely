import { describe, it, expect } from 'vitest'
import { createDraft } from '@/lib/site/draft'
import { SiteSchema } from '@/lib/schema/site'

describe('createDraft', () => {
  it.each(['church', 'cafe', 'agency', 'generic'] as const)('%s 초안이 스키마를 통과한다', (industry) => {
    const site = createDraft({ name: '테스트', industry, tone: 'modern' })
    expect(SiteSchema.safeParse(site).success).toBe(true)
    expect(site.pages.map((p) => p.route)).toEqual(['/', '/about', '/contact'])
    expect(site.pages[0].sections[0].type).toBe('hero')
  })

  it('섹션 id가 사이트 안에서 유일하다', () => {
    const site = createDraft({ name: '테스트', industry: 'church', tone: 'warm' })
    const ids = site.pages.flatMap((p) => p.sections.map((s) => s.id))
    expect(new Set(ids).size).toBe(ids.length)
  })
})
