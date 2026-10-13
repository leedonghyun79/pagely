import { getSite } from '@/lib/db'
import { buildRobots } from '@/lib/site/seo'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params
  const site = getSite(siteId)
  if (!site) return new Response('Not found', { status: 404 })
  const origin = new URL(req.url).origin
  const body = buildRobots(`${origin}/sites/${site.id}`)
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
