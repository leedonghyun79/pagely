import { handle, type RouteCtx } from '@/lib/api'
import { getSite } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const GET = (_req: Request, { params }: RouteCtx) =>
  handle(async () => {
    const site = getSite((await params).id)
    if (!site) throw new Error('사이트를 찾을 수 없어')
    return site
  })
