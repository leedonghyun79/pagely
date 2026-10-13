/**
 * 예시 테스트 — 패턴 참고용. 실제 기능 테스트로 교체하세요.
 *
 * 패턴:
 * - 컴포넌트: @testing-library/react의 render + userEvent
 * - 스토어:   renderHook으로 Zustand 훅 직접 테스트
 * - 유틸:     순수 함수 단위 테스트
 */

import { describe, it, expect } from 'vitest'

describe('예시', () => {
  it('true는 true다', () => {
    expect(true).toBe(true)
  })

  it('배열 합산', () => {
    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
    expect(sum([1, 2, 3])).toBe(6)
  })
})
