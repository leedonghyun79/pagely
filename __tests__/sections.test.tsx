import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { createDraft } from '@/lib/site/draft'
import { renderSection } from '@/components/sections/registry'
import { SECTION_VARIANTS, type Section } from '@/lib/schema/section'

const sample = createDraft({ name: '테스트', industry: 'cafe', tone: 'modern' })
const byType = new Map(sample.pages.flatMap((p) => p.sections).map((s) => [s.type, s]))

describe('sections', () => {
  for (const [type, variants] of Object.entries(SECTION_VARIANTS)) {
    for (const variant of variants) {
      it(`${type}/${variant}가 렌더되고 data-section-id가 붙는다`, () => {
        const base = byType.get(type as Section['type'])!
        const section = { ...base, variant } as Section
        const { container } = render(<>{renderSection(section, '/preview/x')}</>)
        expect(container.querySelector(`[data-section-id="${section.id}"]`)).not.toBeNull()
      })
    }
  }

  it('내부 링크에 프리뷰 base가 붙는다', () => {
    const hero = sample.pages[0].sections[0]
    const { container } = render(<>{renderSection(hero, '/preview/x')}</>)
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/preview/x/contact')
  })
})
