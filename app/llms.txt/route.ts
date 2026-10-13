import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/seo/marketing'

export const dynamic = 'force-static'

export function GET() {
  const body = `# ${SITE_NAME}

> ${SITE_TAGLINE}. 업종·상호·분위기를 한 줄로 적으면 홈·소개·문의 3페이지 초안이 만들어지고, 이후 수정은 채팅으로 합니다. 페이지는 코드가 아닌 스키마(JSON)로 저장되고 모든 변경은 기록되어 되돌릴 수 있습니다.

## 페이지
- [서비스 소개](${SITE_URL}/landing): 사용법, 특징, 자주 묻는 질문
- [시작하기](${SITE_URL}/): 아이디어를 입력해 초안 만들기
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
