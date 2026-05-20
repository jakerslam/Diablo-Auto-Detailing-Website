import { base } from '$app/paths';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { seoLandingPages } from '$lib/data/seo-pages';

export const prerender = true;

const fallbackSiteUrl = 'https://diabloautodetailing.com';

export function GET() {
  const configuredSiteUrl = (PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, '');
  const normalizedBase = base === '/' ? '' : base;
  const canonicalBase = normalizedBase.startsWith('/') ? normalizedBase : `/${normalizedBase}`;
  const hasBaseInUrl =
    Boolean(canonicalBase) && configuredSiteUrl.toLowerCase().endsWith(canonicalBase.toLowerCase());
  const canonicalRoot = hasBaseInUrl ? configuredSiteUrl.slice(0, -canonicalBase.length) : configuredSiteUrl;
  const canonicalUrl = `${canonicalRoot}${canonicalBase}/`;
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    {
      loc: canonicalUrl,
      changefreq: 'weekly',
      priority: '1.0'
    },
    ...seoLandingPages.map((page) => ({
      loc: `${canonicalUrl}${page.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
