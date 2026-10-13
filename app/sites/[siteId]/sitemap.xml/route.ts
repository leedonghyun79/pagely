import { getSite } from '@/lib/db'
import { buildSitemap } from '@/lib/site/seo'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params
  const site = getSite(siteId)
  if (!site) return new Response('Not found', { status: 404 })
  const origin = `${new URL(req.url).origin}/preview/${site.id}`
  return new Response(buildSitemap(site, origin), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
