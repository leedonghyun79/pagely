'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Undo2, X } from 'lucide-react'
import { SECTION_LABEL, useEditorStore } from '@/store/editor'

const SUGGESTIONS = ['히어로 문구 더 짧게', 'FAQ 추가해줘', '후기 섹션 추가해줘', '파랑으로 바꿔줘', '레이아웃 바꿔줘']

export function ChatPane() {
  const { site, messages, busy, error, selectedSectionId, editMode, select, sendChat, undo, toggleEditMode } =
    useEditorStore()
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: 'end' })
  }, [messages])

  const selected = site?.pages.flatMap((p) => p.sections).find((s) => s.id === selectedSectionId)
  const lastUndoable = [...messages].reverse().find((m) => m.revisionId && !m.undone)?.id

  const submit = (message: string) => {
    const m = message.trim()
    if (!m || busy) return
    setText('')
    void sendChat(m)
  }

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col border-l bg-white">
      <div className="border-b px-4 py-3">
        <p className="text-xs text-muted-foreground">AI 채팅</p>
        <h2 className="font-semibold">말로 고치기</h2>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            “히어로 문구 더 짧게”처럼 말해봐. 프리뷰에서 섹션을 클릭하면 그 섹션만 수정해.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : ''}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
            >
              {m.text}
              {m.id === lastUndoable && (
                <button
                  onClick={() => void undo(m.id)}
                  disabled={busy}
                  className="mt-2 flex items-center gap-1 text-xs font-semibold underline-offset-2 hover:underline"
                >
                  <Undo2 className="size-3" /> 되돌리기
                </button>
              )}
              {m.undone && <span className="mt-1 block text-xs text-muted-foreground">되돌림</span>}
            </div>
          </div>
        ))}
        {busy && <p className="text-sm text-muted-foreground">작업 중…</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div ref={endRef} />
      </div>

      <div className="space-y-2 border-t p-3">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              disabled={busy}
              className="rounded-full border bg-white px-2.5 py-1 text-xs hover:bg-muted disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
        {selected && (
          <div className="flex items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1.5 text-xs">
            선택: <b>{SECTION_LABEL[selected.type]}</b>
            <button onClick={() => select(null)} aria-label="선택 해제" className="ml-auto">
              <X className="size-3" />
            </button>
          </div>
        )}
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            submit(text)
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault()
                submit(text)
              }
            }}
            rows={2}
            placeholder="무엇을 바꿀까?"
            aria-label="채팅 입력"
            className="min-h-[44px] flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:border-ring"
          />
          <button
            type="submit"
            disabled={busy || !text.trim()}
            aria-label="보내기"
            className="rounded-xl bg-primary p-2.5 text-primary-foreground disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </form>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={editMode} onChange={toggleEditMode} />
          편집 모드 (프리뷰에서 클릭해 선택)
        </label>
      </div>
    </aside>
  )
}
