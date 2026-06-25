import type { MetadataRoute } from 'next'

// Block all crawlers — this site is meant to be shared by direct link only.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  }
}
