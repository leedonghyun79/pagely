import { z } from 'zod'
import { handle, type RouteCtx } from '@/lib/api'
import { commitOps, getSite } from '@/lib/db'
import { MockLlmClient } from '@/lib/ai/mock'
import { runChat } from '@/lib/ai/run'

const BodySchema = z.object({
  message: z.string().trim().min(1).max(500),
  selectedSectionId: z.string().optional(),
})

// 실제 모델 연동 시 이 한 줄만 교체한다.
const llm = new MockLlmClient()

export const POST = (req: Request, { params }: RouteCtx) =>
  handle(async () => {
    const { id } = await params
    const { message, selectedSectionId } = BodySchema.parse(await req.json())
    const site = getSite(id)
    if (!site) throw new Error('사이트를 찾을 수 없어')

    const result = await runChat(site, message, { selectedSectionId }, llm)
    if (!result.changed) return { text: result.text, changed: false, site }

    const { site: next, revision } = commitOps(id, result.ops, 'ai', result.text)
    return { text: result.text, changed: true, site: next, revisionId: revision.id }
  })
