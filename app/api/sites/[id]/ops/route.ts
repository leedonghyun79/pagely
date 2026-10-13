import { z } from 'zod'
import { handle, type RouteCtx } from '@/lib/api'
import { commitOps } from '@/lib/db'
import { OpSchema } from '@/lib/site/ops'

const BodySchema = z.object({
  ops: z.array(OpSchema).min(1),
  summary: z.string().max(200).default('직접 수정'),
})

export const POST = (req: Request, { params }: RouteCtx) =>
  handle(async () => {
    const { id } = await params
    const { ops, summary } = BodySchema.parse(await req.json())
    const { site, revision } = commitOps(id, ops, 'user', summary)
    return { site, revisionId: revision.id }
  })
