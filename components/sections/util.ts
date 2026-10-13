import type { Section } from '@/lib/schema/section'

export type SectionOf<T extends Section['type']> = Extract<Section, { type: T }>

export interface SectionProps<T extends Section['type']> {
  section: SectionOf<T>
  /** 프리뷰 안에서 내부 링크가 사이트 경로를 유지하도록 붙이는 접두사 (예: /preview/site_x) */
  base: string
}

export function resolveHref(base: string, href: string) {
  return href.startsWith('/') ? `${base}${href === '/' ? '' : href}` : href
}
