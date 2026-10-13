'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const LINE1 = '아이디어만 있으면 돼요.'
const LINE2 = '나머지는 AI가 채워요.'
const TYPE_SPEED = 70
const ERASE_SPEED = 30
const HOLD = 2400
const RESTART = 600

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY)
  mq.addEventListener('change', onChange)
  return () => {
    mq.removeEventListener('change', onChange)
  }
}
function getReduced() {
  return window.matchMedia(REDUCED_QUERY).matches
}

export function TypingHeading({ className }: { className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [typedCount, setCount] = useState(0)
  const [erasing, setErasing] = useState(false)
  const [visible, setVisible] = useState(false)
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false)
  const total = LINE1.length + LINE2.length
  const count = reduced ? total : typedCount

  // 화면에 보일 때만 돌린다
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
    }
  }, [])

  // 쓰기 → 잠시 멈춤 → 지우기 → 처음부터 무한 반복
  useEffect(() => {
    if (!visible || reduced) return
    let delay: number
    let next: () => void
    if (!erasing) {
      if (typedCount < total) {
        delay = TYPE_SPEED
        next = () => setCount(typedCount + 1)
      } else {
        delay = HOLD
        next = () => setErasing(true)
      }
    } else if (typedCount > 0) {
      delay = ERASE_SPEED
      next = () => setCount(typedCount - 1)
    } else {
      delay = RESTART
      next = () => setErasing(false)
    }
    const id = setTimeout(next, delay)
    return () => {
      clearTimeout(id)
    }
  }, [visible, reduced, erasing, typedCount, total])

  const typed1 = LINE1.slice(0, count)
  const typed2 = LINE2.slice(0, Math.max(0, count - LINE1.length))
  const onLine2 = count > LINE1.length
  const done = count >= total && !erasing
  const cursor = (
    <span aria-hidden className={`lp-type-cursor ${done ? 'lp-type-cursor-blink' : ''}`} />
  )

  return (
    <h2 ref={ref} className={className} aria-label={`${LINE1} ${LINE2}`}>
      {/* 전체 문구를 투명하게 깔아 둬서 타이핑 중에도 레이아웃이 안 흔들리게 한다 */}
      <span className="relative block" aria-hidden>
        <span className="invisible block">{LINE1}</span>
        <span className="invisible block">{LINE2}</span>
        <span className="absolute inset-0">
          <span className="block">
            {typed1}
            {!onLine2 && cursor}
          </span>
          <span className="block text-[var(--signal)]">
            {typed2}
            {onLine2 && cursor}
          </span>
        </span>
      </span>
    </h2>
  )
}
