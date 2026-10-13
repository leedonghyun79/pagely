# Pagely

채팅으로 사이트를 만들고 고치는 AI 웹빌더 (뼈대 v0).

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run verify     # typecheck + lint + test + build
```

1. 홈에서 상호/업종/톤을 입력해 초안을 만든다.
2. 에디터: 좌측 트리(디자인 토큰, 페이지, 섹션) / 가운데 프리뷰 / 우측 AI 채팅.
3. 채팅 예: "히어로 문구 더 짧게", "FAQ 추가해줘", "파랑으로 바꿔줘". 프리뷰에서 섹션을 클릭하면 그 섹션만 수정한다.
4. 채팅 응답의 "되돌리기"로 직전 변경을 복원한다.

AI는 현재 mock(키워드 규칙)이다. 구조는 [ARCHITECTURE.md](ARCHITECTURE.md), 스펙은 [docs/product-specs/pagely-skeleton.md](docs/product-specs/pagely-skeleton.md) 참고.
