import { create } from 'zustand'
import type { Site } from '@/lib/schema/site'
import type { Op } from '@/lib/site/ops'

export type Device = 'phone' | 'tablet' | 'pc'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  /** 이 메시지가 만든 리비전. 되돌리기에 쓴다. */
  revisionId?: string
  undone?: boolean
}

interface EditorState {
  site: Site | null
  route: string
  selectedSectionId: string | null
  device: Device
  editMode: boolean
  messages: ChatMessage[]
  previewVersion: number
  busy: boolean
  error: string | null

  init: (site: Site) => void
  setRoute: (route: string) => void
  select: (id: string | null) => void
  setDevice: (d: Device) => void
  toggleEditMode: () => void
  refresh: () => void
  sendChat: (message: string) => Promise<void>
  commit: (ops: Op[], summary: string) => Promise<void>
  undo: (messageId: string) => Promise<void>
}

let seq = 0
const mid = () => `m_${++seq}`

async function api<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, body === undefined ? undefined : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? '요청에 실패했어')
  return data as T
}

export const useEditorStore = create<EditorState>((set, get) => {
  const run = async (fn: () => Promise<void>) => {
    set({ busy: true, error: null })
    try {
      await fn()
    } catch (e) {
      set({ error: e instanceof Error ? e.message : '알 수 없는 오류' })
    } finally {
      set({ busy: false })
    }
  }

  return {
    site: null,
    route: '/',
    selectedSectionId: null,
    device: 'pc',
    editMode: true,
    messages: [],
    previewVersion: 0,
    busy: false,
    error: null,

    init: (site) => set({ site, route: '/', selectedSectionId: null, messages: [], previewVersion: 0, error: null }),
    setRoute: (route) => set({ route, selectedSectionId: null }),
    select: (id) => {
      const site = get().site
      const page = id ? site?.pages.find((p) => p.sections.some((s) => s.id === id)) : undefined
      set({ selectedSectionId: id, route: page?.route ?? get().route })
    },
    setDevice: (device) => set({ device }),
    toggleEditMode: () => set((s) => ({ editMode: !s.editMode, previewVersion: s.previewVersion + 1 })),
    refresh: () => set((s) => ({ previewVersion: s.previewVersion + 1 })),

    sendChat: (message) =>
      run(async () => {
        const { site, selectedSectionId } = get()
        if (!site) return
        set((s) => ({ messages: [...s.messages, { id: mid(), role: 'user', text: message }] }))
        const res = await api<{ text: string; changed: boolean; site: Site; revisionId?: string }>(
          `/api/sites/${site.id}/chat`,
          { message, selectedSectionId: selectedSectionId ?? undefined },
        )
        set((s) => ({
          site: res.site,
          messages: [...s.messages, { id: mid(), role: 'ai', text: res.text, revisionId: res.changed ? res.revisionId : undefined }],
          previewVersion: res.changed ? s.previewVersion + 1 : s.previewVersion,
        }))
      }),

    commit: (ops, summary) =>
      run(async () => {
        const { site } = get()
        if (!site) return
        const res = await api<{ site: Site; revisionId: string }>(`/api/sites/${site.id}/ops`, { ops, summary })
        set((s) => ({
          site: res.site,
          previewVersion: s.previewVersion + 1,
          messages: [...s.messages, { id: mid(), role: 'ai', text: summary, revisionId: res.revisionId }],
        }))
      }),

    undo: (messageId) =>
      run(async () => {
        const { site, messages } = get()
        const target = messages.find((m) => m.id === messageId)
        if (!site || !target?.revisionId) return
        const res = await api<{ site: Site }>(`/api/sites/${site.id}/revisions`, { revisionId: target.revisionId })
        const route = res.site.pages.some((p) => p.route === get().route) ? get().route : '/'
        set((s) => ({
          site: res.site,
          route,
          selectedSectionId: null,
          previewVersion: s.previewVersion + 1,
          messages: s.messages.map((m) => (m.id === messageId ? { ...m, undone: true } : m)),
        }))
      }),
  }
})

export const SECTION_LABEL: Record<string, string> = {
  hero: '히어로',
  features: '특징',
  faq: 'FAQ',
  cta: 'CTA',
  testimonials: '후기',
}
