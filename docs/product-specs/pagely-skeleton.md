# Pagely 뼈대 스펙 (v0)

AI 채팅으로 사이트를 만들고 고치는 웹빌더. 페이지는 코드가 아니라 **스키마(JSON)** 로 저장하고, AI는 스키마만 패치한다. 렌더링은 미리 만든 섹션 컴포넌트가 맡는다.

## 이번 범위 (얇게 전부)

1. 3단 에디터: 좌 사이트 트리 / 가운데 iframe 프리뷰 / 우 AI 채팅
2. Zod 스키마: Site, Page, Section, DesignTokens
3. 섹션 5종 x variant 2개: hero, features, faq, cta, testimonials
4. 렌더러: `/preview/[siteId]/[[...route]]` (프리뷰 = 공개 사이트와 같은 컴포넌트)
5. 편집 모드: `data-section-id` + postMessage 선택/하이라이트, 선택 섹션을 채팅 컨텍스트로 전달
6. 패치 + Revision: 모든 변경은 `applyPatch` 한 경로, 되돌리기 지원
7. AI 파이프라인: 툴 호출 → Zod 검증 → 패치. `LlmClient` 인터페이스 + 키워드 기반 mock 구현체
8. 페이지 설정(title, description, OG, noindex) + sitemap.xml, robots.txt, JSON-LD
9. 초안 생성: 브리프(업종, 상호, 톤) → 홈/소개/문의 페이지

## 제외

발행/도메인/SSL, 컬렉션(CMS), 폼 제출, 미디어 업로드, 권한, 애널리틱스, 다국어, 결제, `/` 명령어, 실제 LLM 호출, 인라인 텍스트 편집.

## 결정 사항

- 저장: SQLite(`better-sqlite3`) + JSON 컬럼. `lib/db/` repository 한 겹으로 감싸 나중에 Postgres 교체 가능하게 한다.
- API: Next.js Route Handler. 스키마 변경의 단일 창구는 `lib/site/patch.ts`.
- AI: `LlmClient` 인터페이스. 지금은 `MockLlmClient`. 실제 Claude 연동은 구현체만 교체한다 (API 키는 서버 `.env`에서만).
- 상태: Zustand는 에디터 UI 상태(선택 섹션, 디바이스, 채팅)만.

## 디렉터리

```
lib/schema/      Zod 스키마 (공통 소스)
lib/site/        patch, revision, 초안 생성, seo
lib/ai/          tools, LlmClient, mock
lib/db/          SQLite repository
components/sections/   섹션 컴포넌트 + registry
components/editor/     트리, 프리뷰, 채팅
app/(editor)/    에디터 화면
app/preview/     렌더러
app/api/         sites, patch, chat, revisions
```

## 수용 기준

- 브리프 입력 시 3페이지 초안이 생성되고 프리뷰에 보인다.
- 채팅에 "히어로 문구 더 짧게" 류 입력 시 해당 섹션만 바뀌고 되돌리기가 된다.
- 프리뷰에서 섹션을 클릭하면 선택되어 채팅 컨텍스트에 붙는다.
- 잘못된 툴 인자는 Zod에서 거부된다.
- `npm run verify` 통과.
