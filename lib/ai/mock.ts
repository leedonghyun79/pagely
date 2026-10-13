import { randomUUID } from 'node:crypto'
import { SECTION_VARIANTS, type Section } from '@/lib/schema/section'
import type { Site } from '@/lib/schema/site'
import type { LlmClient, LlmInput, LlmOutput } from './llm'

const COLORS: Record<string, string> = {
  빨강: '#dc2626',
  파랑: '#2563eb',
  초록: '#16a34a',
  보라: '#7c3aed',
  주황: '#ea580c',
  검정: '#111827',
}

function locate(site: Site, id?: string) {
  for (const page of site.pages) {
    const section = page.sections.find((s) => s.id === id)
    if (section) return { route: page.route, section }
  }
  return undefined
}

function shorten(text: string) {
  const target = Math.max(4, Math.floor(text.length * 0.6))
  let out = ''
  for (const word of text.split(' ')) {
    const next = out ? `${out} ${word}` : word
    if (next.length > target) break
    out = next
  }
  return out || text.slice(0, target)
}

function newSection(kind: 'faq' | 'testimonials' | 'cta' | 'features'): Section {
  const id = `sec_${kind}_${randomUUID().slice(0, 6)}`
  switch (kind) {
    case 'faq':
      return { id, type: 'faq', variant: 'accordion', props: { title: '자주 묻는 질문', items: [{ q: '질문을 입력하세요', a: '답변을 입력하세요' }] } }
    case 'testimonials':
      return { id, type: 'testimonials', variant: 'cards', props: { title: '후기', items: [{ name: '고객', quote: '후기를 입력하세요' }] } }
    case 'cta':
      return { id, type: 'cta', variant: 'banner', props: { title: '지금 시작해 보세요', button: { label: '문의하기', href: '/contact' } } }
    case 'features':
      return { id, type: 'features', variant: 'grid', props: { title: '특징', items: [{ title: '특징 1', body: '설명을 입력하세요' }] } }
  }
}

/** 키워드 규칙으로 툴 호출을 만들어내는 모델 대역. 파이프라인 검증용. */
export class MockLlmClient implements LlmClient {
  async complete({ message, site, selectedSectionId }: LlmInput): Promise<LlmOutput> {
    const picked = locate(site, selectedSectionId)
    const hero = site.pages[0].sections.find((s) => s.type === 'hero')
    const target = picked ?? (hero ? { route: site.pages[0].route, section: hero } : undefined)
    const unknown: LlmOutput = {
      text: '아직 이해 못 한 요청이야. 예: "히어로 문구 더 짧게", "FAQ 추가해줘", "파랑으로 바꿔줘"',
      toolCalls: [],
    }

    const hex = message.match(/#[0-9a-fA-F]{6}/)?.[0]
    const colorWord = Object.keys(COLORS).find((k) => message.includes(k))
    if (hex || colorWord) {
      const primary = hex ?? COLORS[colorWord!]
      return {
        text: `메인 컬러를 ${primary}로 바꿨어.`,
        toolCalls: [{ name: 'update_design_tokens', args: { tokens: { primary } } }],
      }
    }

    if (message.includes('추가')) {
      const kind = message.includes('FAQ') || message.includes('질문')
        ? 'faq'
        : message.includes('후기')
          ? 'testimonials'
          : message.toUpperCase().includes('CTA')
            ? 'cta'
            : message.includes('특징')
              ? 'features'
              : undefined
      if (!kind) return unknown
      return {
        text: '섹션을 추가했어.',
        toolCalls: [{ name: 'add_section', args: { route: target?.route ?? '/', section: newSection(kind) } }],
      }
    }

    if (!target) return unknown

    if (message.includes('삭제')) {
      if (!picked) return { text: '삭제할 섹션을 프리뷰에서 먼저 선택해줘.', toolCalls: [] }
      return {
        text: '섹션을 삭제했어.',
        toolCalls: [{ name: 'remove_section', args: { route: target.route, sectionId: target.section.id } }],
      }
    }

    if (message.includes('짧게')) {
      const props = target.section.props as { title?: string }
      if (!props.title) return unknown
      return {
        text: '제목을 줄였어.',
        toolCalls: [
          { name: 'update_section', args: { route: target.route, sectionId: target.section.id, props: { title: shorten(props.title) } } },
        ],
      }
    }

    if (message.includes('레이아웃') || message.includes('변형')) {
      const options: readonly string[] = SECTION_VARIANTS[target.section.type]
      const next = options.find((v) => v !== target.section.variant) ?? target.section.variant
      return {
        text: `레이아웃을 ${next}로 바꿨어.`,
        toolCalls: [{ name: 'change_variant', args: { route: target.route, sectionId: target.section.id, variant: next } }],
      }
    }

    return unknown
  }
}
