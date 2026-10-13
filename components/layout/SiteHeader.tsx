import Link from 'next/link'
import { LoginButton } from '@/components/auth/LoginButton'

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" aria-label="Pagely" className="lp-serif text-2xl font-black">
        Pagely<span className="text-[var(--signal)]">.</span>
      </Link>
      <nav aria-label="계정" className="flex items-center gap-8">
        <Link
          href="/landing"
          className="hidden text-base font-medium text-[var(--muted)] hover:text-[var(--ink)] md:block"
        >
          서비스 소개
        </Link>
        <LoginButton className="text-base font-semibold text-[var(--muted)] hover:text-[var(--ink)]" />
      </nav>
    </header>
  )
}
