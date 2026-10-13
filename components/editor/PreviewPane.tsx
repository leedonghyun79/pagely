'use client'

import { useCallback, useEffect, useRef } from 'react'
import { Monitor, RotateCw, Smartphone, Tablet } from 'lucide-react'
import { useEditorStore, type Device } from '@/store/editor'
import { MSG } from './PreviewBridge'

const WIDTH: Record<Device, string> = { phone: '390px', tablet: '768px', pc: '100%' }
const DEVICES: { id: Device; label: string; Icon: typeof Monitor }[] = [
  { id: 'phone', label: '폰', Icon: Smartphone },
  { id: 'tablet', label: '태블릿', Icon: Tablet },
  { id: 'pc', label: 'PC', Icon: Monitor },
]

export function PreviewPane() {
  const {
    site,
    route,
    device,
    editMode,
    previewVersion,
    selectedSectionId,
    setRoute,
    setDevice,
    refresh,
    select,
  } = useEditorStore()
  const frame = useRef<HTMLIFrameElement>(null)
  const highlight = useCallback(() => {
    frame.current?.contentWindow?.postMessage(
      { type: MSG.highlight, id: selectedSectionId },
      window.location.origin
    )
  }, [selectedSectionId])

  useEffect(() => {
    highlight()
  }, [highlight])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return
      if (e.data?.type === MSG.select) select(e.data.id ?? null)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [select])

  if (!site) return null
  const src = `/preview/${site.id}${route === '/' ? '' : route}?edit=${editMode ? 1 : 0}&v=${previewVersion}`

  return (
    <div className="bg-muted/60 flex h-full min-w-0 flex-1 flex-col">
      <div className="flex items-center gap-3 border-b bg-white px-4 py-2.5">
        <div className="bg-secondary flex gap-1 rounded-lg p-1">
          {DEVICES.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setDevice(id)}
              aria-pressed={device === id}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-sm ${device === id ? 'bg-white font-semibold shadow-sm' : 'text-muted-foreground'}`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
        <form
          key={route}
          className="flex flex-1 items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const v = String(new FormData(e.currentTarget).get('route') ?? '').trim()
            setRoute(v.startsWith('/') ? v : `/${v}`)
          }}
        >
          <input
            name="route"
            defaultValue={route}
            aria-label="경로"
            className="h-8 w-full max-w-xs rounded-lg border bg-white px-3 text-sm"
          />
        </form>
        <button
          onClick={refresh}
          aria-label="새로고침"
          className="hover:bg-muted rounded-lg border bg-white p-2"
        >
          <RotateCw className="size-3.5" />
        </button>
      </div>
      <div className="flex flex-1 justify-center overflow-auto p-5">
        <iframe
          ref={frame}
          key={device}
          src={src}
          title="사이트 프리뷰"
          onLoad={highlight}
          style={{ width: WIDTH[device] }}
          className="h-full min-h-[600px] max-w-full rounded-xl border bg-white shadow-sm"
        />
      </div>
    </div>
  )
}
