export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export const SITE_NAME = 'Pagely'
export const SITE_TAGLINE = '말로 만들고, 말로 고치는 웹사이트'

export type FaqItem = { q: string; a: string }

export function buildFaqLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage' as const,
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question' as const,
      name: q,
      acceptedAnswer: { '@type': 'Answer' as const, text: a },
    })),
  }
}

/** Organization·WebSite·SoftwareApplication — 같은 엔티티는 @id로 한 번만 선언하고 참조한다 */
export function buildSiteLd(origin: string, description = '') {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${origin}/#org`, name: SITE_NAME, url: origin },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: origin,
        name: SITE_NAME,
        inLanguage: 'ko-KR',
        publisher: { '@id': `${origin}/#org` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${origin}/#app`,
        name: SITE_NAME,
        url: `${origin}/landing`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description,
        publisher: { '@id': `${origin}/#org` },
      },
    ],
  }
}

/** <script> 안에 넣을 JSON. `<`를 이스케이프해 </script> 탈출을 막는다 */
export function serializeLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
