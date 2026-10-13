import { z } from 'zod'
import { handle, type RouteCtx } from '@/lib/api'
import { listRevisions, restoreRevision } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const GET = (_req: Request, { params }: RouteCtx) =>
  handle(async () =>
    listRevisions((await params).id).map(({ id, summary, author, createdAt }) => ({
      id,
      summary,
      author,
      createdAt,
    }))
  )

const BodySchema = z.object({ revisionId: z.string().min(1) })

export const POST = (req: Request, { params }: RouteCtx) =>
  handle(async () => {
    const { id } = await params
    const { revisionId } = BodySchema.parse(await req.json())
    const { site, revision } = restoreRevision(id, revisionId)
    return { site, revisionId: revision.id }
  })
