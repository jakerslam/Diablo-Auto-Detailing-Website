import { base } from '$app/paths';
import { PUBLIC_SITE_URL } from '$env/static/public';

export const prerender = true;

const fallbackSiteUrl = 'https://diabloautodetailing.com';

export function GET() {
  const siteUrl = (PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, '');
  const normalizedBase = base === '/' ? '' : base;
  const canonicalUrl = `${siteUrl}${normalizedBase}/`;

  return new Response(`User-agent: *
Allow: /

Sitemap: ${canonicalUrl}sitemap.xml
`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
