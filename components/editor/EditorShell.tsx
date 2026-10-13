'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import type { Site } from '@/lib/schema/site'
import { useEditorStore } from '@/store/editor'
import { ChatPane } from './ChatPane'
import { PreviewPane } from './PreviewPane'
import { SiteTree } from './SiteTree'

export function EditorShell({ initialSite }: { initialSite: Site }) {
  const init = useEditorStore((s) => s.init)
  const ready = useEditorStore((s) => s.site?.id === initialSite.id)

  useEffect(() => {
    init(initialSite)
  }, [init, initialSite])

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b bg-white px-4 py-2.5">
        <Link href="/" className="rounded-lg bg-primary px-2.5 py-1 text-sm font-bold text-primary-foreground">
          Pagely
        </Link>
        <span className="text-sm font-semibold">{initialSite.name}</span>
        <span className="text-xs text-muted-foreground">에디터</span>
      </header>
      {ready ? (
        <div className="flex min-h-0 flex-1">
          <SiteTree />
          <PreviewPane />
          <ChatPane />
        </div>
      ) : (
        <p className="p-6 text-sm text-muted-foreground">불러오는 중…</p>
      )}
    </div>
  )
}
