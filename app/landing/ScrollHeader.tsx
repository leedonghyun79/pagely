'use client'

import { useEffect, useRef, useState } from 'react'

const HIDE_AFTER = 80
const DELTA = 6

/** 아래로 스크롤하면 숨고, 위로 스크롤하면 다시 나타나는 상단 헤더 */
export function ScrollHeader({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      if (Math.abs(y - lastY.current) < DELTA) return
      setHidden(y > lastY.current && y > HIDE_AFTER)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      style={{ position: 'sticky', top: 0, zIndex: 40 }}
      className={`transition-[transform,background-color,box-shadow] duration-300 ease-out ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${scrolled ? 'bg-[var(--paper)]/85 shadow-[0_1px_0_var(--line)] backdrop-blur' : ''}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        {children}
      </div>
    </header>
  )
}
