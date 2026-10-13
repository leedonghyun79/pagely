import { z } from 'zod'
import { SectionSchema } from './section'

const Hex = z.string().regex(/^#[0-9a-fA-F]{6}$/)

export const DesignTokensSchema = z.object({
  primary: Hex,
  background: Hex,
  text: Hex,
  font: z.enum(['sans', 'serif']),
  radius: z.number().int().min(0).max(32),
})
export type DesignTokens = z.infer<typeof DesignTokensSchema>

export const PageSchema = z.object({
  route: z.string().regex(/^\/[a-z0-9-/]*$/),
  title: z.string().min(1),
  seo: z.object({
    description: z.string().default(''),
    ogImage: z.string().optional(),
    noindex: z.boolean().default(false),
  }),
  sections: z.array(SectionSchema),
})
export type Page = z.infer<typeof PageSchema>

export const SiteSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  locale: z.string().default('ko'),
  tokens: DesignTokensSchema,
  pages: z.array(PageSchema).min(1),
})
export type Site = z.infer<typeof SiteSchema>
