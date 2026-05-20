import { error } from '@sveltejs/kit';
import { seoLandingPages } from '$lib/data/seo-pages';

export const prerender = true;

export function entries() {
  return seoLandingPages.map((page) => ({ slug: page.slug }));
}

export function load({ params }) {
  const page = seoLandingPages.find((entry) => entry.slug === params.slug);

  if (!page) {
    throw error(404, 'Page not found');
  }

  return {
    page
  };
}
