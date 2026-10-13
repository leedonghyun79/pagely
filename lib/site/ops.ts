import { z } from 'zod'
import { SectionSchema, type Section } from '@/lib/schema/section'
import { DesignTokensSchema, SiteSchema, type Site } from '@/lib/schema/site'

export const OpSchema = z.discriminatedUnion('op', [
  z.object({
    op: z.literal('update_section'),
    route: z.string(),
    sectionId: z.string(),
    props: z.record(z.string(), z.unknown()),
  }),
  z.object({
    op: z.literal('add_section'),
    route: z.string(),
    section: SectionSchema,
    index: z.number().int().min(0).optional(),
  }),
  z.object({ op: z.literal('remove_section'), route: z.string(), sectionId: z.string() }),
  z.object({
    op: z.literal('move_section'),
    route: z.string(),
    sectionId: z.string(),
    toIndex: z.number().int().min(0),
  }),
  z.object({
    op: z.literal('change_variant'),
    route: z.string(),
    sectionId: z.string(),
    variant: z.string(),
  }),
  z.object({ op: z.literal('update_design_tokens'), tokens: DesignTokensSchema.partial() }),
  z.object({
    op: z.literal('update_page_seo'),
    route: z.string(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    noindex: z.boolean().optional(),
  }),
])
export type Op = z.infer<typeof OpSchema>

function findPage(site: Site, route: string) {
  const page = site.pages.find((p) => p.route === route)
  if (!page) throw new Error(`페이지를 찾을 수 없어: ${route}`)
  return page
}

function findIndex(sections: Section[], sectionId: string) {
  const i = sections.findIndex((s) => s.id === sectionId)
  if (i < 0) throw new Error(`섹션을 찾을 수 없어: ${sectionId}`)
  return i
}

function applyOne(site: Site, op: Op) {
  switch (op.op) {
    case 'update_section': {
      const page = findPage(site, op.route)
      const i = findIndex(page.sections, op.sectionId)
      const cur = page.sections[i]
      page.sections[i] = SectionSchema.parse({ ...cur, props: { ...cur.props, ...op.props } })
      return
    }
    case 'add_section': {
      const page = findPage(site, op.route)
      page.sections.splice(op.index ?? page.sections.length, 0, op.section)
      return
    }
    case 'remove_section': {
      const page = findPage(site, op.route)
      page.sections.splice(findIndex(page.sections, op.sectionId), 1)
      return
    }
    case 'move_section': {
      const page = findPage(site, op.route)
      const [s] = page.sections.splice(findIndex(page.sections, op.sectionId), 1)
      page.sections.splice(Math.min(op.toIndex, page.sections.length), 0, s)
      return
    }
    case 'change_variant': {
      const page = findPage(site, op.route)
      const i = findIndex(page.sections, op.sectionId)
      page.sections[i] = SectionSchema.parse({ ...page.sections[i], variant: op.variant })
      return
    }
    case 'update_design_tokens': {
      site.tokens = { ...site.tokens, ...op.tokens }
      return
    }
    case 'update_page_seo': {
      const page = findPage(site, op.route)
      if (op.title !== undefined) page.title = op.title
      if (op.description !== undefined) page.seo.description = op.description
      if (op.noindex !== undefined) page.seo.noindex = op.noindex
      return
    }
  }
}

/** 모든 스키마 변경의 단일 경로. 입력은 변경하지 않고 검증된 새 Site를 돌려준다. */
export function applyOps(site: Site, ops: Op[]): Site {
  const next = structuredClone(site)
  for (const op of ops) applyOne(next, OpSchema.parse(op))
  return SiteSchema.parse(next)
}
