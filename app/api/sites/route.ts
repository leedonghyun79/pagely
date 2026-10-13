import { z } from 'zod'
import { handle } from '@/lib/api'
import { listSites, saveSite } from '@/lib/db'
import { createDraft } from '@/lib/site/draft'
import { parseIdea } from '@/lib/site/idea'

const BriefSchema = z.object({
  name: z.string().trim().min(1).max(60),
  industry: z.enum(['church', 'cafe', 'agency', 'generic']),
  tone: z.enum(['warm', 'modern', 'classic']),
})

const IdeaSchema = z.object({ idea: z.string().trim().min(2).max(500) })

export const dynamic = 'force-dynamic'

export const GET = () => handle(() => listSites())

export const POST = (req: Request) =>
  handle(async () => {
    const body = await req.json()
    const brief = body && typeof body === 'object' && 'idea' in body ? parseIdea(IdeaSchema.parse(body).idea) : BriefSchema.parse(body)
    const site = createDraft(brief)
    saveSite(site)
    return site
  })
