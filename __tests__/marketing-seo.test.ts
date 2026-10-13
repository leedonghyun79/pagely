import { describe, expect, it } from 'vitest'
import { buildFaqLd, buildSiteLd, serializeLd } from '@/lib/seo/marketing'

describe('marketing seo', () => {
  it('FAQPage는 입력 질문·답변을 그대로 담는다', () => {
    const ld = buildFaqLd([{ q: '질문?', a: '답변.' }])
    expect(ld['@type']).toBe('FAQPage')
    expect(ld.mainEntity[0]).toEqual({
      '@type': 'Question',
      name: '질문?',
      acceptedAnswer: { '@type': 'Answer', text: '답변.' },
    })
  })

  it('사이트 그래프는 @id로 엔티티를 한 번씩만 선언하고 서로 참조한다', () => {
    const g = buildSiteLd('https://example.com')['@graph']
    const ids = g.map((n) => n['@id'])
    expect(new Set(ids).size).toBe(ids.length)
    const site = g.find((n) => n['@type'] === 'WebSite')!
    expect(site.publisher).toEqual({ '@id': 'https://example.com/#org' })
  })

  it('직렬화 시 </script>로 탈출할 수 없다', () => {
    expect(serializeLd({ a: '</script><b>' })).not.toContain('</script>')
  })
})
