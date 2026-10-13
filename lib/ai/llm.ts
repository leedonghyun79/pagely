import type { Site } from '@/lib/schema/site'

export interface ToolCall {
  name: string
  args: unknown
}

export interface LlmInput {
  message: string
  site: Site
  selectedSectionId?: string
  /** 이전 툴 호출이 검증에 실패했을 때 붙는 에러 (1회 재시도용) */
  previousError?: string
}

export interface LlmOutput {
  text: string
  toolCalls: ToolCall[]
}

/** 모델 호출 자리. 실제 Claude 연동은 이 인터페이스 구현체만 교체한다. */
export interface LlmClient {
  complete(input: LlmInput): Promise<LlmOutput>
}
