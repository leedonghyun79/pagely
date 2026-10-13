# Next.js 14 — 참고 자료

## App Router 핵심

- `app/` 디렉터리 — 모든 라우트가 여기에 위치
- `page.tsx` — 라우트 컴포넌트 (기본값: 서버 컴포넌트)
- `layout.tsx` — 공유 레이아웃 래퍼
- `loading.tsx` — Suspense 경계 UI
- `error.tsx` — 에러 경계 UI
- `not-found.tsx` — 404 UI
- `"use client"` 지시문 — 클라이언트 컴포넌트로 전환

## 파일 구조 규칙

```
app/
  layout.tsx        # 루트 레이아웃
  page.tsx          # / 라우트
  globals.css       # 전역 스타일
  (routes)/
    page.tsx        # 중첩 라우트
components/         # 공유 UI 컴포넌트
lib/                # 유틸리티, 헬퍼
store/              # Zustand 스토어
types/              # TypeScript 타입
```

## 핵심 규칙

- 서버 컴포넌트 우선 — `"use client"`는 인터랙션/훅/브라우저 API가 필요할 때만
- 서버 컴포넌트에서 데이터 패칭은 `async/await` 직접 사용
- 클라이언트 상태(Zustand)는 클라이언트 컴포넌트에서만 사용

---

## 데이터 패칭 패턴

```ts
// 서버 컴포넌트 — 직접 fetch
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store',         // 항상 최신
    next: { revalidate: 60 }  // 60초 캐시
  });
}

// 클라이언트 컴포넌트 — SWR 또는 React Query
'use client';
const { data } = useSWR('/api/data', fetcher);
```

## Route Handler (API)

```ts
// app/api/example/route.ts
export async function GET(request: Request) {
  return Response.json({ data: '...' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ success: true }, { status: 201 });
}
```

## 미들웨어 (인증 보호)

```ts
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

## 자주 쓰는 패턴

```ts
// 동적 import (코드 스플리팅)
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
});

// 이미지 최적화
import Image from 'next/image';
<Image src="/hero.png" alt="..." width={800} height={400} priority />

// 메타데이터 (SEO)
export const metadata: Metadata = {
  title: '페이지 제목',
  description: '페이지 설명',
  openGraph: { title: '...', images: ['...'] },
};
```

## 주의사항

- 서버 컴포넌트에서 `useState`, `useEffect` 사용 불가
- `"use client"` 경계 아래 자식은 모두 클라이언트 컴포넌트로 전환됨
- `cookies()`, `headers()`는 서버 컴포넌트/Route Handler에서만 사용
- 환경변수: 서버 전용은 `VARIABLE_NAME`, 클라이언트 노출은 `NEXT_PUBLIC_` 접두사
