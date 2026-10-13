# SEO 가이드

## 체크리스트

### 기본 메타데이터
- [ ] 모든 페이지에 고유한 `title`이 있는가? (50~60자)
- [ ] 모든 페이지에 `description`이 있는가? (120~160자)
- [ ] `canonical` URL이 설정되어 있는가?
- [ ] `robots` 메타태그가 적절히 설정되어 있는가?

### Open Graph / SNS 공유
- [ ] `og:title`, `og:description`, `og:image`가 설정되어 있는가?
- [ ] OG 이미지 크기가 1200×630px인가?
- [ ] `twitter:card`, `twitter:image`가 설정되어 있는가?
- [ ] OG 이미지가 실제 URL로 접근 가능한가?

### 구조적 데이터
- [ ] `sitemap.xml`이 생성되어 있는가?
- [ ] `robots.txt`가 적절히 설정되어 있는가?
- [ ] 필요한 경우 JSON-LD 스키마가 있는가?

### 기술적 SEO
- [ ] 페이지 로드 속도가 충분한가? (LCP < 2.5s)
- [ ] 모바일 친화적인가? (반응형 디자인)
- [ ] HTTPS가 적용되어 있는가?
- [ ] 이미지에 `alt` 속성이 있는가?
- [ ] 제목 태그 계층(h1 → h2 → h3)이 올바른가?
- [ ] h1은 페이지당 하나인가?

### URL 구조
- [ ] URL이 의미 있는 키워드를 포함하는가?
- [ ] URL에 한글 대신 영어 슬러그를 사용하는가?
- [ ] 트레일링 슬래시 정책이 일관적인가?

---

## Next.js 구현

```ts
// app/layout.tsx — 기본 메타데이터
export const metadata: Metadata = {
  title: {
    default: '사이트명',
    template: '%s | 사이트명',  // 각 페이지: "페이지명 | 사이트명"
  },
  description: '사이트 설명 (120~160자)',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://example.com',
    siteName: '사이트명',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// app/sitemap.ts — 자동 sitemap 생성
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://example.com', lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: 'https://example.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];
}

// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

## 동적 페이지 메타데이터

```ts
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}
```

## 주의사항

- `NEXT_PUBLIC_SITE_URL` 환경변수로 도메인 관리 (하드코딩 금지)
- 개발 환경 페이지는 `noindex` 처리
- 로그인 필요 페이지는 `noindex` 처리
