import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginButton } from '@/components/auth/LoginButton'
import { SiteHeader } from '@/components/layout/SiteHeader'

describe('LoginButton 모달', () => {
  it('처음엔 모달이 없고, 클릭하면 구글·카카오 버튼이 있는 모달이 열린다', () => {
    render(<LoginButton />)
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Google/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /카카오/ })).toBeTruthy()
  })

  it('Esc, 배경 클릭, 닫기 버튼으로 닫힌다', () => {
    render(<LoginButton />)
    const open = () => fireEvent.click(screen.getByRole('button', { name: '로그인' }))

    open()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()

    open()
    fireEvent.click(screen.getByTestId('login-backdrop'))
    expect(screen.queryByRole('dialog')).toBeNull()

    open()
    fireEvent.click(screen.getByRole('button', { name: '닫기' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('provider를 골랐을 때 onSelect가 호출된다', () => {
    const onSelect = vi.fn()
    render(<LoginButton onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))
    fireEvent.click(screen.getByRole('button', { name: /카카오/ }))
    expect(onSelect).toHaveBeenCalledWith('kakao')
  })
})

describe('SiteHeader', () => {
  it('우측 상단에 로그인 버튼이 있고 로고는 홈으로 연결된다', () => {
    render(<SiteHeader />)
    expect(screen.getByRole('button', { name: '로그인' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Pagely' }).getAttribute('href')).toBe('/')
  })
})
