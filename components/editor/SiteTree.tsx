'use client'

import { useRef } from 'react'
import { ArrowDown, ArrowUp, FileText, Trash2 } from 'lucide-react'
import { SECTION_LABEL, useEditorStore } from '@/store/editor'
import type { DesignTokens } from '@/lib/schema/site'

function TokenField({
  label,
  k,
  value,
}: {
  label: string
  k: 'primary' | 'background' | 'text'
  value: string
}) {
  const commit = useEditorStore((s) => s.commit)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  return (
    <label className="flex items-center justify-between text-sm">
      {label}
      <input
        type="color"
        defaultValue={value}
        key={value}
        onChange={(e) => {
          const v = e.target.value
          clearTimeout(timer.current)
          timer.current = setTimeout(
            () =>
              void commit([{ op: 'update_design_tokens', tokens: { [k]: v } }], `${label} 색 변경`),
            400
          )
        }}
        className="h-7 w-10 cursor-pointer rounded border"
      />
    </label>
  )
}

export function SiteTree() {
  const { site, route, selectedSectionId, busy, setRoute, select, commit } = useEditorStore()
  if (!site) return null
  const page = site.pages.find((p) => p.route === route) ?? site.pages[0]
  const t: DesignTokens = site.tokens

  return (
    <nav className="flex h-full w-[280px] shrink-0 flex-col overflow-y-auto border-r bg-white">
      <section className="border-b p-4">
        <h3 className="text-muted-foreground mb-3 text-xs font-semibold">디자인 시스템</h3>
        <div className="space-y-2">
          <TokenField label="메인" k="primary" value={t.primary} />
          <TokenField label="배경" k="background" value={t.background} />
          <TokenField label="글자" k="text" value={t.text} />
          <label className="flex items-center justify-between text-sm">
            폰트
            <select
              value={t.font}
              onChange={(e) =>
                void commit(
                  [
                    {
                      op: 'update_design_tokens',
                      tokens: { font: e.target.value as DesignTokens['font'] },
                    },
                  ],
                  '폰트 변경'
                )
              }
              className="h-7 rounded border bg-white px-1 text-sm"
            >
              <option value="sans">고딕</option>
              <option value="serif">명조</option>
            </select>
          </label>
          <label className="flex items-center justify-between gap-3 text-sm">
            라운드
            <input
              type="range"
              min={0}
              max={32}
              defaultValue={t.radius}
              key={t.radius}
              onPointerUp={(e) =>
                void commit(
                  [
                    {
                      op: 'update_design_tokens',
                      tokens: { radius: Number(e.currentTarget.value) },
                    },
                  ],
                  '라운드 변경'
                )
              }
              onKeyUp={(e) =>
                void commit(
                  [
                    {
                      op: 'update_design_tokens',
                      tokens: { radius: Number(e.currentTarget.value) },
                    },
                  ],
                  '라운드 변경'
                )
              }
              className="flex-1"
            />
          </label>
        </div>
      </section>

      <section className="border-b p-4">
        <h3 className="text-muted-foreground mb-2 text-xs font-semibold">페이지</h3>
        <ul className="space-y-1">
          {site.pages.map((p) => (
            <li key={p.route}>
              <button
                onClick={() => setRoute(p.route)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm ${p.route === page.route ? 'bg-accent font-semibold' : 'hover:bg-muted'}`}
              >
                <FileText className="size-3.5 shrink-0" />
                <span className="truncate">{p.route}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="p-4">
        <h3 className="text-muted-foreground mb-2 text-xs font-semibold">섹션 · {page.route}</h3>
        <ul className="space-y-1">
          {page.sections.map((s, i) => (
            <li
              key={s.id}
              className={`group flex items-center rounded-lg ${s.id === selectedSectionId ? 'bg-accent' : 'hover:bg-muted'}`}
            >
              <button
                onClick={() => select(s.id)}
                className="flex-1 px-2.5 py-1.5 text-left text-sm"
              >
                {SECTION_LABEL[s.type]}{' '}
                <span className="text-muted-foreground text-xs">· {s.variant}</span>
              </button>
              <div className="flex pr-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                <button
                  aria-label="위로"
                  disabled={busy || i === 0}
                  onClick={() =>
                    void commit(
                      [{ op: 'move_section', route: page.route, sectionId: s.id, toIndex: i - 1 }],
                      `${SECTION_LABEL[s.type]} 위로 이동`
                    )
                  }
                  className="p-1 disabled:opacity-30"
                >
                  <ArrowUp className="size-3.5" />
                </button>
                <button
                  aria-label="아래로"
                  disabled={busy || i === page.sections.length - 1}
                  onClick={() =>
                    void commit(
                      [{ op: 'move_section', route: page.route, sectionId: s.id, toIndex: i + 1 }],
                      `${SECTION_LABEL[s.type]} 아래로 이동`
                    )
                  }
                  className="p-1 disabled:opacity-30"
                >
                  <ArrowDown className="size-3.5" />
                </button>
                <button
                  aria-label="삭제"
                  disabled={busy}
                  onClick={() =>
                    void commit(
                      [{ op: 'remove_section', route: page.route, sectionId: s.id }],
                      `${SECTION_LABEL[s.type]} 삭제`
                    )
                  }
                  className="text-destructive p-1"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </nav>
  )
}
