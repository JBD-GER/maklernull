// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gleno.de'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Private Bereiche zusätzlich sperren
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api',
          '/api/*',
          '/_next',
          '/static',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
