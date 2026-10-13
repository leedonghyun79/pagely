import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSite } from '@/lib/db'
import { buildJsonLd } from '@/lib/site/seo'
import { renderSection, tokenStyle } from '@/components/sections/registry'
import { PreviewBridge } from '@/components/editor/PreviewBridge'

export const dynamic = 'force-dynamic'

type Params = Promise<{ siteId: string; route?: string[] }>

function load(siteId: string, route?: string[]) {
  const site = getSite(siteId)
  const path = '/' + (route ?? []).join('/')
  const page = site?.pages.find((p) => p.route === path)
  return { site, page }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ siteId: string; route?: string[] }>
}): Promise<Metadata> {
  const { siteId, route } = await params
  const { page } = load(siteId, route)
  if (!page) return {}
  return {
    title: page.title,
    description: page.seo.description,
    robots: page.seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: page.title,
      description: page.seo.description,
      images: page.seo.ogImage ? [page.seo.ogImage] : undefined,
    },
  }
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: Promise<{ edit?: string }>
}) {
  const { siteId, route } = await params
  const { edit } = await searchParams
  const { site, page } = load(siteId, route)
  if (!site || !page) notFound()

  const base = `/preview/${site.id}`
  return (
    <div style={tokenStyle(site.tokens)} className="min-h-screen">
      {buildJsonLd(site).map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <header
        className="flex items-center justify-between border-b px-6 py-4"
        style={{ borderColor: 'color-mix(in srgb, var(--o-text) 12%, transparent)' }}
      >
        <a href={base} className="font-bold">
          {site.name}
        </a>
        <nav className="flex gap-5 text-sm">
          {site.pages.map((p) => (
            <a key={p.route} href={p.route === '/' ? base : base + p.route}>
              {p.route === '/'
                ? '홈'
                : p.title.replace(site.name, '').replace(/^[\s-]+/, '') || p.route}
            </a>
          ))}
        </nav>
      </header>
      <main>{page.sections.map((s) => renderSection(s, base))}</main>
      <footer className="px-6 py-10 text-center text-sm opacity-60">© {site.name}</footer>
      {edit === '1' && <PreviewBridge />}
    </div>
  )
}
