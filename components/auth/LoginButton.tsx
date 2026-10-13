'use client'

import { useCallback, useState } from 'react'
import { LoginModal, type AuthProvider } from './LoginModal'

type Props = {
  className?: string
  onSelect?: (provider: AuthProvider) => void
}

export function LoginButton({ className, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <button
        type="button"
        className={`${className ?? ''} cursor-pointer`}
        onClick={() => setOpen(true)}
      >
        로그인
      </button>
      {open && <LoginModal onClose={close} onSelect={onSelect} />}
    </>
  )
}
