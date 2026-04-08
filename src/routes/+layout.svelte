<script lang="ts">
  import { base } from '$app/paths';
  import { businessProfile, googleReviews, faqItems, socialLinks, googlePhotos } from '$lib/data/site-data';
  import { servicePlans } from '$lib/data/pricing';

  const fallbackSiteUrl = 'https://diabloautodetailing.com';
  const configuredSiteUrl = (import.meta.env.PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, '');
  const normalizedBase = base === '/' ? '' : base;
  const canonicalBase = normalizedBase.startsWith('/') ? normalizedBase : `/${normalizedBase}`;
  const hasBaseInUrl =
    Boolean(canonicalBase) && configuredSiteUrl.toLowerCase().endsWith(canonicalBase.toLowerCase());
  const canonicalRoot = hasBaseInUrl ? configuredSiteUrl.slice(0, -canonicalBase.length) : configuredSiteUrl;
  const canonicalUrl = `${canonicalRoot}${canonicalBase}/`;
  const title = `${businessProfile.name} | Mobile Car Detailing in Walnut Creek & East Bay`;
  const description =
    'Diablo Auto Detailing provides mobile interior and exterior car detailing in Walnut Creek and nearby East Bay cities, with one-time and recurring plans plus local in-home pickup/drop-off options.';

  const address = businessProfile.address;
  const addressString = `${address.addressLocality}, ${address.addressRegion}, ${address.addressCountry}`;
  const reviewCount = googleReviews.length;
  const averageRating =
    reviewCount > 0
      ? (
          googleReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewCount
        ).toFixed(1)
      : '0';

  const areasServed = businessProfile.neighborhoods.map((area) => `${area}, CA`);

  const offerCatalogItems = servicePlans.map((plan, index) => ({
    '@type': 'Offer',
    position: index + 1,
    name: plan.name,
    description: plan.description,
    itemOffered: {
      '@type': 'Service',
      name: `${plan.name} mobile detail package`,
      description: plan.headline
    },
    price: String(plan.recommendedPrice),
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  }));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${canonicalUrl}#faq`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  const reviewSchema = googleReviews
    .slice(0, 5)
    .filter((review) => review.rating && review.name && review.text)
    .map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.name
      },
      reviewBody: review.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      }
    }));

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    '@id': `${canonicalUrl}#business`,
    name: businessProfile.name,
    url: canonicalUrl,
    image: googlePhotos[0]?.url || undefined,
    logo: googlePhotos[0]?.url || canonicalUrl,
    telephone: businessProfile.phone,
    description: businessProfile.description,
    serviceType: businessProfile.serviceType,
    email: undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry
    },
    areaServed: areasServed,
    openingHours: businessProfile.openingHours,
    currenciesAccepted: businessProfile.currenciesAccepted,
    paymentAccepted: businessProfile.paymentAccepted,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: businessProfile.phone,
        contactType: 'Customer Support',
        availableLanguage: 'en'
      }
    ],
    priceRange: businessProfile.priceRange,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Detailing plans',
      itemListElement: offerCatalogItems
    },
    review: reviewSchema,
    aggregateRating:
      reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: averageRating,
            reviewCount: reviewCount,
            bestRating: 5
          }
        : undefined,
    sameAs: [socialLinks.instagram, socialLinks.facebook, socialLinks.google, socialLinks.yelp]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${canonicalUrl}#website`,
    url: canonicalUrl,
    name: businessProfile.shortName,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${canonicalUrl}?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${canonicalUrl}#organization`,
    name: businessProfile.name,
    url: canonicalUrl,
    telephone: businessProfile.phone,
    areaServed: areasServed,
    sameAs: [socialLinks.instagram, socialLinks.facebook, socialLinks.google, socialLinks.yelp]
  };

  const localBusinessJson = JSON.stringify(localBusinessSchema);
  const faqJson = JSON.stringify(faqSchema);
  const websiteJson = JSON.stringify(websiteSchema);
  const organizationJson = JSON.stringify(organizationSchema);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta
    name="keywords"
    content="mobile car detailing Walnut Creek, auto detailing Walnut Creek, mobile car detailing Danville, detailing service Walnut Creek, interior car detailing, exterior detailing, recurring detailing plans, mobile auto detailing California"
  />
  <meta name="robots" content="index, follow" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="geo.region" content={`${address.addressCountry}-${address.addressRegion}`} />
  <meta name="geo.placename" content={addressString} />
  <meta name="theme-color" content="#060b16" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={businessProfile.name} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={googlePhotos[0]?.url || ''} />
  <meta property="og:image:alt" content="Diablo Auto Detailing service work" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@diabloautodetailing" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={googlePhotos[0]?.url || ''} />
  <link rel="canonical" href={canonicalUrl} />
  <link rel="alternate" hreflang="en-US" href={canonicalUrl} />
  <script type="application/ld+json">
    {localBusinessJson}
  </script>
  <script type="application/ld+json">
    {faqJson}
  </script>
  <script type="application/ld+json">
    {websiteJson}
  </script>
  <script type="application/ld+json">
    {organizationJson}
  </script>
  <script
    src="https://link.msgsndr.com/js/external-tracking.js"
    data-tracking-id="tk_6b8e14ba48b440209f9eb1d4b6196105"
    data-debug="true"
    defer
  ></script>
</svelte:head>

<slot />
