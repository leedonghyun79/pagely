import { describe, expect, it } from 'vitest'
import { parseIdea } from '@/lib/site/idea'

describe('parseIdea', () => {
  it('업종 키워드를 찾는다', () => {
    expect(parseIdea('은혜교회 소개 사이트').industry).toBe('church')
    expect(parseIdea('감성 카페 홈페이지').industry).toBe('cafe')
    expect(parseIdea('웹 에이전시 포트폴리오').industry).toBe('agency')
    expect(parseIdea('스테이셔너리 쇼핑몰').industry).toBe('generic')
  })

  it('톤 키워드를 찾고 없으면 업종 기본값을 쓴다', () => {
    expect(parseIdea('모던한 카페').tone).toBe('modern')
    expect(parseIdea('고풍스러운 클래식 교회').tone).toBe('classic')
    expect(parseIdea('따뜻한 느낌의 교회').tone).toBe('warm')
    expect(parseIdea('카페').tone).toBe('warm')
  })

  it('상호를 따옴표, "상호는", "OO교회/카페" 순으로 뽑는다', () => {
    expect(parseIdea('"달빛"이라는 카페').name).toBe('달빛')
    expect(parseIdea('상호는 해든 이고 카페야').name).toBe('해든')
    expect(parseIdea('은혜교회 홈페이지 만들어줘').name).toBe('은혜교회')
  })

  it('상호를 못 찾으면 기본 이름을 쓴다', () => {
    expect(parseIdea('피부 미용 클리닉 웹사이트').name).toBe('내 사이트')
  })

  it('상호는 60자를 넘지 않는다', () => {
    expect(parseIdea(`"${'가'.repeat(100)}" 카페`).name.length).toBeLessThanOrEqual(60)
  })
})
