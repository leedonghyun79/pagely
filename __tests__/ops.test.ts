import { describe, it, expect } from 'vitest'
import { applyOps } from '@/lib/site/ops'
import { createDraft } from '@/lib/site/draft'

const base = () => createDraft({ name: '은혜교회', industry: 'church', tone: 'warm' })

describe('applyOps', () => {
  it('update_section은 props를 병합하고 원본을 바꾸지 않는다', () => {
    const site = base()
    const hero = site.pages[0].sections[0]
    const next = applyOps(site, [
      { op: 'update_section', route: '/', sectionId: hero.id, props: { title: '짧은 제목' } },
    ])
    expect(next.pages[0].sections[0].props).toMatchObject({ title: '짧은 제목' })
    expect(site.pages[0].sections[0]).toEqual(hero)
  })

  it('잘못된 props는 throw한다', () => {
    const site = base()
    const hero = site.pages[0].sections[0]
    expect(() =>
      applyOps(site, [
        { op: 'update_section', route: '/', sectionId: hero.id, props: { title: '' } },
      ])
    ).toThrow()
  })

  it('없는 sectionId는 throw한다', () => {
    expect(() =>
      applyOps(base(), [{ op: 'remove_section', route: '/', sectionId: 'nope' }])
    ).toThrow()
  })

  it('remove / move / change_variant / tokens / seo', () => {
    const site = base()
    const [a, b] = site.pages[0].sections
    const moved = applyOps(site, [{ op: 'move_section', route: '/', sectionId: b.id, toIndex: 0 }])
    expect(moved.pages[0].sections[0].id).toBe(b.id)

    const removed = applyOps(site, [{ op: 'remove_section', route: '/', sectionId: a.id }])
    expect(removed.pages[0].sections.find((s) => s.id === a.id)).toBeUndefined()

    const variant = applyOps(site, [
      { op: 'change_variant', route: '/', sectionId: a.id, variant: 'split' },
    ])
    expect(variant.pages[0].sections[0].variant).toBe('split')
    expect(() =>
      applyOps(site, [{ op: 'change_variant', route: '/', sectionId: a.id, variant: 'bogus' }])
    ).toThrow()

    const t = applyOps(site, [{ op: 'update_design_tokens', tokens: { primary: '#112233' } }])
    expect(t.tokens.primary).toBe('#112233')

    const seo = applyOps(site, [
      { op: 'update_page_seo', route: '/', title: '새 제목', noindex: true },
    ])
    expect(seo.pages[0].title).toBe('새 제목')
    expect(seo.pages[0].seo.noindex).toBe(true)
  })
})
