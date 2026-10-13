import { randomUUID } from 'node:crypto'
import type { Section } from '@/lib/schema/section'
import type { DesignTokens, Site } from '@/lib/schema/site'

export type Industry = 'church' | 'cafe' | 'agency' | 'generic'
export type Tone = 'warm' | 'modern' | 'classic'

export interface Brief {
  name: string
  industry: Industry
  tone: Tone
}

const COPY: Record<Industry, { eyebrow: string; title: string; subtitle: string; cta: string; features: [string, string][]; faq: [string, string][] }> = {
  church: {
    eyebrow: '처음 오신 분을 환영합니다',
    title: '복음으로 세우는 교회',
    subtitle: '처음 오시는 분도 편안한 교회입니다.',
    cta: '처음 오시나요',
    features: [
      ['주일 예배', '매주 일요일 오전 9시, 11시'],
      ['찾아오시는 길', '교회 위치와 주차 안내'],
      ['새가족 안내', '등록부터 소그룹까지 함께합니다'],
    ],
    faq: [
      ['처음 가도 되나요?', '누구나 편하게 오실 수 있어요.'],
      ['주차는 가능한가요?', '교회 주차장을 이용하실 수 있어요.'],
    ],
  },
  cafe: {
    eyebrow: '오늘의 한 잔',
    title: '여유가 머무는 카페',
    subtitle: '직접 로스팅한 원두와 수제 디저트.',
    cta: '메뉴 보기',
    features: [
      ['싱글 오리진', '매주 바뀌는 원두'],
      ['수제 디저트', '매일 아침 구워요'],
      ['예약 공간', '소모임 대관 가능'],
    ],
    faq: [
      ['영업시간이 어떻게 되나요?', '매일 10시부터 21시까지예요.'],
      ['반려동물 동반 가능한가요?', '테라스에서 가능해요.'],
    ],
  },
  agency: {
    eyebrow: '웹 에이전시',
    title: '검색에 잡히는 홈페이지',
    subtitle: '기획부터 SEO까지 한 번에.',
    cta: '무료 상담',
    features: [
      ['빠른 제작', '초안을 하루 안에'],
      ['SEO 기본 탑재', '메타, 사이트맵, 구조화 데이터'],
      ['직접 수정', '코딩 없이 문구 변경'],
    ],
    faq: [
      ['제작 기간은요?', '보통 2~4주 걸려요.'],
      ['수정은 어떻게 하나요?', '채팅으로 바로 고칠 수 있어요.'],
    ],
  },
  generic: {
    eyebrow: '환영합니다',
    title: '우리를 소개합니다',
    subtitle: '필요한 정보를 한눈에 확인하세요.',
    cta: '문의하기',
    features: [
      ['신뢰', '검증된 경험'],
      ['속도', '빠른 응답'],
      ['품질', '꼼꼼한 마무리'],
    ],
    faq: [
      ['어떻게 문의하나요?', '문의 페이지에서 남겨주세요.'],
      ['답변은 얼마나 걸리나요?', '영업일 기준 1일 이내예요.'],
    ],
  },
}

const TOKENS: Record<Tone, DesignTokens> = {
  warm: { primary: '#b45309', background: '#fffaf5', text: '#2a2118', font: 'sans', radius: 16 },
  modern: { primary: '#2563eb', background: '#ffffff', text: '#0f172a', font: 'sans', radius: 12 },
  classic: { primary: '#1e3a5f', background: '#faf8f3', text: '#1c1c1c', font: 'serif', radius: 4 },
}

let counter = 0
const sid = (type: Section['type']) => `sec_${type}_${++counter}`

export function createDraft(brief: Brief): Site {
  const c = COPY[brief.industry]
  const tokens = TOKENS[brief.tone]
  const name = brief.name.trim()

  const hero = (title: string, subtitle: string, cta = true): Section => ({
    id: sid('hero'),
    type: 'hero',
    variant: 'centered',
    props: {
      eyebrow: c.eyebrow,
      title,
      subtitle,
      cta: cta ? [{ label: c.cta, href: '/contact' }] : [],
    },
  })

  return {
    id: `site_${randomUUID().slice(0, 8)}`,
    name,
    locale: 'ko',
    tokens,
    pages: [
      {
        route: '/',
        title: `${name} - ${c.title}`,
        seo: { description: c.subtitle, noindex: false },
        sections: [
          hero(c.title, c.subtitle),
          {
            id: sid('features'),
            type: 'features',
            variant: 'grid',
            props: { title: `${name}의 특징`, items: c.features.map(([title, body]) => ({ title, body })) },
          },
          {
            id: sid('faq'),
            type: 'faq',
            variant: 'accordion',
            props: { title: '자주 묻는 질문', items: c.faq.map(([q, a]) => ({ q, a })) },
          },
          {
            id: sid('cta'),
            type: 'cta',
            variant: 'banner',
            props: { title: '지금 문의해 보세요', button: { label: c.cta, href: '/contact' } },
          },
        ],
      },
      {
        route: '/about',
        title: `${name} 소개`,
        seo: { description: `${name}을 소개합니다.`, noindex: false },
        sections: [
          hero(`${name} 소개`, c.subtitle, false),
          {
            id: sid('testimonials'),
            type: 'testimonials',
            variant: 'cards',
            props: {
              title: '이용하신 분들의 이야기',
              items: [
                { name: '김OO', quote: '처음인데도 편안했어요.' },
                { name: '이OO', quote: '친절한 안내가 좋았어요.' },
              ],
            },
          },
        ],
      },
      {
        route: '/contact',
        title: `${name} 문의`,
        seo: { description: `${name}에 문의하세요.`, noindex: false },
        sections: [
          hero('문의하기', '궁금한 점을 남겨주세요.', false),
          {
            id: sid('cta'),
            type: 'cta',
            variant: 'card',
            props: { title: '전화로 바로 문의', body: '평일 10:00 - 18:00', button: { label: '전화하기', href: 'tel:0000000000' } },
          },
        ],
      },
    ],
  }
}
