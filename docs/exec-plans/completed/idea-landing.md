# 아이디어 설명 랜딩

## 목표

홈 화면을 "아이디어 한 줄 입력 → 초안 생성" 구조로 바꾼다. (URL/이미지/HTML/Figma 변환은 이번 범위 아님)

## 수용 기준

- 홈에 큰 입력창 + 예시 칩 + 전송 버튼이 있고, 입력하면 3페이지 초안이 생성돼 에디터로 이동한다.
- 문장에서 업종/톤/상호를 규칙 기반으로 뽑는다 (mock 단계, 실제 LLM 교체 지점은 `lib/site/idea.ts` 한 곳).
- 기존 브리프 폼은 "자세히 설정"으로 남긴다.
- `POST /api/sites`는 `{idea}` 또는 기존 브리프 둘 다 받는다. 빈/과장 입력은 Zod에서 400.

## 슬라이스

1. [x] `lib/site/idea.ts` `parseIdea()` + 테스트 (RED → GREEN)
2. [x] API가 `{idea}` 수용 + 테스트
3. [x] `IdeaForm` UI, 홈 개편, 기존 폼은 접기
4. [x] `npm run verify`, lessons-learned 갱신

## 리스크

- 키워드 추출은 부정확함 → 결과는 에디터에서 채팅으로 수정 가능. 실제 LLM 연동 시 `parseIdea`만 교체.
