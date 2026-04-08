<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { servicePlans, baseServiceHours, fallbackModelPrice } from '$lib/data/pricing';
  import {
    serviceAreas,
    faqItems,
    socialLinks,
    footerNotes,
    googleReviews,
    businessProfile
  } from '$lib/data/site-data';
  import type { LeadFormValues, PlanType } from '$lib/types/form';
  import { emptyLeadForm } from '$lib/types/form';

  import Button from '$lib/components/ui/button.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardDescription from '$lib/components/ui/card-description.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import FormField from '$lib/components/ui/form-field.svelte';
  import CheckboxField from '$lib/components/ui/checkbox-field.svelte';
  import HiddenInput from '$lib/components/ui/hidden-input.svelte';
  import FormSubmit from '$lib/components/ui/form-submit.svelte';
  import Textarea from '$lib/components/ui/textarea.svelte';
  import Select from '$lib/components/ui/select.svelte';
  import AccordionItem from '$lib/components/ui/accordion-item.svelte';
  import ReviewCarousel from '$lib/components/ui/review-carousel.svelte';
  import GooglePhotoCarousel from '$lib/components/ui/google-photo-carousel.svelte';

  import '../app.css';

  type ReviewData = {
    name: string;
    rating: number;
    text: string;
    date: string;
    photo?: string;
    photoUrl?: string;
    photoAlt?: string;
    image?: string;
    imageUrl?: string;
    photos?: unknown[];
    photoUrls?: unknown[];
    images?: unknown[];
    imageUrls?: unknown[];
    media?: unknown[];
  };

  let form: LeadFormValues = {
    ...emptyLeadForm
  };

  let reviewItems: ReviewData[] = googleReviews;
  let photoItems: { src: string; alt?: string }[] = [];
  let showFloatingQuote = true;
  const googlePlaceId = import.meta.env.PUBLIC_GOOGLE_PLACE_ID || '';
  const googleMapsApiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const mapPhotoReference = (photoRef: string, index: number) => ({
    src: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${encodeURIComponent(photoRef)}&key=${googleMapsApiKey}`,
    alt: `Business photo ${index + 1}`
  });

  const sanitizePhotoItems = (input: unknown) => {
    if (!Array.isArray(input)) return [];

    return input
      .map((item, index) => {
        const candidate = item as { photo_reference?: string };
        const photoRef = String(candidate?.photo_reference || '').trim();
        if (!photoRef) return null;
        return mapPhotoReference(photoRef, index);
      })
      .filter((photo): photo is { src: string; alt?: string } => Boolean(photo));
  };

  const isElementInViewport = (id: string) => {
    if (typeof window === 'undefined') return false;
    const element = document.getElementById(id);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  function updateFloatingQuoteVisibility() {
    if (typeof window === 'undefined') return;
    if (window.innerWidth > 768) {
      showFloatingQuote = true;
      return;
    }

    const quoteInView = isElementInViewport('quote');
    const topbarInView = isElementInViewport('topbar');
    showFloatingQuote = !(quoteInView || topbarInView);
  }

  const buildReviewPhotoItems = (reviews: ReviewData[]) => {
    const uniquePhotos = new Set<string>();
    const normalizePhotoEntry = (entry: unknown) => {
      if (typeof entry === 'string') {
        return entry.trim();
      }

      if (entry && typeof entry === 'object') {
        const candidate = entry as {
          url?: string;
          src?: string;
          photo?: string;
          photoUrl?: string;
          image?: string;
          imageUrl?: string;
        };

        return (
          candidate.url?.trim() ||
          candidate.src?.trim() ||
          candidate.photo?.trim() ||
          candidate.photoUrl?.trim() ||
          candidate.image?.trim() ||
          candidate.imageUrl?.trim() ||
          ''
        );
      }

      return '';
    };

    return reviews
      .flatMap((review) => {
        const photoCandidates = [
          review.photo,
          review.photoUrl,
          review.image,
          review.imageUrl,
          ...(Array.isArray(review.photos) ? review.photos : []),
          ...(Array.isArray(review.photoUrls) ? review.photoUrls : []),
          ...(Array.isArray(review.images) ? review.images : []),
          ...(Array.isArray(review.imageUrls) ? review.imageUrls : []),
          ...(Array.isArray(review.media) ? review.media : [])
        ];

        return photoCandidates
          .map(normalizePhotoEntry)
          .filter((src) => src && !uniquePhotos.has(src))
          .map((src) => {
            uniquePhotos.add(src);
            return {
              src,
              alt: review.photoAlt || `${review.name} review photo`
            };
          });
      })
      .slice(0, 20);
  };

  const sanitizeReviews = (input: unknown): ReviewData[] => {
    if (!Array.isArray(input)) return [];

    const parsed = input
      .map((item) => {
        const candidate = item as ReviewData;
        return {
          name: String(candidate?.name || '').trim(),
          rating: Number(candidate?.rating) || 0,
          text: String(candidate?.text || '').trim(),
          date: String(candidate?.date || '').trim(),
          photo: String(candidate?.photo || '').trim(),
          photoUrl: String(candidate?.photoUrl || '').trim(),
          photoAlt: String(candidate?.photoAlt || '').trim(),
          image: String(candidate?.image || '').trim(),
          imageUrl: String(candidate?.imageUrl || '').trim(),
          photos: Array.isArray(candidate?.photos) ? candidate.photos : [],
          photoUrls: Array.isArray(candidate?.photoUrls) ? candidate.photoUrls : [],
          images: Array.isArray(candidate?.images) ? candidate.images : [],
          imageUrls: Array.isArray(candidate?.imageUrls) ? candidate.imageUrls : [],
          media: Array.isArray(candidate?.media) ? candidate.media : []
        };
      })
      .filter((review) => review.name && review.text && review.rating > 0);

    const fiveStarReviews = parsed.filter((review) => review.rating === 5);
    return fiveStarReviews.slice(0, 30);
  };

  onMount(async () => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      if (window.location.hash) {
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}`
        );
      }

      updateFloatingQuoteVisibility();
      window.addEventListener('scroll', updateFloatingQuoteVisibility, { passive: true });
      window.addEventListener('resize', updateFloatingQuoteVisibility);
    }

    const base = import.meta.env.BASE_URL || '/';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;

    const loadGooglePhotoFeed = async () => {
      if (!googlePlaceId || !googleMapsApiKey) return;

      const encodedPlaceId = encodeURIComponent(googlePlaceId);
      const endpoint = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodedPlaceId}&fields=photos&key=${googleMapsApiKey}`;
      const response = await fetch(endpoint);
      if (!response.ok) return;

      const payload = await response.json();
      if (payload?.status !== 'OK' || !payload?.result?.photos) return;

      const loadedPhotos = sanitizePhotoItems(payload.result.photos).slice(0, 20);
      if (loadedPhotos.length > 0) {
        photoItems = loadedPhotos;
      }
    };

    try {
      await loadGooglePhotoFeed();
      const response = await fetch(`${normalizedBase}reviews.json`);
      if (!response.ok) return;

      const payload = await response.json();
      const loadedReviews = sanitizeReviews(payload);
      if (loadedReviews.length > 0) {
        reviewItems = loadedReviews;
        const loadedPhotos = buildReviewPhotoItems(loadedReviews);

        if (loadedPhotos.length > 0) {
          photoItems = loadedPhotos;
        }
      }
    } catch {
      reviewItems = googleReviews;
      photoItems = buildReviewPhotoItems(googleReviews);
    }

    updateFloatingQuoteVisibility();
  });

  onDestroy(() => {
    if (typeof window === 'undefined') return;
    window.removeEventListener('scroll', updateFloatingQuoteVisibility);
    window.removeEventListener('resize', updateFloatingQuoteVisibility);
  });

  const ghlFormEndpoint =
    typeof import.meta !== 'undefined' ? import.meta.env.PUBLIC_GHL_FORM_ENDPOINT || '' : '';
  const ghlFormConfigured = Boolean(ghlFormEndpoint && !ghlFormEndpoint.includes('example.com'));

  const planIds = servicePlans.map((plan) => plan.id);

  const baseInclusions = [
    'Interior detailing + carpet shampooing',
    'Hand wash and full wheel cleaning',
    'Interior vacuum and glass cleaning',
    'Complimentary ceramic wax',
    `${baseServiceHours} total detail duration`
  ];

  const serviceProof = [
    { label: 'Service radius', value: 'Serving Walnut Creek + nearby cities' },
    { label: 'Typical appointment', value: `${baseServiceHours} on-site` },
    { label: 'How you book', value: 'No showroom visits required' }
  ];

  const processSteps = [
    'Tell us your make, model, and timing window.',
    'We confirm scope and final route pricing before scheduling.',
    'Technician arrives fully equipped, then full detail starts.',
    'You get confirmation text and next-route coordination (monthly/quarterly).'
  ];

  const whyChooseUs = [
    {
      title: 'Mobile-first convenience',
      description:
        'We travel to your home, office, or parking spot in Walnut Creek and surrounding cities so you do not lose work time.'
    },
    {
      title: 'No hidden detail work',
      description:
        'Every plan includes the same complete inside-and-out standard so your quote matches the real service scope.'
    },
    {
      title: 'Built for repeat service',
      description:
        'Recurring plans give structured reminders and discounted pricing for better upkeep and fewer surprises.'
    }
  ];

  const getPlanBadge = (planId: PlanType) => {
    if (planId === 'quarterly') return 'Most popular';
    if (planId === 'monthly') return 'Best rate';
    return 'Try us out';
  };

  const getListPrice = (recommendedPrice: number, discount?: number) =>
    discount ? recommendedPrice + discount : recommendedPrice;

  function trackEvent(eventName: string, detail: Record<string, string | number | boolean>) {
    if (typeof window === 'undefined') return;

    const payload = {
      event: eventName,
      ...detail
    };

    const tracker = (window as Window & { trackEvent?: (name: string, props: Record<string, unknown>) => void }).trackEvent;
    if (typeof tracker === 'function') {
      tracker(eventName, payload);
    }

    window.dispatchEvent(new CustomEvent('diablo-tracking-event', { detail: payload }));
  }

  function onQuoteIntent(label: string) {
    trackEvent('quote_intent', { source: 'button_click', label });
  }

  function scrollSectionToBottom(sectionId: string) {
    if (typeof window === 'undefined') return;
    const section = document.getElementById(sectionId);
    if (!section) return;

    const sectionRect = section.getBoundingClientRect();
    const targetY = sectionRect.top + window.scrollY + sectionRect.height - window.innerHeight;
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    window.scrollTo({
      top: Math.min(Math.max(0, targetY), maxY),
      behavior: 'smooth'
    });
  }

  function scrollSectionToTop(sectionId: string) {
    if (typeof window === 'undefined') return;
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function onSectionNav(event: MouseEvent, sectionId: string, trackingLabel: string, alignToBottom = true) {
    event.preventDefault();
    onQuoteIntent(trackingLabel);
    if (alignToBottom) {
      scrollSectionToBottom(sectionId);
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setPlan(plan: PlanType) {
    form.plan = plan;
    onQuoteIntent(`plan_selected_${plan}`);
  }

  function pickPlan(plan: PlanType) {
    setPlan(plan);
    scrollSectionToTop('quote');
  }

  const phone = businessProfile.phone;

  const socialIconLinks = [
    { name: 'Instagram', href: socialLinks.instagram, icon: 'https://cdn.simpleicons.org/instagram/FFFFFF' },
    { name: 'Facebook', href: socialLinks.facebook, icon: 'https://cdn.simpleicons.org/facebook/FFFFFF' },
    { name: 'Google', href: socialLinks.google, icon: 'https://cdn.simpleicons.org/google/FFFFFF' },
    { name: 'Yelp', href: socialLinks.yelp, icon: 'https://cdn.simpleicons.org/yelp/FFFFFF' }
  ];
</script>

<div class="diablo-page flex min-h-screen flex-col">
  <header id="topbar" class="sticky top-0 z-20 w-full bg-[rgba(6,11,22,0.75)] pb-2 backdrop-blur-md">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8 md:flex-nowrap">
      <a href="#top" on:click={(event) => onSectionNav(event, 'top', 'nav_top', false)} class="group inline-flex items-center gap-3">
        <span
          class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-glow-500 text-slate-950 shadow-lg shadow-glow-500/25"
        >
          DX
        </span>
        <div>
          <p class="text-lg font-semibold tracking-wide">Diablo Auto Detailing</p>
          <p class="text-xs text-white/65">Mobile Car Detailing in Walnut Creek</p>
        </div>
      </a>
      <nav class="flex items-center gap-2 text-sm text-white/85">
        <a href="#plans" class="rounded-full px-3 py-2 hover:text-glow-300" on:click={(event) => onSectionNav(event, 'plans', 'nav_plans')}>
          Plans
        </a>
        <a href="#how" class="rounded-full px-3 py-2 hover:text-glow-300" on:click={(event) => onSectionNav(event, 'how', 'nav_how')}>
          Process
        </a>
        <a href="#reviews" class="rounded-full px-3 py-2 hover:text-glow-300" on:click={(event) => onSectionNav(event, 'reviews', 'nav_reviews')}>
          Reviews
        </a>
        <a href="#faq" class="rounded-full px-3 py-2 hover:text-glow-300" on:click={(event) => onSectionNav(event, 'faq', 'nav_faq')}>
          FAQ
        </a>
      </nav>
      <Button variant="outline" href="#quote" on:click={(event) => onSectionNav(event, 'quote', 'header_cta', false)}>Request Quote</Button>
    </div>
    <p class="mx-auto max-w-6xl pb-2 px-4 text-center text-sm text-white/65 sm:px-6 lg:px-8">
      Call or text <a href={`tel:${phone}`} class="text-glow-300 underline">{phone}</a>
    </p>
  </header>

  <main id="top" class="mx-auto mt-8 max-w-6xl flex-1 space-y-10 px-4 sm:px-6 lg:px-8">
    <section class="diablo-surface" id="hero">
      <div class="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
        <div>
          <p class="diablo-kicker">MOBILE DETAILING IN WALNUT CREEK</p>
          <h1 class="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
            Premium detailing for drivers who want a spotless car without leaving their schedule behind
          </h1>
          <p class="mt-4 max-w-2xl text-[color:var(--text-primary)]">
            Our complete interior and exterior service runs in a 2-3 hour block and includes carpet shampooing,
            interior detailing, wheel cleaning, and a complimentary ceramic wax finish.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#quote" on:click={(event) => onSectionNav(event, 'quote', 'hero_cta', false)}>Get My Quote</Button>
            <Button variant="outline" href="#plans" on:click={(event) => onSectionNav(event, 'plans', 'hero_plans', true)}>Compare Plans</Button>
          </div>
        </div>
        <div class="grid gap-3">
          {#each serviceProof as item}
            <div class="rounded-2xl border border-white/15 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-[color:var(--text-subtle)]">{item.label}</p>
              <p class="mt-1 text-sm font-medium text-[color:var(--text-primary)]">{item.value}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section id="reviews">
      <Card className="diablo-surface">
        <CardHeader>
          <div class="flex flex-col items-center gap-1 text-center">
            <CardTitle class="text-center">Reviews from satisfied customers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ReviewCarousel reviews={reviewItems} />
          <div class="mt-5">
            {#if photoItems.length > 0}
              <GooglePhotoCarousel photos={photoItems} reverseDirection={true} />
            {:else}
              <div class="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-5 text-center text-sm text-[color:var(--text-muted)]">
                Review and Google profile photos will appear here as soon as image URLs are available in the feed.
              </div>
            {/if}
          </div>
        </CardContent>
      </Card>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      {#each whyChooseUs as reason}
        <Card className="diablo-surface">
          <CardHeader>
            <CardTitle>{reason.title}</CardTitle>
            <CardDescription className="text-white/80">{reason.description}</CardDescription>
          </CardHeader>
        </Card>
      {/each}
    </section>

    <section class="diablo-surface">
      <div class="mb-5">
        <p class="diablo-kicker">SERVICE SCOPE</p>
        <h2 class="diablo-section-title mt-2">What every detail includes</h2>
        <p class="diablo-subtitle mt-2">Transparent scope, no extra upsells during the visit.</p>
      </div>
      <div class="grid gap-6 md:grid-cols-2">
        <Card className="sub-card">
          <CardHeader>
            <CardTitle>Included in all plans</CardTitle>
            <CardDescription className="text-white/80">Full detail baseline for one-time, monthly, and quarterly customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul class="mt-1 space-y-3 text-white">
              {#each baseInclusions as item}
                <li class="flex items-start gap-2">
                  <span class="mt-1.5 h-2 w-2 rounded-full bg-wash-400"></span>
                  <span>{item}</span>
                </li>
              {/each}
            </ul>
          </CardContent>
        </Card>
        <Card className="sub-card">
          <CardHeader>
            <CardTitle>Service area coverage</CardTitle>
              <CardDescription className="text-white/80">We come to Walnut Creek and nearby communities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="mt-2 flex flex-wrap gap-2">
              {#each serviceAreas as city}
                <span class="rounded-full border border-white/20 px-3 py-1 text-xs text-white">{city}</span>
              {/each}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <section id="plans" class="space-y-4">
      <div class="diablo-section-head">
        <p class="diablo-kicker">PLANS & PRICING</p>
        <div class="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <h2 class="diablo-section-title">Pick a plan that fits your schedule</h2>
          <p class="diablo-subtitle">Prices are starting points. Final price is confirmed by vehicle condition and model.</p>
        </div>
      </div>

      <div class="grid items-stretch gap-5 md:grid-cols-3">
        {#each servicePlans as plan, index}
          <Card
            className={`h-full flex flex-col text-white ${index === servicePlans.length - 1 ? 'border-glow-400/50' : ''}`}
          >
            <CardHeader>
              <div class="mb-2">
                <Badge className="bg-white/85">{getPlanBadge(plan.id)}</Badge>
              </div>
              <div class="mb-2 flex items-center justify-between gap-2">
                <CardTitle>{plan.name}</CardTitle>
              </div>
              <CardDescription className="text-white/80">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <dl class="mt-4 space-y-2 text-sm text-white">
                <div class="flex justify-between border-b border-white/10 pb-2">
                  <dt>Maximum rate</dt>
                  {#if plan.discount}
                    <dd class="flex items-center gap-2 font-semibold">
                      <span class="text-sm text-red-400 line-through">${getListPrice(plan.recommendedPrice, plan.discount)}</span>
                      <span>${plan.recommendedPrice}</span>
                    </dd>
                  {:else}
                    <dd class="font-semibold">${plan.recommendedPrice}</dd>
                  {/if}
                </div>
                <div class="flex justify-between pb-2">
                  <dt>Frequency</dt>
                  <dd>{plan.recurringText}</dd>
                </div>
              </dl>
              <ul class="mt-3 flex-1 space-y-2 text-sm text-white">
                {#each plan.includedFeatures as feature}
                  <li class="flex items-start gap-2">
                    <span class="mt-1 h-2 w-2 rounded-full bg-glow-400"></span>
                    <span>{feature}</span>
                  </li>
                {/each}
              </ul>
              <Button
                className="mt-auto w-full"
                variant="outline"
                on:click={() => {
                  pickPlan(plan.id);
                }}
              >
                Pick {plan.name}
              </Button>
            </CardContent>
          </Card>
        {/each}
      </div>
      <p class="diablo-subtitle">
        Baseline reference price: ${fallbackModelPrice} for typical vehicles.
      </p>
    </section>

    <section id="how" class="grid gap-6 md:grid-cols-1">
      <Card className="diablo-surface">
        <CardHeader className="items-center text-center">
          <CardTitle className="w-full">How it works</CardTitle>
          <CardDescription className="w-full text-[color:var(--text-muted)]">Four step process used by our service team.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol class="mt-2 space-y-4 text-[color:var(--text-muted)]">
            {#each processSteps as step, index}
              <li>
                <p class="text-sm font-semibold text-[color:var(--text-primary)]">{index + 1}. {step}</p>
              </li>
            {/each}
          </ol>
        </CardContent>
      </Card>
    </section>

    <section id="faq">
      <Card className="diablo-surface">
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
          <CardDescription className="text-[color:var(--text-muted)]">Common questions before booking.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {#each faqItems as item}
            <AccordionItem title={item.question}>
              {item.answer}
            </AccordionItem>
          {/each}
        </CardContent>
      </Card>
    </section>

    <section id="quote" class="diablo-surface">
      <CardHeader>
        <CardTitle>Request a quote</CardTitle>
        <CardDescription className="text-[color:var(--text-muted)]">Pricing is confirmed after your vehicle details and booking window are reviewed.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          class="mt-6 grid gap-4 md:grid-cols-2"
          action={ghlFormConfigured ? ghlFormEndpoint : undefined}
          method={ghlFormConfigured ? 'POST' : undefined}
        >
          {#if !ghlFormConfigured}
            <p class="md:col-span-2 text-sm text-amber-200">
              Form endpoint is not configured yet. Set PUBLIC_GHL_FORM_ENDPOINT in repository secret/env to capture this
              submission.
            </p>
          {/if}

          <HiddenInput name="source" value="Diablo Auto Detailing Website" />
          <HiddenInput name="selected_plan" value={form.plan} />

          <FormField id="first_name" label="First name" required>
            <Input id="first_name" name="first_name" bind:value={form.firstName} required />
          </FormField>
          <FormField id="last_name" label="Last name" required>
            <Input id="last_name" name="last_name" bind:value={form.lastName} required />
          </FormField>
          <FormField id="phone" label="Phone" required>
            <Input id="phone" name="phone" type="tel" bind:value={form.phone} required />
          </FormField>
          <FormField id="email" label="Email" required>
            <Input id="email" name="email" type="email" bind:value={form.email} required />
          </FormField>
          <FormField id="city_or_zip" label="City or ZIP" required>
            <Input id="city_or_zip" name="city_or_zip" bind:value={form.city} required />
          </FormField>
          <FormField id="zip" label="ZIP" required>
            <Input id="zip" name="zip" bind:value={form.zip} required />
          </FormField>
          <FormField id="vehicle_year" label="Vehicle year" required>
            <Input id="vehicle_year" name="vehicle_year" bind:value={form.vehicleYear} required />
          </FormField>
          <FormField id="vehicle_make" label="Vehicle make" required>
            <Input id="vehicle_make" name="vehicle_make" bind:value={form.vehicleMake} required />
          </FormField>
          <FormField id="vehicle_model" label="Vehicle model" required>
            <Input id="vehicle_model" name="vehicle_model" bind:value={form.vehicleModel} required />
          </FormField>
          <FormField id="preferred_window" label="Preferred date window" required>
            <Input id="preferred_window" name="preferred_window" bind:value={form.preferredWindow} required />
          </FormField>

          <FormField id="plan" label="Plan" required className="md:col-span-2">
            <Select id="plan" name="plan" bind:value={form.plan}>
              {#each planIds as planId}
                <option value={planId}>{planId}</option>
              {/each}
            </Select>
          </FormField>

          <FormField id="message" label="Message" className="md:col-span-2">
            <Textarea
              rows={3}
              id="message"
              name="message"
              bind:value={form.message}
              placeholder="Anything specific we should know?"
            />
          </FormField>

          <FormField id="best_contact_time" label="Best time to contact" className="md:col-span-2">
            <Input
              id="best_contact_time"
              name="best_contact_time"
              bind:value={form.bestContactTime}
              placeholder="Any preferences"
            />
          </FormField>

          <fieldset class="md:col-span-2">
            <legend class="mb-2 text-sm">What's included in your quote *</legend>
            <div class="grid gap-2 text-sm sm:grid-cols-2">
              <CheckboxField
                id="include_interior_detailing"
                name="include_interior_detailing"
                bind:checked={form.includeInteriorDetailing}
                label="Interior detailing + carpet shampooing"
              />
              <CheckboxField
                id="include_wheel_cleaning"
                name="include_wheel_cleaning"
                bind:checked={form.includeWheelCleaning}
                label="Full wheel cleaning"
              />
              <CheckboxField
                id="include_interior_vacuum"
                name="include_interior_vacuum"
                bind:checked={form.includeInteriorVacuum}
                label="Full interior vacuum + glass clean"
              />
              <CheckboxField
                id="include_ceramic_wax"
                name="include_ceramic_wax"
                bind:checked={form.includeCeramicWax}
                label="Complimentary ceramic wax"
              />
            </div>
          </fieldset>

          <FormSubmit value="Request Quote" disabled={!ghlFormConfigured} />
        </form>
      </CardContent>
    </section>
  </main>

  <footer class="w-full bg-black">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-6 border-t border-white/10 px-4 py-8 text-sm sm:px-6 lg:px-8">
      <div class="grid gap-6 md:grid-cols-3">
        <div>
          <p class="text-lg font-semibold text-white">Diablo Auto Detailing</p>
          <p class="mt-1 text-white/70">Mobile detailing in Walnut Creek and nearby cities.</p>
          <p class="mt-4 text-xs text-white/55">
            Call or text <a href={`tel:${phone}`} class="text-glow-300 underline">{phone}</a> • Mon-Sat 8:00 AM - 6:30 PM
          </p>
        </div>
        <div>
          <p class="mb-3 text-white/80">Quick Links</p>
          <nav class="flex flex-wrap gap-3 text-white/75">
            <a href="#plans" class="hover:text-glow-300" on:click={(event) => onSectionNav(event, 'plans', 'footer_plans')}>Plans</a>
            <a href="#how" class="hover:text-glow-300" on:click={(event) => onSectionNav(event, 'how', 'footer_how')}>Process</a>
            <a href="#reviews" class="hover:text-glow-300" on:click={(event) => onSectionNav(event, 'reviews', 'footer_reviews')}>Reviews</a>
            <a href="#faq" class="hover:text-glow-300" on:click={(event) => onSectionNav(event, 'faq', 'footer_faq')}>FAQ</a>
            <a href="#quote" class="hover:text-glow-300" on:click={(event) => onSectionNav(event, 'quote', 'footer_quote', false)}>Request Quote</a>
          </nav>
        </div>
        <div>
          <p class="mb-3 text-white/80">Follow us</p>
          <div class="flex gap-3">
            {#each socialIconLinks as social}
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <img src={social.icon} alt="" class="h-5 w-5" />
              </a>
            {/each}
          </div>
        </div>
      </div>
      <p class="border-t border-white/10 pt-4 text-xs text-white/55">{footerNotes.join(' • ')}</p>
    </div>
  </footer>

  <a
    href="#quote"
    on:click={(event) => onSectionNav(event, 'quote', 'floating_mobile_cta', false)}
    class={`fixed bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-glow-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg ${showFloatingQuote ? '' : 'hidden'} md:hidden`}
  >
    Get Quote
  </a>
</div>
