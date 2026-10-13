import { notFound } from 'next/navigation'
import { getSite } from '@/lib/db'
import { EditorShell } from '@/components/editor/EditorShell'

export const dynamic = 'force-dynamic'

export default async function EditorPage({ params }: { params: Promise<{ siteId: string }> }) {
  const site = getSite((await params).siteId)
  if (!site) notFound()
  return <EditorShell initialSite={site} />
}
