import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/marketing'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: ['/', '/landing'], disallow: ['/editor/', '/api/', '/preview/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
