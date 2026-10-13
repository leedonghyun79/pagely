import type { Metadata } from 'next'
import { Noto_Serif_KR } from 'next/font/google'
import { IdeaForm } from '@/components/editor/IdeaForm'
import { SiteHeader } from '@/components/layout/SiteHeader'
import './landing/landing.css'

export const metadata: Metadata = {
  title: '아이디어 한 줄로 웹사이트 만들기 — Pagely',
  description: '만들고 싶은 웹사이트의 컨셉을 한 줄로 적으면 홈·소개·문의 3페이지 초안이 바로 만들어져요.',
  alternates: { canonical: '/' },
}

export const dynamic = 'force-dynamic'

const serif = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  variable: '--font-lp-serif',
  display: 'swap',
})

export default function Home() {
  return (
    <div className={`${serif.variable} lp min-h-screen`}>
      <SiteHeader />
      <main className="mx-auto max-w-[1212px] px-6 pt-10 pb-24 text-center">
        <h1 className="lp-serif lp-rise text-4xl leading-[1.15] font-black md:text-6xl">
          머릿속 아이디어를
          <br />
          실제 <span className="text-[var(--signal)]">웹사이트</span>로
        </h1>
        <p
          className="lp-rise mt-6 text-lg text-[var(--muted)]"
          style={{ '--d': 1 } as React.CSSProperties}
        >
          한 줄만 적으면 홈·소개·문의 3페이지 초안이 나와. 이후엔 채팅으로 고쳐.
        </p>

        <div className="lp-rise mt-16" style={{ '--d': 2 } as React.CSSProperties}>
          <IdeaForm />
        </div>

        <section className="mt-20 text-left">
          <h2 className="lp-serif mb-6 text-2xl font-black md:text-3xl">제작 사례</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(3,370px)] lg:justify-between">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-[var(--ink)] bg-white">
                <div className="aspect-[372/264] bg-[var(--paper)]" />
                <div className="border-t border-[var(--line)] px-4 py-3 text-sm text-[var(--muted)]">
                  제작 사례 {i + 1}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
