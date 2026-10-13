# 랜딩 SEO 보강

## 목표
/landing(마케팅 페이지)이 검색·AI 답변에 인용되도록 기술 SEO 누락분을 채운다. 진단: `result/2026-10-14-phase0-진단.md`

## 수용 기준
- robots.txt / sitemap.xml / llms.txt가 200으로 응답, `/editor`·`/api`·`/preview` 차단
- /landing, / 에 canonical·OG·Twitter 메타, metadataBase
- /landing에 Organization·WebSite·SoftwareApplication·FAQPage JSON-LD (가시 FAQ와 동일 데이터)
- `/lading`은 영구 리다이렉트
- `npm run verify` 통과

## 슬라이스
1. [x] `lib/seo/marketing.ts` (사이트 URL, JSON-LD 빌더) + 테스트
2. [x] robots/sitemap/llms.txt
3. [x] 메타·JSON-LD 적용, 리다이렉트
4. [x] tsc·vitest·curl 검증 + 보고 (build는 dev 서버 때문에 보류)
