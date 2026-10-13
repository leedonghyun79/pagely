'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowUp, Smartphone, Timer, Wand2 } from 'lucide-react'

const HIGHLIGHTS = [
  { icon: Wand2, text: '디자인은 언제든 수정할 수 있어요.', color: 'bg-sky-100 text-sky-500' },
  { icon: Timer, text: '최대 15분 이내로 생성해요.', color: 'bg-blue-100 text-blue-500' },
  {
    icon: Smartphone,
    text: '모바일도 반응형으로 자동 생성돼요.',
    color: 'bg-cyan-100 text-cyan-500',
  },
]

export function IdeaForm() {
  const router = useRouter()
  const [idea, setIdea] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canSubmit = !busy && idea.trim().length >= 2

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!canSubmit) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? '생성에 실패했어')
      router.push(`/editor/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '생성에 실패했어')
      setBusy(false)
    }
  }

  return (
    <div className="w-full">
      <form
        onSubmit={submit}
        className="mx-auto max-w-2xl rounded-3xl border border-[var(--ink)] bg-white p-4 shadow-[4px_4px_0_var(--signal)]"
      >
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              void submit()
            }
          }}
          maxLength={500}
          rows={4}
          placeholder={
            '만들고 싶은 웹사이트의 컨셉을 알려주세요.\n예) 은혜교회 소개 홈페이지, 따뜻한 느낌으로'
          }
          aria-label="아이디어 설명"
          className="w-full resize-none bg-transparent px-2 py-1 text-base outline-none placeholder:text-[var(--muted)]/60"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label="초안 만들기"
            className="flex size-9 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)] transition hover:bg-[var(--signal)] enabled:cursor-pointer disabled:bg-[var(--line)] disabled:text-[var(--muted)]"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </form>
      {busy && <p className="text-muted-foreground mt-3 text-center text-sm">초안 만드는 중…</p>}
      {error && <p className="text-destructive mt-3 text-center text-sm">{error}</p>}
      <ul className="mt-[25px] flex flex-wrap justify-center gap-3 md:flex-nowrap">
        {HIGHLIGHTS.map(({ icon: Icon, text, color }) => (
          <li
            key={text}
            className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-[var(--ink)]"
          >
            <span className={`flex size-7 items-center justify-center rounded-lg ${color}`}>
              <Icon className="size-4" />
            </span>
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
