import { z } from 'zod'

const Cta = z.object({ label: z.string().min(1), href: z.string().min(1) })

export const SECTION_VARIANTS = {
  hero: ['centered', 'split'],
  features: ['grid', 'list'],
  faq: ['accordion', 'two-column'],
  cta: ['banner', 'card'],
  testimonials: ['cards', 'quote'],
} as const

export type SectionType = keyof typeof SECTION_VARIANTS

export const PropsByType = {
  hero: z.object({
    eyebrow: z.string().optional(),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    cta: z.array(Cta).default([]),
  }),
  features: z.object({
    title: z.string().min(1),
    items: z.array(z.object({ title: z.string(), body: z.string() })).min(1),
  }),
  faq: z.object({
    title: z.string().min(1),
    items: z.array(z.object({ q: z.string(), a: z.string() })).min(1),
  }),
  cta: z.object({
    title: z.string().min(1),
    body: z.string().optional(),
    button: Cta,
  }),
  testimonials: z.object({
    title: z.string().min(1),
    items: z.array(z.object({ name: z.string(), quote: z.string() })).min(1),
  }),
} as const

const make = <T extends SectionType>(type: T) =>
  z.object({
    id: z.string().min(1),
    type: z.literal(type),
    variant: z.enum(SECTION_VARIANTS[type]),
    props: PropsByType[type],
  })

export const SectionSchema = z.discriminatedUnion('type', [
  make('hero'),
  make('features'),
  make('faq'),
  make('cta'),
  make('testimonials'),
])

export type Section = z.infer<typeof SectionSchema>
