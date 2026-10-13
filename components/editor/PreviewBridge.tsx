'use client'

import { useEffect } from 'react'

export const MSG = { select: 'pagely:select', highlight: 'pagely:highlight' } as const

/** iframe 안에서만 동작: 섹션 클릭 → 부모에 선택 전달, 부모의 하이라이트 요청 반영 */
export function PreviewBridge() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      [data-section-id]{cursor:pointer}
      [data-section-id]:hover{outline:2px dashed #93c5fd;outline-offset:-2px}
      [data-section-id][data-selected]{outline:2px solid #2563eb;outline-offset:-2px}`
    document.head.appendChild(style)

    const mark = (id: string | null) => {
      document
        .querySelectorAll('[data-selected]')
        .forEach((el) => el.removeAttribute('data-selected'))
      if (id)
        document
          .querySelector(`[data-section-id="${CSS.escape(id)}"]`)
          ?.setAttribute('data-selected', '')
    }

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-section-id]')
      if (!el) return
      e.preventDefault()
      const id = el.dataset.sectionId ?? null
      mark(id)
      window.parent.postMessage({ type: MSG.select, id }, window.location.origin)
    }
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type === MSG.highlight) mark(e.data.id ?? null)
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('message', onMessage)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('message', onMessage)
      style.remove()
    }
  }, [])
  return null
}
