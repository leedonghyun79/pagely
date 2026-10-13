import { applyOps, type Op } from '@/lib/site/ops'
import type { Site } from '@/lib/schema/site'
import type { LlmClient } from './llm'
import { toOps } from './tools'

export interface ChatResult {
  site: Site
  ops: Op[]
  text: string
  changed: boolean
}

/** 메시지 → 모델 → 툴 호출 검증(실패 시 1회 재시도) → 패치 적용. */
export async function runChat(
  site: Site,
  message: string,
  ctx: { selectedSectionId?: string },
  llm: LlmClient
): Promise<ChatResult> {
  let previousError: string | undefined
  for (let attempt = 0; attempt < 2; attempt++) {
    const out = await llm.complete({
      message,
      site,
      selectedSectionId: ctx.selectedSectionId,
      previousError,
    })
    if (out.toolCalls.length === 0) return { site, ops: [], text: out.text, changed: false }
    try {
      const ops = toOps(out.toolCalls)
      const next = applyOps(site, ops)
      return { site: next, ops, text: out.text, changed: true }
    } catch (e) {
      previousError = e instanceof Error ? e.message : String(e)
    }
  }
  return { site, ops: [], text: `수정에 실패했어: ${previousError}`, changed: false }
}
