import type { Section } from '@/lib/schema/section'
import type { DesignTokens } from '@/lib/schema/site'
import { Cta } from './cta'
import { Faq } from './faq'
import { Features } from './features'
import { Hero } from './hero'
import { Testimonials } from './testimonials'

export function renderSection(section: Section, base: string) {
  switch (section.type) {
    case 'hero':
      return <Hero key={section.id} section={section} base={base} />
    case 'features':
      return <Features key={section.id} section={section} base={base} />
    case 'faq':
      return <Faq key={section.id} section={section} base={base} />
    case 'cta':
      return <Cta key={section.id} section={section} base={base} />
    case 'testimonials':
      return <Testimonials key={section.id} section={section} base={base} />
  }
}

/** 디자인 토큰 → 사이트 루트 CSS 변수. 토큰을 바꾸면 모든 페이지에 반영된다. */
export function tokenStyle(t: DesignTokens): React.CSSProperties {
  return {
    '--o-primary': t.primary,
    '--o-bg': t.background,
    '--o-text': t.text,
    '--o-radius': `${t.radius}px`,
    background: t.background,
    color: t.text,
    fontFamily: t.font === 'serif' ? 'Georgia, "Noto Serif KR", serif' : undefined,
  } as React.CSSProperties
}
