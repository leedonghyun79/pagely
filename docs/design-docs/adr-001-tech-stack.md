# ADR-001: 기술 스택 선택

## 상태
채택됨 — {날짜}

## 배경
프로덕션 수준의 Next.js 보일러플레이트. Vercel에 최소 설정으로 배포 가능해야 한다.

## 결정
- **프레임워크**: Next.js 14 (App Router) — 업계 표준, Vercel 네이티브
- **언어**: TypeScript — 타입 안전성, 에이전트 가독성
- **스타일링**: Tailwind CSS v4 — 유틸리티 우선, 런타임 CSS 오버헤드 없음
- **컴포넌트**: shadcn/ui — 접근성 확보, 프로젝트 완전 소유
- **상태 관리**: Zustand — 최소 보일러플레이트 (필요 시 사용)
- **테스트**: Vitest + Testing Library + happy-dom
- **린트/포맷**: ESLint + Prettier (pre-commit 훅 포함)
- **배포**: Vercel — Next.js 제로 설정 배포

## 결과
- App Router 사용 시 React 서버 컴포넌트 개념 숙지 필요
- shadcn/ui 컴포넌트는 패키지가 아닌 리포에 직접 복사 — 의도적 선택
- Node.js 20.9 이하에서는 Vitest v2 + happy-dom 사용 (v4는 Node 20.19+ 필요)
