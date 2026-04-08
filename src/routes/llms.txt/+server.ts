import { base } from '$app/paths';
import { servicePlans } from '$lib/data/pricing';
import { businessProfile, faqItems, googleReviews, socialLinks } from '$lib/data/site-data';
import { PUBLIC_SITE_URL } from '$env/static/public';

export const prerender = true;

const fallbackSiteUrl = 'https://diabloautodetailing.com';

function formatPlanName(planName: string, price: number, discount?: number) {
  if (!discount) {
    return `${planName}: starts at $${price}`;
  }
  return `${planName}: $${price} before recurring discount`;
}

function formatReviewBlock() {
  return googleReviews
    .slice(0, 10)
    .map((review) => `- ${review.name}: "${review.text}" (${review.rating}/5)`)
    .join('\n');
}

export function GET() {
  const configuredSiteUrl = (PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, '');
  const normalizedBase = base === '/' ? '' : base;
  const canonicalBase = normalizedBase.startsWith('/') ? normalizedBase : `/${normalizedBase}`;
  const hasBaseInUrl =
    Boolean(canonicalBase) && configuredSiteUrl.toLowerCase().endsWith(canonicalBase.toLowerCase());
  const canonicalRoot = hasBaseInUrl ? configuredSiteUrl.slice(0, -canonicalBase.length) : configuredSiteUrl;
  const canonicalUrl = `${canonicalRoot}${canonicalBase}/`;
  const planLines = servicePlans.map((plan) => `- ${formatPlanName(plan.name, plan.recommendedPrice, plan.discount)}`).join('\n');
  const faqLines = faqItems.slice(0, 6).map((item) => `- ${item.question}: ${item.answer}`).join('\n');
  const reviewLines = formatReviewBlock();
  const areas = businessProfile.neighborhoods.join(', ');

  const payload = `# ${businessProfile.name}

Updated: ${new Date().toISOString()}
URL: ${canonicalUrl}
Brand: ${businessProfile.shortName}
Tagline: ${businessProfile.tagline}
Service Area: ${areas}
Location: ${businessProfile.address.addressLocality}, ${businessProfile.address.addressRegion}
Primary Service: ${businessProfile.serviceType}
Contact: ${businessProfile.phone}
Google Profile: ${socialLinks.google}

What we do:
- Mobile interior and exterior detailing
- Regular hand wash + ceramic wax touch-up
- Wheel and tire cleaning
- Mobile service setup (home/office)

Pricing:
${planLines}

Common Questions:
${faqLines}

Recent 5-star review samples:
${reviewLines}
`;

  return new Response(payload.trim(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
