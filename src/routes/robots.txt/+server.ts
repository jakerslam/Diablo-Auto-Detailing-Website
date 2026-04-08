import { base } from '$app/paths';
import { PUBLIC_SITE_URL } from '$env/static/public';

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

  return new Response(`User-agent: *
Allow: /

Sitemap: ${canonicalUrl}sitemap.xml
`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
