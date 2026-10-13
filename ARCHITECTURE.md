# 아키텍처

## 개요
Opennow는 사이트 하나를 Zod로 검증되는 JSON 문서(`Site`)로 다룬다. 편집기 프리뷰와 공개 렌더러가 같은 섹션 컴포넌트를 쓰므로 프리뷰에서 보이는 것이 곧 결과다. 모든 변경(사람, AI)은 `applyOps` → Revision 한 경로를 거친다.

## 디렉터리 구조
```
lib/schema/     Zod 스키마 (섹션 props, DesignTokens, Page, Site)
lib/site/       ops(순수 패치), draft(초안 생성), seo(sitemap/robots/JSON-LD)
lib/ai/         llm(인터페이스), mock, tools(툴→Op 검증), run(검증+1회 재시도+적용)
lib/db/         로컬 JSON 저장소 + Revision (commitOps, restoreRevision)
lib/api.ts      Route Handler 공통 에러 처리
components/sections/   hero, features, faq, cta, testimonials (각 variant 2개) + registry
components/editor/     SiteTree, PreviewPane, ChatPane, EditorShell, PreviewBridge, IdeaForm
store/editor.ts        Zustand: 선택 섹션, 디바이스, 채팅, API 호출 액션
app/page.tsx           브리프 입력 + 사이트 목록
app/editor/[siteId]    3단 에디터
app/preview/[siteId]/[[...route]]   렌더러 (편집 모드 ?edit=1)
app/sites/[siteId]/sitemap.xml|robots.txt
app/api/sites/...      sites, chat, ops, revisions
data/                  런타임 데이터 (git 제외)
```

## 데이터 흐름
```
채팅/트리 조작 → API → (AI면 LlmClient → toOps Zod 검증, 실패 시 1회 재시도)
  → commitOps: applyOps(검증) → saveSite → Revision(변경 전 snapshot)
  → 응답 → store 갱신 → previewVersion++ → iframe 리로드
편집 모드: iframe 섹션 클릭 → postMessage(select) → store.selectedSectionId → 채팅 컨텍스트
```

## 주요 제약 사항
- TypeScript strict, 서버 컴포넌트 우선
- 스키마 변경은 `commitOps`만 호출한다 (직접 `saveSite` 금지, 초안 생성 제외)
- 섹션 id는 사이트 안에서 유일해야 한다 (편집 모드 선택 키)
- 저장소 접근은 `lib/db/index.ts`에서만

## 향후 확장 포인트
- 실제 Claude 연동: `LlmClient` 구현체 추가 후 chat route에서 교체
- 저장소: `lib/db`를 Postgres로 교체 (함수 시그니처 유지)
- 발행/도메인, 컬렉션(CMS), 폼, 미디어, 권한, 인라인 텍스트 편집
