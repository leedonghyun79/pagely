import { describe, it, expect } from 'vitest'
import { createDraft } from '@/lib/site/draft'
import { toOp } from '@/lib/ai/tools'
import { runChat } from '@/lib/ai/run'
import { MockLlmClient } from '@/lib/ai/mock'
import type { LlmClient } from '@/lib/ai/llm'

const site = createDraft({ name: '은혜교회', industry: 'church', tone: 'warm' })
const llm = new MockLlmClient()

describe('toOp', () => {
  it('유효한 인자는 Op로 변환한다', () => {
    const hero = site.pages[0].sections[0]
    const op = toOp({
      name: 'update_section',
      args: { route: '/', sectionId: hero.id, props: { title: 'x' } },
    })
    expect(op.op).toBe('update_section')
  })

  it('잘못된 인자와 알 수 없는 툴은 throw한다', () => {
    expect(() => toOp({ name: 'update_section', args: { route: '/' } })).toThrow()
    expect(() => toOp({ name: 'drop_database', args: {} })).toThrow()
  })
})

describe('runChat', () => {
  it('"히어로 문구 더 짧게"는 hero title을 줄인다', async () => {
    const before = (site.pages[0].sections[0].props as { title: string }).title
    const r = await runChat(site, '히어로 문구 더 짧게', {}, llm)
    const after = (r.site.pages[0].sections[0].props as { title: string }).title
    expect(r.changed).toBe(true)
    expect(after.length).toBeLessThan(before.length)
  })

  it('선택한 섹션을 대상으로 한다', async () => {
    const features = site.pages[0].sections[1]
    const r = await runChat(site, '레이아웃 바꿔줘', { selectedSectionId: features.id }, llm)
    expect(r.site.pages[0].sections[1].variant).toBe('list')
  })

  it('FAQ 추가는 섹션 수를 늘린다', async () => {
    const r = await runChat(site, 'FAQ 추가해줘', {}, llm)
    expect(r.site.pages[0].sections.length).toBe(site.pages[0].sections.length + 1)
  })

  it('알 수 없는 요청은 변경 없이 안내한다', async () => {
    const r = await runChat(site, '오늘 날씨 어때', {}, llm)
    expect(r.changed).toBe(false)
    expect(r.site).toBe(site)
  })

  it('검증 실패 시 1회 재시도하고, 계속 실패하면 변경하지 않는다', async () => {
    let calls = 0
    const bad: LlmClient = {
      async complete({ previousError }) {
        calls++
        if (calls === 2) expect(previousError).toBeTruthy()
        return { text: '', toolCalls: [{ name: 'update_section', args: { route: '/' } }] }
      },
    }
    const r = await runChat(site, 'x', {}, bad)
    expect(calls).toBe(2)
    expect(r.changed).toBe(false)
  })
})
