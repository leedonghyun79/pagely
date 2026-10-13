import type { Brief, Industry, Tone } from './draft'

const INDUSTRY_KEYWORDS: [Industry, RegExp][] = [
  ['church', /교회|예배|성당/],
  ['cafe', /카페|커피|베이커리|디저트/],
  ['agency', /에이전시|제작\s*회사|스튜디오/],
]

const TONE_KEYWORDS: [Tone, RegExp][] = [
  ['classic', /클래식|고풍|전통|격식|고급/],
  ['modern', /모던|세련|깔끔|미니멀|감각/],
  ['warm', /따뜻|포근|아늑|친근/],
]

const DEFAULT_TONE: Record<Industry, Tone> = {
  church: 'warm',
  cafe: 'warm',
  agency: 'modern',
  generic: 'modern',
}
const DEFAULT_NAME = '내 사이트'

function findName(text: string): string {
  const quoted = text.match(/["“'‘]([^"”'’]{1,60})["”'’]/)
  if (quoted) return quoted[1].trim()
  const labeled = text.match(/상호(?:명)?(?:은|는|:)?\s*["“']?([^\s"”',.]+)/)
  if (labeled) return labeled[1]
  const suffixed = text.match(/([가-힣A-Za-z0-9]{1,20}(?:교회|카페))/)
  if (suffixed) return suffixed[1]
  return DEFAULT_NAME
}

/**
 * 자유 문장 → 브리프. 지금은 키워드 규칙(mock).
 * 실제 LLM을 붙일 때 이 함수만 교체한다.
 */
export function parseIdea(text: string): Brief {
  const industry = INDUSTRY_KEYWORDS.find(([, re]) => re.test(text))?.[0] ?? 'generic'
  const tone = TONE_KEYWORDS.find(([, re]) => re.test(text))?.[0] ?? DEFAULT_TONE[industry]
  return { name: findName(text).slice(0, 60), industry, tone }
}
