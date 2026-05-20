<script lang="ts">
  import { page } from '$app/stores';

  type LandingPage = {
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    heading: string;
    intro: string;
    body: string[];
    bullets: string[];
  };

  export let data: {
    page: LandingPage;
  };

  $: pageUrl = $page.url.href;
  $: serviceSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.page.title,
    url: pageUrl,
    provider: {
      '@type': 'Organization',
      name: 'Diablo Auto Detailing',
      telephone: '(510) 631-1230'
    },
    areaServed: 'Walnut Creek, Danville, Alamo, San Ramon, and nearby East Bay cities',
    description: data.page.metaDescription
  });
  $: breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${$page.url.origin}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: data.page.title,
        item: pageUrl
      }
    ]
  });
</script>

<svelte:head>
  <title>{data.page.metaTitle}</title>
  <meta name="description" content={data.page.metaDescription} />
  <meta property="og:title" content={data.page.metaTitle} />
  <meta property="og:description" content={data.page.metaDescription} />
  <meta property="og:url" content={pageUrl} />
  <script type="application/ld+json">
    {serviceSchema}
  </script>
  <script type="application/ld+json">
    {breadcrumbSchema}
  </script>
</svelte:head>

<div class="diablo-page flex min-h-screen flex-col">
  <main class="mx-auto mt-8 max-w-5xl flex-1 space-y-8 px-4 sm:px-6 lg:px-8">
    <section class="diablo-surface">
      <p class="diablo-kicker">{data.page.title}</p>
      <h1 class="diablo-section-title mt-3 text-3xl md:text-4xl">{data.page.heading}</h1>
      <p class="mt-4 max-w-3xl text-base text-[color:var(--text-muted)]">{data.page.intro}</p>
      <div class="mt-6 flex flex-wrap gap-2">
        {#each data.page.bullets as bullet}
          <span class="rounded-full border border-[var(--surface-border)] bg-white/70 px-3 py-1.5 text-sm font-medium text-[color:var(--text-primary)]">
            {bullet}
          </span>
        {/each}
      </div>
    </section>

    <section class="diablo-surface">
      <h2 class="diablo-section-title">Why customers search for this service</h2>
      <div class="mt-4 space-y-4 text-[color:var(--text-muted)]">
        {#each data.page.body as paragraph}
          <p>{paragraph}</p>
        {/each}
      </div>
    </section>

    <section class="diablo-surface">
      <h2 class="diablo-section-title">Book mobile detailing</h2>
      <p class="mt-3 text-[color:var(--text-muted)]">
        Request a quote for one-time, quarterly, or monthly detailing and we will confirm pricing based on your
        vehicle and condition.
      </p>
      <div class="mt-6 flex flex-col gap-3 sm:flex-row">
        <a href="/#quote" class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-glow-400 to-glow-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-glow-500/40">
          Request Quote
        </a>
        <a href="/#plans" class="inline-flex items-center justify-center rounded-full border border-[var(--surface-border)] bg-white/70 px-5 py-3 text-sm font-semibold text-[color:var(--text-primary)]">
          Compare Plans
        </a>
      </div>
    </section>
  </main>
</div>
