import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/marketing'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/landing`, changeFrequency: 'monthly', priority: 1 },
    { url: SITE_URL, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
