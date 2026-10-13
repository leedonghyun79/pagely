# 성능 최적화 가이드

## Core Web Vitals 목표

| 지표 | 의미 | 목표 |
|------|------|------|
| LCP | 최대 콘텐츠 렌더링 시간 | < 2.5s |
| INP | 다음 페인트까지 상호작용 | < 200ms |
| CLS | 누적 레이아웃 이동 | < 0.1 |
| FCP | 첫 콘텐츠 렌더링 | < 1.8s |
| TTFB | 첫 바이트 수신 | < 800ms |

---

## 체크리스트

### 이미지
- [ ] `next/image` 컴포넌트를 사용하는가?
- [ ] 이미지에 `width`, `height`를 명시했는가? (CLS 방지)
- [ ] 히어로 이미지에 `priority` 속성이 있는가?
- [ ] 뷰포트 밖 이미지는 `loading="lazy"`인가?
- [ ] WebP/AVIF 포맷을 사용하는가?
- [ ] 이미지 크기가 표시 크기에 맞는가? (과도하게 큰 이미지 금지)

### 폰트
- [ ] `next/font`로 폰트를 로드하는가? (FOUT 방지)
- [ ] 폰트 서브셋을 지정했는가? (`subset: ['latin', 'korean']`)
- [ ] 시스템 폰트 fallback이 있는가?

### 번들 크기
- [ ] `@next/bundle-analyzer`로 번들 크기를 확인했는가?
- [ ] 무거운 라이브러리는 동적 import로 분리했는가?
- [ ] 사용하지 않는 라이브러리를 제거했는가?
- [ ] 트리 쉐이킹 가능한 named export를 사용하는가?

### 렌더링
- [ ] 서버 컴포넌트를 최대한 활용하는가?
- [ ] 클라이언트 컴포넌트 경계를 최대한 좁게 유지하는가?
- [ ] 긴 목록은 가상화(virtualization)를 적용했는가? (100개 이상)
- [ ] `useMemo`/`useCallback`은 실제 비용이 있을 때만 사용하는가?

### 캐싱
- [ ] 정적 데이터는 `cache: 'force-cache'`를 사용하는가?
- [ ] 주기적 갱신 데이터는 `next: { revalidate: N }`을 설정했는가?
- [ ] 정적 자산에 `Cache-Control` 헤더가 설정되어 있는가?

### 네트워크
- [ ] API 요청을 불필요하게 중복 호출하지 않는가?
- [ ] 데이터 패칭은 가능한 서버에서 하는가? (클라이언트 waterfall 방지)
- [ ] 외부 스크립트는 `next/script`로 로드하는가?

---

## Next.js 구현 패턴

```ts
// 동적 import로 초기 번들 줄이기
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton className="h-64" />,
  ssr: false,
});

// 폰트 최적화
import { Noto_Sans_KR } from 'next/font/google';
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// 이미지 최적화
<Image
  src="/hero.jpg"
  alt="히어로 이미지"
  width={1200}
  height={600}
  priority          // LCP 이미지에 필수
  placeholder="blur"
/>

// 외부 스크립트 최적화
<Script
  src="https://analytics.example.com/script.js"
  strategy="lazyOnload"  // afterInteractive | lazyOnload | beforeInteractive
/>
```

## 측정 방법

1. **Lighthouse** — Chrome DevTools → Lighthouse 탭 (시크릿 창에서 실행)
2. **Vercel Analytics** — 실제 사용자 데이터 기반 Web Vitals
3. **PageSpeed Insights** — Google의 실제 측정 데이터

## 주의사항

- 추측으로 최적화하지 않는다 — 수치 확인 후 작업
- 최적화 전/후 Lighthouse 점수를 비교 기록
- `useMemo`/`useCallback` 남발은 오히려 성능 저하
