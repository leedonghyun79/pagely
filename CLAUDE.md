# Pagely

채팅으로 사이트를 만들고 고치는 AI 웹빌더. 페이지는 코드가 아니라 Zod 스키마(JSON)로 저장하고, AI는 정해진 툴로 스키마만 패치한다. 스펙: [docs/product-specs/pagely-skeleton.md](docs/product-specs/pagely-skeleton.md)

## 기술 스택

- **Next.js 16** (App Router) · **TypeScript** · **Tailwind CSS 4**
- **shadcn/ui** (컴포넌트) · **Zustand** (에디터 UI 상태) · **Zod** (스키마 단일 소스)
- 저장: 로컬 JSON 파일 (`data/`, `lib/db/index.ts` 한 곳에서만 접근)
- AI: `LlmClient` 인터페이스 + `MockLlmClient` (실제 모델은 `app/api/sites/[id]/chat/route.ts`의 한 줄 교체)
- **Vitest** + **Testing Library** (테스트)
- **ESLint** + **Prettier** (코드 품질)
- **Vercel** (배포)

## 에이전트 진입점

→ [AGENTS.md](./AGENTS.md) — 모든 작업의 시작점
→ [docs/index.md](./docs/index.md) — 전체 문서 맵

## 하네스 스택

| 계층   | 도구                               | 역할                                              |
| ------ | ---------------------------------- | ------------------------------------------------- |
| 스킬   | Superpowers (Claude Code 플러그인) | `/brainstorm`, `/write-plan`, TDD, 코드리뷰       |
| 메모리 | Compound Engineering               | `skills/lessons-learned.md` — 같은 실수 반복 방지 |
| 시스템 | docs/ + AGENTS.md                  | 에이전트 가독성 지식 베이스 + 실행 규칙           |

## 실행 흐름

```
1. /brainstorm     → 요구사항 정제, 설계 문서 생성
2. /write-plan     → 2~5분 단위 슬라이스 분해 → exec-plan 작성
3. 서브에이전트    → 각 슬라이스 실행 + TDD (RED → GREEN → REFACTOR)
4. /review         → 계획 준수 여부 검증
5. Compound        → skills/lessons-learned.md 업데이트
6. 완료            → exec-plan을 completed/로 이동
```

## Compound Engineering 규칙

**코딩 작업 전**: `skills/lessons-learned.md`를 읽고 등록된 교훈을 반드시 적용한다.
**작업 완료 후**: 이번 세션의 리워크 원인을 교훈으로 추가한다.

## 주요 규칙

- 모든 변경은 `docs/exec-plans/active/`에 exec-plan을 먼저 작성
- 작은 슬라이스 단위로만 — PR 하나에 하나의 관심사
- `scripts/verify.sh` 통과 후에만 작업 완료 처리
- 고위험 변경(인증, 스키마, 파괴적 변경)은 반드시 승인 후 진행

## 자율성

- 저위험(문서, 테스트, 리팩터링): 자율 진행 후 보고
- 고위험: 중단하고 먼저 확인
