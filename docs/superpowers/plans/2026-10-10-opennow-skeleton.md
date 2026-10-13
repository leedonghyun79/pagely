# Opennow Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. Spec: `docs/product-specs/opennow-skeleton.md`. Git repo가 아직 없어서 커밋 스텝은 없다. 필요하면 `git init` 후 태스크 단위로 커밋.

**Goal:** 스키마 기반 AI 웹빌더의 얇은 전체 뼈대(3단 에디터, 렌더러, 패치/되돌리기, mock AI, SEO)를 동작시킨다.

**Architecture:** 사이트는 Zod로 검증되는 JSON 문서. 모든 변경은 `applyOps` → Revision 한 경로. 렌더러와 에디터가 같은 섹션 컴포넌트를 쓴다. AI는 `LlmClient`가 반환한 툴 호출만 실행한다.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind 4, shadcn/ui, Zustand, Zod, better-sqlite3, Vitest.

---

## File Structure

| 파일 | 책임 |
|------|------|
| `lib/schema/section.ts` | 섹션 타입별 props Zod 스키마, `SectionSchema` |
| `lib/schema/site.ts` | `DesignTokens`, `Page`, `Site` 스키마 |
| `lib/site/ops.ts` | 순수 함수 `applyOps(site, ops)` (섹션 추가/삭제/이동/수정/variant/토큰) |
| `lib/site/draft.ts` | 브리프 → 초안 `Site` |
| `lib/site/seo.ts` | sitemap, robots, JSON-LD 생성 |
| `lib/ai/tools.ts` | 툴 이름 → Zod 인자 스키마 → Op 변환 |
| `lib/ai/llm.ts` | `LlmClient` 인터페이스 |
| `lib/ai/mock.ts` | 키워드 규칙 기반 `MockLlmClient` |
| `lib/ai/run.ts` | 메시지 → 툴 호출 검증 → 적용 |
| `lib/db/index.ts` | SQLite repository (sites, revisions) |
| `components/sections/*` | hero/features/faq/cta/testimonials + `registry.tsx` |
| `components/editor/*` | `SiteTree`, `PreviewPane`, `ChatPane`, `EditorShell` |
| `store/editor.ts` | 선택 섹션, 디바이스, 채팅 상태 |
| `app/preview/[siteId]/[[...route]]/page.tsx` | 렌더러 |
| `app/api/sites/...` | sites, ops, chat, revisions Route Handler |
| `app/(editor)/editor/[siteId]/page.tsx`, `app/page.tsx` | 에디터 화면, 브리프 입력 |

---

### Task 1: 프로젝트 정리 (이름, 문서)

**Files:** Modify `CLAUDE.md`, `ARCHITECTURE.md`, `README.md`, `.env.example`

- [ ] **Step 1:** `CLAUDE.md`의 `{PROJECT_NAME}`을 `Opennow`로, 스택 줄에 `Zod · better-sqlite3`를 추가한다.
- [ ] **Step 2:** `ARCHITECTURE.md`에 위 File Structure 표와 데이터 흐름(`UI/채팅 → ops → applyOps → Revision → 프리뷰 postMessage 갱신`)을 쓴다.
- [ ] **Step 3:** `.env.example`에 `DATABASE_PATH=./data/opennow.db`를 추가하고 `.gitignore`에 `data/`를 넣는다.

### Task 2: 스키마 (TDD)

**Files:** Create `lib/schema/section.ts`, `lib/schema/site.ts`, `__tests__/schema.test.ts`

- [ ] **Step 1: 실패하는 테스트**

```ts
import { describe, it, expect } from "vitest";
import { SectionSchema } from "@/lib/schema/section";

describe("SectionSchema", () => {
  it("hero 섹션을 통과시킨다", () => {
    const r = SectionSchema.safeParse({
      id: "sec_1", type: "hero", variant: "centered",
      props: { title: "제목", subtitle: "부제", cta: [{ label: "문의", href: "/contact" }] },
    });
    expect(r.success).toBe(true);
  });
  it("알 수 없는 type은 거부한다", () => {
    expect(SectionSchema.safeParse({ id: "x", type: "nope", variant: "a", props: {} }).success).toBe(false);
  });
  it("hero title이 없으면 거부한다", () => {
    expect(SectionSchema.safeParse({ id: "x", type: "hero", variant: "centered", props: {} }).success).toBe(false);
  });
});
```

- [ ] **Step 2:** `npx vitest run __tests__/schema.test.ts` → FAIL (모듈 없음)
- [ ] **Step 3: 구현** `lib/schema/section.ts`

```ts
import { z } from "zod";

const Cta = z.object({ label: z.string().min(1), href: z.string().min(1) });

export const SECTION_VARIANTS = {
  hero: ["centered", "split"],
  features: ["grid", "list"],
  faq: ["accordion", "two-column"],
  cta: ["banner", "card"],
  testimonials: ["cards", "quote"],
} as const;
export type SectionType = keyof typeof SECTION_VARIANTS;

export const PropsByType = {
  hero: z.object({ eyebrow: z.string().optional(), title: z.string().min(1), subtitle: z.string().optional(), cta: z.array(Cta).default([]) }),
  features: z.object({ title: z.string().min(1), items: z.array(z.object({ title: z.string(), body: z.string() })).min(1) }),
  faq: z.object({ title: z.string().min(1), items: z.array(z.object({ q: z.string(), a: z.string() })).min(1) }),
  cta: z.object({ title: z.string().min(1), body: z.string().optional(), button: Cta }),
  testimonials: z.object({ title: z.string().min(1), items: z.array(z.object({ name: z.string(), quote: z.string() })).min(1) }),
} as const;

const make = <T extends SectionType>(type: T) =>
  z.object({
    id: z.string().min(1),
    type: z.literal(type),
    variant: z.enum(SECTION_VARIANTS[type]),
    props: PropsByType[type],
  });

export const SectionSchema = z.discriminatedUnion("type", [
  make("hero"), make("features"), make("faq"), make("cta"), make("testimonials"),
]);
export type Section = z.infer<typeof SectionSchema>;
```

`lib/schema/site.ts`

```ts
import { z } from "zod";
import { SectionSchema } from "./section";

export const DesignTokensSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  text: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  font: z.enum(["sans", "serif"]),
  radius: z.number().int().min(0).max(32),
});
export type DesignTokens = z.infer<typeof DesignTokensSchema>;

export const PageSchema = z.object({
  route: z.string().regex(/^\/[a-z0-9-/]*$/),
  title: z.string().min(1),
  seo: z.object({ description: z.string().default(""), ogImage: z.string().optional(), noindex: z.boolean().default(false) }),
  sections: z.array(SectionSchema),
});
export type Page = z.infer<typeof PageSchema>;

export const SiteSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  locale: z.string().default("ko"),
  tokens: DesignTokensSchema,
  pages: z.array(PageSchema).min(1),
});
export type Site = z.infer<typeof SiteSchema>;
```

- [ ] **Step 4:** 같은 명령 → PASS

### Task 3: 순수 패치 함수 `applyOps` (TDD)

**Files:** Create `lib/site/ops.ts`, `__tests__/ops.test.ts`

Op 타입: `update_section {route, sectionId, props}`(얕은 병합 후 Zod 재검증), `add_section {route, section, index?}`, `remove_section {route, sectionId}`, `move_section {route, sectionId, toIndex}`, `change_variant {route, sectionId, variant}`, `update_design_tokens {tokens}`, `update_page_seo {route, title?, description?, noindex?}`.

- [ ] **Step 1:** 테스트: update_section이 병합 후 불변(원본 미변경), 잘못된 props는 throw, remove/move/variant/tokens 각각 1개씩, 없는 sectionId는 throw.
- [ ] **Step 2:** 실행 → FAIL
- [ ] **Step 3:** `applyOps(site: Site, ops: Op[]): Site` 구현. 각 Op 적용 후 `SiteSchema.parse`로 결과를 검증하고, 입력은 `structuredClone`한다.
- [ ] **Step 4:** 실행 → PASS

### Task 4: 초안 생성 (TDD)

**Files:** Create `lib/site/draft.ts`, `__tests__/draft.test.ts`

- [ ] **Step 1:** 테스트: `createDraft({ name:"은혜교회", industry:"church", tone:"warm" })`가 `SiteSchema`를 통과하고 `/`, `/about`, `/contact` 3페이지이며 홈 첫 섹션이 hero인지 확인.
- [ ] **Step 2–4:** 업종 문구 테이블(church/cafe/agency/generic)과 톤별 토큰으로 구현 → PASS. 섹션 id는 `sec_<type>_<n>` 형식으로 생성.

### Task 5: SEO 생성 (TDD)

**Files:** Create `lib/site/seo.ts`, `__tests__/seo.test.ts`

- [ ] 테스트: `buildSitemap(site, origin)`에 noindex 페이지 제외, `buildRobots(origin)`에 Sitemap 줄 포함, `buildJsonLd(site)`가 `Organization`과 faq 섹션이 있으면 `FAQPage`를 포함.
- [ ] 구현 후 PASS.

### Task 6: AI 툴 + mock + 실행기 (TDD)

**Files:** Create `lib/ai/tools.ts`, `lib/ai/llm.ts`, `lib/ai/mock.ts`, `lib/ai/run.ts`, `__tests__/ai.test.ts`

- [ ] **Step 1:** 테스트
  - `toOps({name:"update_section", args:{...}})` 유효 인자는 Op, 잘못된 인자(없는 필드)는 throw.
  - `runChat(site, "히어로 문구 더 짧게", { selectedSectionId: undefined }, new MockLlmClient())`가 hero title이 짧아진 새 Site와 요약 문자열을 반환.
  - 알 수 없는 요청은 변경 없이 안내 메시지 반환.
- [ ] **Step 2:** FAIL 확인
- [ ] **Step 3:** 구현
  - `LlmClient { complete(input: { message: string; site: Site; selectedSectionId?: string }): Promise<{ text: string; toolCalls: { name: string; args: unknown }[] }> }`
  - `MockLlmClient` 규칙: "짧게" → 대상 섹션(선택 또는 hero) title을 12자 이내로 축약, "추가" + (FAQ|후기|CTA|특징) → 해당 add_section, "삭제" → 선택 섹션 remove, "색|컬러" + hex → update_design_tokens primary.
  - `runChat`: toolCalls를 `toOps`로 검증, 실패 시 1회 재요청(에러 첨부) 후 포기, 성공 시 `applyOps`.
- [ ] **Step 4:** PASS

### Task 7: DB repository (TDD)

**Files:** Create `lib/db/index.ts`, `__tests__/db.test.ts`

- [ ] 테이블: `sites(id, json, updated_at)`, `revisions(id, site_id, snapshot, ops, author, summary, created_at)`.
- [ ] 함수: `saveSite`, `getSite`, `listSites`, `addRevision`, `listRevisions`, `getRevision`. `DATABASE_PATH`가 `:memory:`이면 메모리 DB(테스트용).
- [ ] 테스트: 저장/조회 왕복, 리비전 최신순, 존재하지 않는 id는 null.
- [ ] `commitOps(siteId, ops, author, summary)` 헬퍼: `applyOps` → `saveSite` → `addRevision`을 한 트랜잭션으로. 되돌리기는 `restoreRevision(revisionId)`로 스냅샷을 현재로 저장하고 새 리비전을 남긴다(히스토리 보존).

### Task 8: 섹션 컴포넌트 10종 + registry

**Files:** Create `components/sections/{hero,features,faq,cta,testimonials}.tsx`, `components/sections/registry.tsx`, `__tests__/sections.test.tsx`

- [ ] 각 컴포넌트는 `{ section, tokens }`를 받고 최상위 요소에 `data-section-id`를 단다. 색/라운드는 CSS 변수(`--primary`, `--radius`)로 받는다.
- [ ] `registry.tsx`: `renderSection(section)`이 `type`으로 컴포넌트를 고르고 `variant`로 분기.
- [ ] 테스트: 10개 조합이 크래시 없이 렌더되고 `data-section-id`가 붙는지 Testing Library로 확인.

### Task 9: 렌더러 + SEO 라우트

**Files:** Create `app/preview/[siteId]/[[...route]]/page.tsx`, `app/sites/[siteId]/sitemap.xml/route.ts`, `app/sites/[siteId]/robots.txt/route.ts`

- [ ] 페이지는 서버 컴포넌트로 DB에서 site 로드 → 토큰을 CSS 변수로 주입 → 섹션 렌더 → `generateMetadata`(title, description, noindex) + JSON-LD `<script>`.
- [ ] 클라이언트 브리지(`PreviewBridge`): `?edit=1`이면 섹션 클릭 시 `parent.postMessage({type:"select", id})`, 부모의 `{type:"highlight", id}`를 받아 outline 표시.

### Task 10: API Route Handler

**Files:** Create `app/api/sites/route.ts`(POST 브리프→초안 저장), `app/api/sites/[id]/route.ts`(GET), `app/api/sites/[id]/chat/route.ts`, `app/api/sites/[id]/ops/route.ts`, `app/api/sites/[id]/revisions/route.ts`(GET 목록, POST 복원)

- [ ] 모든 본문은 Zod로 검증하고 실패 시 400. 변경은 `commitOps`만 호출한다.
- [ ] 테스트(`__tests__/api.test.ts`): 초안 생성 → chat → revisions 복원 흐름을 핸들러 함수 직접 호출로 검증.

### Task 11: 에디터 UI

**Files:** Create `store/editor.ts`, `components/editor/{EditorShell,SiteTree,PreviewPane,ChatPane}.tsx`, `app/(editor)/editor/[siteId]/page.tsx`; Modify `app/page.tsx`, `app/layout.tsx`

- [ ] `store/editor.ts`: `selectedSectionId`, `device("phone"|"tablet"|"pc")`, `editMode`, `messages`, `previewVersion`.
- [ ] `SiteTree`: 디자인 시스템(토큰 편집), 페이지 목록, 페이지별 섹션 목록(클릭 선택, 위/아래 이동, 삭제 버튼은 ops API 호출).
- [ ] `PreviewPane`: iframe(`/preview/{id}{route}?edit=1&v={previewVersion}`), 디바이스 토글, 경로 입력, 새로고침, postMessage 수신 → `selectedSectionId`.
- [ ] `ChatPane`: 입력/전송, 선택 섹션 칩 표시, 응답 요약 + 되돌리기 버튼, 편집 모드 토글, 추천 칩("히어로 문구 더 짧게", "FAQ 추가해줘").
- [ ] `app/page.tsx`: 브리프 폼(상호, 업종, 톤) + 기존 사이트 목록 → 생성 후 에디터로 이동.
- [ ] 레이아웃은 이미지 톤(밝은 배경, 얇은 보더, 둥근 카드, 상단 바)을 따른다.

### Task 12: 검증

- [ ] `npm run verify` (typecheck, lint, test, build) 전부 통과.
- [ ] `npm run dev` 후 브라우저에서: 브리프 → 초안 → 프리뷰 → 섹션 클릭 → 채팅 수정 → 되돌리기 → `/sites/{id}/sitemap.xml` 확인.
- [ ] `skills/lessons-learned.md`에 이번 교훈 추가, `docs/exec-plans/completed/`에 이 계획 요약 이동.

---

## Self-Review

- **스펙 커버리지:** 3단 에디터(T11), 스키마(T2), 섹션 5x2(T8), 렌더러(T9), 편집 모드(T9, T11), 패치/Revision(T3, T7, T10), AI mock(T6), SEO/페이지 설정(T3 `update_page_seo`, T5, T9), 초안(T4). 빠진 항목 없음.
- **타입 일관성:** `Op`/`applyOps`(T3)를 T6, T7, T10이 그대로 사용. `LlmClient.complete` 시그니처는 T6에서만 정의.
