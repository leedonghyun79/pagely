'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export type AuthProvider = 'google' | 'kakao'

type Props = {
  onClose: () => void
  onSelect?: (provider: AuthProvider) => void
}

export function LoginModal({ onClose, onSelect }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  // 부모의 stacking context(z-index/transform)에 갇히지 않도록 body에 직접 렌더
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        data-testid="login-backdrop"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-[#14161a] shadow-2xl"
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full text-xl text-black/50 hover:bg-black/5"
        >
          ×
        </button>
        <h2 id="login-title" className="text-xl font-bold">
          로그인
        </h2>
        <p className="mt-2 text-sm text-black/60">
          간편하게 시작하고, 만든 사이트를 계속 이어서 고쳐요.
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => onSelect?.('google')}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-black/15 bg-white text-sm font-semibold hover:bg-black/5"
          >
            <span aria-hidden className="text-base font-black text-[#4285f4]">
              G
            </span>
            Google로 계속하기
          </button>
          <button
            type="button"
            onClick={() => onSelect?.('kakao')}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#fee500] text-sm font-semibold text-[#191919] hover:brightness-95"
          >
            <span aria-hidden>💬</span>
            카카오로 계속하기
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
