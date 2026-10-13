import { describe, it, expect } from 'vitest'
import { SectionSchema } from '@/lib/schema/section'

describe('SectionSchema', () => {
  it('hero 섹션을 통과시킨다', () => {
    const r = SectionSchema.safeParse({
      id: 'sec_1',
      type: 'hero',
      variant: 'centered',
      props: { title: '제목', subtitle: '부제', cta: [{ label: '문의', href: '/contact' }] },
    })
    expect(r.success).toBe(true)
  })

  it('알 수 없는 type은 거부한다', () => {
    const r = SectionSchema.safeParse({ id: 'x', type: 'nope', variant: 'a', props: {} })
    expect(r.success).toBe(false)
  })

  it('hero title이 없으면 거부한다', () => {
    const r = SectionSchema.safeParse({ id: 'x', type: 'hero', variant: 'centered', props: {} })
    expect(r.success).toBe(false)
  })

  it('해당 type에 없는 variant는 거부한다', () => {
    const r = SectionSchema.safeParse({
      id: 'x',
      type: 'hero',
      variant: 'grid',
      props: { title: 't' },
    })
    expect(r.success).toBe(false)
  })
})
