import type { Metadata } from 'next'
import Link from 'next/link'
import { Noto_Serif_KR } from 'next/font/google'
import { LoginButton } from '@/components/auth/LoginButton'
import { buildFaqLd, buildSiteLd, serializeLd, SITE_URL } from '@/lib/seo/marketing'
import { TypingHeading } from './TypingHeading'
import { ScrollHeader } from './ScrollHeader'
import './landing.css'

const serif = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  variable: '--font-lp-serif',
  display: 'swap',
})

const TITLE = 'Pagely — 말로 만들고, 말로 고치는 웹사이트'
const DESCRIPTION =
  '한 줄만 적으면 홈·소개·문의 3페이지 초안이 나오고, 이후 수정은 채팅으로 해요. 개발자도 디자이너도 필요 없고, 모든 변경은 기록돼 버튼 하나로 되돌릴 수 있어요.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/landing' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/landing', type: 'website' },
  twitter: { card: 'summary', title: TITLE, description: DESCRIPTION },
}

const STEPS = [
  {
    no: '01',
    title: '한 줄만 적어요',
    body: '업종, 가게 이름, 원하는 분위기면 충분해요. 홈·소개·문의 3페이지 초안이 바로 만들어져요.',
  },
  {
    no: '02',
    title: '말로 고쳐요',
    body: '"제목을 더 짧게 해주세요"라고 하면 그 부분만 바뀌어요. 미리보기에서 클릭하면 어디를 말하는지도 알아들어요.',
  },
  {
    no: '03',
    title: '언제든 되돌려요',
    body: '모든 변경이 기록돼요. 버튼 하나로 이전 모습으로 돌아가니까, 마음껏 바꿔봐도 괜찮아요.',
  },
]

const FEATURES = [
  {
    title: '한 줄이면 첫 화면이 나와요',
    body: '업종, 이름, 분위기만 적으면 홈·소개·문의 3페이지 초안이 바로 만들어져요. 빈 화면에서 막막하게 시작하지 않아도 돼요.',
  },
  {
    title: '고치는 것도 대화로 끝나요',
    body: '"제목을 더 짧게", "포인트 색을 오렌지로"처럼 말하면 그 부분이 바로 바뀌어요. 메뉴나 설정을 찾아다닐 필요가 없어요.',
  },
  {
    title: '"이거요" 하고 가리키면 알아들어요',
    body: '고치고 싶은 부분을 클릭하면 채팅에 자동으로 붙어요. 설명하느라 애쓰지 않아도 돼요.',
  },
  {
    title: '처음부터 그럴듯한 디자인이에요',
    body: '분위기에 맞는 색과 글꼴이 기본으로 적용되고, 섹션마다 두 가지 스타일을 고를 수 있어요. 흔한 템플릿 같지 않게 시작해요.',
  },
  {
    title: '보이는 그대로 사이트가 돼요',
    body: '미리보기와 실제 사이트가 같은 모습이에요. 편집하면서 본 화면이 그대로 손님에게 보여요.',
  },
  {
    title: '검색 설정까지 알아서 챙겨요',
    body: '페이지 제목·설명, 공유 이미지, 사이트맵까지 자동으로 설정돼요. 따로 어려운 설정을 공부하지 않아도 돼요.',
  },
]

const FAQ = [
  {
    q: '코딩을 전혀 몰라도 쓸 수 있나요?',
    a: '네, 말로 요청하는 것이 전부예요. 코드는 보이지도 않고, 직접 만질 일도 없어요.',
  },
  {
    q: '홈페이지가 나오기까지 얼마나 걸리나요?',
    a: '아이디어를 한 줄 적으면 홈·소개·문의 3페이지 초안이 바로 나와요. 이후엔 채팅으로 원하는 모습까지 다듬으면 돼요.',
  },
  {
    q: '마음에 안 들면 어떻게 하나요?',
    a: '다시 말로 요청하면 그 부분만 바뀌어요. 모든 변경이 기록돼서 버튼 하나로 이전 모습으로 돌아갈 수도 있어요.',
  },
  {
    q: '어떤 구성을 만들 수 있나요?',
    a: '대표 화면, 서비스 소개, 자주 묻는 질문, 문의 유도, 고객 후기까지 5가지 구성이 있고 각각 두 가지 스타일을 고를 수 있어요. 앞으로 계속 늘어날 예정이에요.',
  },
  {
    q: '만든 사이트는 어떻게 공개하나요?',
    a: '제작 완료 후에 요청하시고 비용 결제해주시면 사용 가능하게 세팅 도와드립니다.',
  },
]

const TICKER = [
  '"배경을 좀 더 따뜻한 톤으로 바꿔주세요"',
  '"제목 글꼴을 고급스럽게 해주세요"',
  '"버튼을 더 크고 둥글게 해주세요"',
  '"여백을 넉넉하게 해주세요"',
  '"포인트 색을 오렌지로 바꿔주세요"',
  '"전체적으로 깔끔하게 해주세요"',
  '"카드 그림자를 은은하게 해주세요"',
]

const SAMPLES = [
  {
    name: '카페 온도',
    tag: '카페',
    bg: '#f3e6d3',
    fg: '#3b2a1e',
    accent: '#b5651d',
    title: '오늘의 한 잔,\n천천히 내려드려요',
    cta: '메뉴 보기',
  },
  {
    name: '결 필라테스',
    tag: '운동',
    bg: '#e4ecdf',
    fg: '#1f3326',
    accent: '#4f8a5b',
    title: '몸의 결을\n되찾는 시간',
    cta: '체험 예약',
  },
  {
    name: '모노 스튜디오',
    tag: '디자인',
    bg: '#14161a',
    fg: '#f6f1e7',
    accent: '#e8542b',
    title: '조용하지만\n오래 남는 디자인',
    cta: '작업 보기',
  },
  {
    name: '하루 베이커리',
    tag: '베이커리',
    bg: '#fbe9e7',
    fg: '#5a2a27',
    accent: '#d9534f',
    title: '갓 구운 빵이\n기다리고 있어요',
    cta: '주문하기',
  },
  {
    name: '파란 치과',
    tag: '병원',
    bg: '#e3eefb',
    fg: '#12263f',
    accent: '#2f6fdb',
    title: '편안하게,\n정직하게 진료해요',
    cta: '진료 예약',
  },
  {
    name: '숲속 서점',
    tag: '서점',
    bg: '#efe9f7',
    fg: '#2c2140',
    accent: '#7a52c7',
    title: '느리게 읽는\n작은 책방',
    cta: '오시는 길',
  },
]

function SampleCard({ s }: { s: (typeof SAMPLES)[number] }) {
  return (
    <div className="w-[370px] shrink-0 overflow-hidden rounded-2xl border border-[var(--ink)] bg-white">
      <div className="flex items-center gap-1 border-b border-[var(--line)] px-3 py-2">
        <span className="size-2 rounded-full bg-[var(--signal)]" />
        <span className="size-2 rounded-full bg-[var(--line)]" />
        <span className="size-2 rounded-full bg-[var(--line)]" />
      </div>
      <div
        className="flex aspect-[4/3] flex-col justify-center gap-4 px-6"
        style={{ background: s.bg, color: s.fg }}
      >
        <p className="lp-serif text-xl leading-snug font-bold whitespace-pre-line md:text-2xl">
          {s.title}
        </p>
        <span
          className="w-fit rounded-full px-4 py-1.5 text-xs font-semibold text-white"
          style={{ background: s.accent }}
        >
          {s.cta}
        </span>
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-sm">
        <span className="font-semibold">{s.name}</span>
        <span className="text-xs text-[var(--muted)]">{s.tag}</span>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className={`${serif.variable} lp`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeLd([buildSiteLd(SITE_URL, DESCRIPTION), buildFaqLd(FAQ)]),
        }}
      />
      {/* NAV */}
      <ScrollHeader>
        <span className="lp-serif text-2xl font-black">
          Pagely<span className="text-[var(--signal)]">.</span>
        </span>
        <nav className="hidden gap-10 text-base font-medium text-[var(--muted)] md:flex">
          <a href="#how" className="hover:text-[var(--ink)]">
            사용법
          </a>
          <a href="#why" className="hover:text-[var(--ink)]">
            특징
          </a>
          <a href="#faq" className="hover:text-[var(--ink)]">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-5">
          <LoginButton className="text-base font-semibold text-[var(--muted)] hover:text-[var(--ink)]" />
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-full bg-[var(--ink)] px-6 text-base font-semibold text-[var(--paper)] transition hover:-translate-y-0.5 hover:bg-[var(--signal)]"
          >
            내 사이트 만들기
          </Link>
        </div>
      </ScrollHeader>

      {/* HERO */}
      <section className="relative">
        <div className="lp-hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute -top-10 right-[-8%] size-[520px] rounded-full bg-[var(--signal)] opacity-[0.14] blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 pt-10 pb-25 md:grid-cols-[1fr_1.05fr] md:pt-16">
          <div>
            <h1
              className="lp-serif lp-rise text-[clamp(2.4rem,10vw,3.4rem)] leading-[1.12] font-black md:text-7xl"
              style={{ '--d': 1 } as React.CSSProperties}
            >
              <span className="relative inline-block whitespace-nowrap">
                말 한마디
                <svg
                  className="pointer-events-none absolute top-1/2 left-1/2 h-[150%] w-[135%] -translate-x-1/2 -translate-y-1/2 overflow-visible text-[var(--signal)]"
                  viewBox="0 0 200 80"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    className="lp-circle"
                    pathLength="1"
                    d="M30 14 C 80 -2, 178 4, 192 36 C 202 62, 120 78, 62 72 C 12 66, -6 40, 22 20 C 40 8, 78 4, 120 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <path
                    className="lp-circle lp-circle-2"
                    pathLength="1"
                    d="M24 22 C 60 2, 170 -4, 196 30 C 208 58, 130 82, 70 76 C 20 70, -10 46, 34 14 C 60 -2, 110 0, 150 8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              면
              <br />
              홈페이지가 <span className="italic">열려요.</span>
            </h1>
            <p
              className="lp-rise mt-9 max-w-md text-lg leading-relaxed text-[var(--muted)]"
              style={{ '--d': 2 } as React.CSSProperties}
            >
              개발자도 디자이너도 필요 없어요. 한 줄이면 3페이지 초안이 나오고, 고치고 싶은 곳은
              채팅으로 바로 바꿔요.
            </p>
            <div
              className="lp-rise mt-10 flex flex-wrap items-center gap-4"
              style={{ '--d': 3 } as React.CSSProperties}
            >
              <Link
                href="/"
                className="inline-flex h-14 items-center gap-2 rounded-full bg-[var(--ink)] px-8 text-base font-semibold text-[var(--paper)] shadow-[4px_4px_0_var(--signal)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--signal)]"
              >
                지금 만들어보기 <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* 사이트 미리보기 목업 */}
          <div
            className="lp-rise relative mx-auto w-full max-w-[600px]"
            style={{ '--d': 3 } as React.CSSProperties}
            aria-hidden
          >
            {/* 사이트 미리보기 */}
            <div className="overflow-hidden rounded-3xl border border-[var(--ink)] bg-white">
              <div className="flex items-center gap-1.5 border-b border-[var(--line)] px-4 py-3">
                <span className="size-2.5 rounded-full bg-[var(--signal)]" />
                <span className="size-2.5 rounded-full bg-[var(--line)]" />
                <span className="size-2.5 rounded-full bg-[var(--line)]" />
                <span className="ml-3 flex-1 rounded-full bg-[var(--paper)] px-3 py-1 text-[11px] text-[var(--muted)]">
                  cafe-ondo.pagely.app
                </span>
              </div>
              <div className="bg-[#2b1d14] px-8 pt-6 pb-12 text-[#f3e6d3] md:px-10 md:pb-16">
                <div className="mb-14 flex items-center justify-between text-sm opacity-80">
                  <span className="lp-serif font-bold">카페 온도</span>
                  <span className="flex gap-4">
                    <span>홈</span>
                    <span>소개</span>
                    <span>문의</span>
                  </span>
                </div>
                <div className="relative w-fit">
                  <div className="lp-select absolute -inset-2 rounded-lg border-2 border-dashed border-[var(--signal)]" />
                  <span className="lp-select absolute -top-6 -left-2 rounded bg-[var(--signal)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    대표 화면
                  </span>
                  <p className="lp-serif relative text-4xl leading-snug font-black md:text-5xl">
                    오늘의 한 잔,
                    <br />
                    천천히 내려드려요
                  </p>
                  <svg
                    className="lp-cursor absolute right-[-14px] bottom-[-18px] drop-shadow"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="#fff"
                    stroke="#14161a"
                    strokeWidth="1.5"
                  >
                    <path d="M5 3l14 7-6 2-2 6z" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="mt-10 inline-block rounded-full bg-[#e8a35c] px-6 py-3 text-sm font-bold text-[#2b1d14]">
                  오늘의 메뉴 보기
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div
        className="lp-noise lp-noise-dark overflow-hidden border-y border-[var(--ink)] bg-[var(--ink)] py-4 text-[var(--paper)]"
        aria-hidden
      >
        <div className="lp-marquee lp-serif text-lg">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="mx-8 whitespace-nowrap">
              {t} <span className="text-[var(--signal)]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section className="mx-auto max-w-4xl px-6 py-25 text-center">
        <p className="lp-serif text-2xl leading-snug font-bold text-balance md:text-4xl">
          <span className="text-[var(--muted)]">홈페이지 하나 만들 때마다</span>
          <br />
          {['견적서', '수정 요청서', '긴 제작 기간'].map((t, i) => (
            <span key={t}>
              {i > 0 && <span className="mx-1.5 text-[var(--muted)] md:mx-3">·</span>}
              <span className="inline-block whitespace-nowrap text-[var(--muted)] line-through decoration-[var(--signal)] decoration-[3px] md:decoration-4">
                {t}
              </span>
            </span>
          ))}
          <br />
          <span className="mt-2 inline-block text-4xl font-black md:text-6xl">
            이제 필요 없어요.
          </span>
        </p>
        <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-balance text-[var(--muted)]">
          글자 하나 고치려고 연락하고, 기다리고, 비용까지 걱정하셨다면
          <br className="hidden md:block" /> 이제 채팅 한 줄이면 충분해요.
        </p>
      </section>

      {/* HOW */}
      <section id="how" className="lp-noise scroll-mt-8 bg-white py-25">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="lp-serif mb-14 text-4xl font-black md:text-5xl">세 걸음이면 충분해요.</h2>
          <ol className="grid gap-px overflow-hidden rounded-3xl border border-[var(--ink)] bg-[var(--ink)] [word-break:keep-all] md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.no} className="bg-white p-8 transition hover:bg-[var(--paper)]">
                <span className="lp-serif text-5xl font-black text-[var(--signal)]">{s.no}</span>
                <h3 className="lp-serif mt-6 mb-3 text-2xl font-bold">{s.title}</h3>
                <p className="leading-relaxed text-[var(--muted)]">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SAMPLES */}
      <section className="lp-noise overflow-hidden py-25" aria-label="시안 미리보기">
        <div className="mx-auto mb-10 max-w-6xl px-6">
          <h2 className="lp-serif text-4xl leading-tight font-black md:text-5xl">
            우리 가게에 어울리는
            <br />
            <span className="text-[var(--signal)]">첫 화면</span>이 이렇게 시작돼요.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
            업종과 분위기를 적으면 그에 맞는 색, 글꼴, 문구로 초안을 만들어요. 여기서부터 말로
            다듬어 가면 돼요.
          </p>
        </div>
        <div className="lp-carousel-wrap">
          <div className="lp-carousel">
            {[...SAMPLES, ...SAMPLES].map((s, i) => (
              <div key={i} className="mr-5" aria-hidden={i >= SAMPLES.length}>
                <SampleCard s={s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="lp-noise scroll-mt-8 bg-white py-25">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 max-w-3xl">
            <h2 className="lp-serif text-4xl leading-tight font-black md:text-5xl">
              홈페이지 만들기,
              <br />
              이렇게 쉬워져요.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">
              설명만 하면 AI가 초안부터 수정까지 대신해요.
              <br className="hidden md:block" /> 어려운 설정도, 따로 배울 것도 없어요.
            </p>
          </div>
          {/* 스크롤하면 카드가 하나씩 위로 쌓이고, 마지막 카드가 덮은 채로 함께 올라간다 */}
          <div>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="sticky mb-6 last:mb-0"
                style={{ top: `calc(5rem + ${i} * 1.25rem)` }}
              >
                <article className="flex h-[19rem] flex-col justify-between gap-6 rounded-3xl border border-[var(--ink)] bg-[var(--paper)] p-7 shadow-[0_-10px_30px_-12px_rgba(20,22,26,0.25)] md:h-[22rem] md:flex-row md:items-center md:gap-14 md:p-12">
                  <div className="md:w-1/2">
                    <span className="lp-serif flex size-11 items-center justify-center rounded-full border border-[var(--ink)] text-sm font-bold">
                      0{i + 1}
                    </span>
                    <h3 className="lp-serif mt-5 text-2xl leading-snug font-bold md:mt-8 md:text-3xl">
                      {f.title}
                    </h3>
                  </div>
                  <p className="text-base leading-relaxed text-[var(--muted)] md:w-1/2 md:text-lg">
                    {f.body}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-8 px-6 py-25">
        <h2 className="lp-serif mb-12 text-4xl font-black md:text-5xl">자주 묻는 것들</h2>
        <div className="border-t border-[var(--ink)]">
          {FAQ.map((item) => (
            <details key={item.q} className="border-b border-[var(--line)] py-6">
              <summary className="flex items-center justify-between gap-6 text-lg font-semibold">
                {item.q}
                <span className="lp-plus flex size-10 shrink-0 items-center justify-center text-5xl leading-none text-[var(--signal)] transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-[var(--muted)]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-noise lp-noise-dark mx-4 mb-4 rounded-[2rem] bg-[radial-gradient(ellipse_at_top_right,rgba(232,84,43,0.22),transparent_60%),linear-gradient(160deg,#23262d_0%,#14161a_70%)] px-6 py-25 text-center text-[var(--paper)] md:mx-8">
        <TypingHeading className="lp-serif mx-auto max-w-3xl text-4xl leading-tight font-black md:text-6xl" />
        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="inline-flex h-16 items-center rounded-full bg-[var(--paper)] px-12 text-lg font-bold text-[var(--ink)] transition hover:-translate-y-0.5 hover:bg-[var(--signal)] hover:text-white"
          >
            지금 시작하기
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-[var(--muted)]">
        <span className="lp-serif font-bold text-[var(--ink)]">Pagely.</span>
        <span>채팅으로 만들고 고치는 AI 웹빌더</span>
      </footer>
    </div>
  )
}
