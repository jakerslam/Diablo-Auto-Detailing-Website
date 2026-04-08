import { base } from '$app/paths';
import { PUBLIC_SITE_URL } from '$env/static/public';

export const prerender = true;

const fallbackSiteUrl = 'http://diabloautodetailing.com';

export function GET() {
  const siteUrl = (PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, '');
  const normalizedBase = base === '/' ? '' : base;
  const canonicalUrl = `${siteUrl}${normalizedBase}/`;
  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${canonicalUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <lastmod>${today}</lastmod>
  </url>
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
