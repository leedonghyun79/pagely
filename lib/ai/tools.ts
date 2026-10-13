import { OpSchema, type Op } from '@/lib/site/ops'
import type { ToolCall } from './llm'

export const TOOL_NAMES = [
  'update_section',
  'add_section',
  'remove_section',
  'move_section',
  'change_variant',
  'update_design_tokens',
  'update_page_seo',
] as const

/** 툴 호출을 Zod로 검증해 Op로 변환한다. 이름이나 인자가 잘못되면 throw. */
export function toOp(call: ToolCall): Op {
  if (!(TOOL_NAMES as readonly string[]).includes(call.name)) {
    throw new Error(`알 수 없는 툴: ${call.name}`)
  }
  const args = typeof call.args === 'object' && call.args !== null ? call.args : {}
  return OpSchema.parse({ op: call.name, ...args })
}

export function toOps(calls: ToolCall[]): Op[] {
  return calls.map(toOp)
}
