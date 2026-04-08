<script lang="ts">
  import { servicePlans, baseServiceHours, fallbackModelPrice } from '$lib/data/pricing';
  import { serviceAreas, faqItems, socialLinks, footerNotes } from '$lib/data/site-data';
  import type { LeadFormValues, PlanType } from '$lib/types/form';
  import { emptyLeadForm } from '$lib/types/form';

  import '../app.css';

  let form: LeadFormValues = {
    ...emptyLeadForm
  };

  let formMessage = '';
  let isSubmitting = false;
  let submitted = false;
  let submitError = false;

  const planIds = servicePlans.map((plan) => plan.id);

  const baseInclusions = [
    'Interior detailing + carpet shampooing',
    'Hand wash and full wheel cleaning',
    'Interior vacuum and glass cleaning',
    'Complimentary ceramic wax',
    `${baseServiceHours} total detail duration`
  ];

  function trackEvent(eventName: string, detail: Record<string, string | number | boolean>) {
    if (typeof window === 'undefined') return;

    const payload = {
      event: eventName,
      ...detail
    };

    // External script may expose a custom tracking method; keep this defensive.
    const tracker = (window as Window & { trackEvent?: (name: string, props: Record<string, unknown>) => void }).trackEvent;
    if (typeof tracker === 'function') {
      tracker(eventName, payload);
    }

    window.dispatchEvent(new CustomEvent('diablo-tracking-event', { detail: payload }));
  }

  function onQuoteIntent(label: string) {
    trackEvent('quote_intent', { source: 'button_click', label });
  }

  function getMetadata() {
    if (typeof window === 'undefined') {
      return {
        pageUrl: '',
        utmSource: '',
        utmMedium: '',
        utmCampaign: ''
      };
    }

    const params = new URLSearchParams(window.location.search);
    return {
      pageUrl: window.location.href,
      utmSource: params.get('utm_source') ?? '',
      utmMedium: params.get('utm_medium') ?? '',
      utmCampaign: params.get('utm_campaign') ?? ''
    };
  }

  async function submitForm(event: SubmitEvent) {
    event.preventDefault();
    isSubmitting = true;
    formMessage = '';
    submitError = false;
    const metadata = getMetadata();

    const selectedPlan = servicePlans.find((plan) => plan.id === form.plan);
    const payload = {
      ...form,
      selectedPlan: selectedPlan?.name ?? 'one-time',
      timestamp: new Date().toISOString(),
      source: 'Diablo Auto Detailing Website',
      ...metadata
    };

    const endpoint =
      typeof import.meta !== 'undefined'
        ? import.meta.env.PUBLIC_GHL_FORM_ENDPOINT || 'https://example.com/go-high-level-endpoint'
        : '';

    if (!endpoint || endpoint.includes('example.com')) {
      formMessage = `Thanks ${form.firstName}! We captured your request. Our team will text you to confirm a ${form.plan} detail in your area.`;
      onQuoteIntent('form_submitted_placeholder');
      submitted = true;
      isSubmitting = false;
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      onQuoteIntent('form_submitted_live');
      submitted = true;
      formMessage = `Thanks ${form.firstName}! Your quote request is in. We will follow up shortly.`;
    } catch (error) {
      submitError = true;
      formMessage = 'We had trouble sending your request. Please call (510) 631-1230 to complete your quote.';
      console.error(error);
    } finally {
      isSubmitting = false;
    }
  }

  function setPlan(plan: PlanType) {
    form.plan = plan;
    onQuoteIntent(`plan_selected_${plan}`);
  }

  function resetForm() {
    form = {
      ...emptyLeadForm
    };
    submitted = false;
    formMessage = '';
    submitError = false;
  }

  const phone = '(510) 631-1230';
</script>

<div class="min-h-screen px-4 pb-24 sm:px-6 lg:px-8">
  <header class="mx-auto flex max-w-6xl items-center justify-between py-4">
    <a href="#top" class="group inline-flex items-center gap-3">
      <span class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25">DX</span>
      <div>
        <p class="text-lg font-semibold">Diablo Auto Detailing</p>
        <p class="text-xs text-white/65">Mobile Car Detailing | Walnut Creek</p>
      </div>
    </a>
    <a class="btn-secondary" href="#quote" on:click={() => onQuoteIntent('header_cta')}>Request a Quote</a>
  </header>

  <main id="top" class="mx-auto max-w-6xl space-y-14">
    <section class="rounded-[2rem] border border-white/10 bg-white/10 p-6 md:p-10" id="hero">
      <p class="mb-2 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-3 py-1 text-xs tracking-wider">
        MOBILE DETAILING IN WALNUT CREEK
      </p>
      <h1 class="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
        Premium mobile detailing for people who want a clean car without stopping their day
      </h1>
      <p class="mt-4 max-w-2xl text-white/85">
        2-3 hour full detail, inside and out, with carpet shampooing, interior detailing, wheel care, and a complimentary
        ceramic wax finish.
      </p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <a class="btn-primary" href="#quote" on:click={() => onQuoteIntent('hero_cta')}>
          Request a Quote
        </a>
        <a href="#plans" class="btn-secondary" on:click={() => onQuoteIntent('hero_compare')}>Compare One-Time vs Monthly</a>
      </div>
      <p class="mt-3 text-sm text-white/65">Call to confirm availability: <a class="underline" href={`tel:${phone}`}>{phone}</a></p>
    </section>

    <section class="grid gap-6 md:grid-cols-2">
      <article class="card p-6">
        <h2 class="text-xl font-semibold">What’s included</h2>
        <ul class="mt-4 space-y-3 text-white/90">
          {#each baseInclusions as item}
            <li class="flex items-start gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-glow-400"></span>
              <span>{item}</span>
            </li>
          {/each}
        </ul>
      </article>
      <article class="card p-6">
        <h2 class="text-xl font-semibold">Service areas</h2>
        <p class="mt-2 text-white/75">Serving Walnut Creek and nearby cities. We come to you.</p>
        <div class="mt-4 flex flex-wrap gap-2">
          {#each serviceAreas as city}
            <span class="rounded-full border border-white/20 px-3 py-1 text-sm">{city}</span>
          {/each}
        </div>
      </article>
    </section>

    <section id="plans">
      <div class="mb-4 flex items-end justify-between gap-3">
        <h2 class="text-2xl font-semibold">Plans & pricing</h2>
        <p class="text-sm text-white/65">*Prices are starting points and subject to vehicle condition / model confirmation.</p>
      </div>

      <div class="grid gap-5 md:grid-cols-3">
        {#each servicePlans as plan}
          <article class="card p-5">
            <div class="mb-2 inline-flex items-center gap-2">
              <h3 class="text-xl font-bold">{plan.name}</h3>
              {#if plan.badge}
                <span class="rounded-full bg-glow-500 px-2 py-1 text-xs font-semibold text-slate-900">{plan.badge}</span>
              {/if}
            </div>
            <p class="text-white/80">{plan.description}</p>
            <dl class="mt-4 space-y-2 text-sm text-white/80">
              <div class="flex justify-between border-b border-white/10 pb-2">
                <dt>Starting at</dt>
                <dd class="font-semibold">${plan.recommendedPrice}</dd>
              </div>
              <div class="flex justify-between border-b border-white/10 pb-2">
                <dt>Floor price</dt>
                <dd>${plan.floorPrice}</dd>
              </div>
              <div class="flex justify-between pb-2">
                <dt>Visit timing</dt>
                <dd>{baseServiceHours} / {plan.recurringText}</dd>
              </div>
            </dl>
            <ul class="mt-3 space-y-2 text-sm">
              {#each plan.includedFeatures as feature}
                <li class="flex items-start gap-2">
                  <span class="mt-1 h-2 w-2 rounded-full bg-wash-400"></span>
                  <span>{feature}</span>
                </li>
              {/each}
            </ul>
            <button
              class="mt-5 w-full rounded-full bg-white/10 px-4 py-3 text-sm font-semibold"
              on:click={() => {
                setPlan(plan.id);
                document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Get this quote
            </button>
          </article>
        {/each}
      </div>
      <p class="mt-3 text-sm text-white/65">
        Default baseline reference price: ${fallbackModelPrice} for typical detail vehicles.
      </p>
    </section>

    <section class="grid gap-6 md:grid-cols-2" id="how">
      <article class="card p-6">
        <h2 class="text-2xl font-semibold">How it works</h2>
        <ol class="mt-4 space-y-4 text-white/80">
          <li>
            1) Tell us your car make/model and preferred dates.
          </li>
          <li>2) We confirm scope, final price, and route timing (2-3 hour block).</li>
          <li>3) We arrive fully equipped and complete inside + outside detailing.</li>
          <li>4) You confirm, then we schedule your next route for recurring plans.</li>
        </ol>
      </article>
      <article class="card p-6">
        <h2 class="text-2xl font-semibold">Scheduling model</h2>
        <p class="mt-4 text-white/80">Mon-Sat 8:00 AM - 6:30 PM • 30 min route transitions • 60 min midday reset.</p>
        <p class="mt-3 text-sm text-white/65">If weekend-only and weekend slots are not available, please call for possible Sunday handling.</p>
      </article>
    </section>

    <section id="faq" class="card p-6">
      <h2 class="text-2xl font-semibold">FAQ</h2>
      <div class="mt-4 grid gap-3">
        {#each faqItems as item}
          <details class="rounded-2xl border border-white/10 p-4">
            <summary class="cursor-pointer font-semibold">{item.question}</summary>
            <p class="mt-2 text-sm text-white/80">{item.answer}</p>
          </details>
        {/each}
      </div>
    </section>

    <section id="quote" class="card border-glow-400/50 p-6">
      <h2 class="text-2xl font-semibold">Request a quote</h2>
      <p class="mt-2 text-white/75">All pricing requests route to quote form review before any booking confirmation.</p>

      {#if submitted}
        <div class="mt-6 rounded-2xl border border-white/20 bg-white/5 p-4">
          <p class="text-lg font-semibold">{submitError ? 'Could not submit' : 'Quote request captured'}</p>
          <p class="mt-1 text-sm text-white/80">{formMessage}</p>
          <button class="mt-4 btn-secondary" type="button" on:click={resetForm}>Submit another request</button>
        </div>
      {:else}
        <form class="mt-6 grid gap-4 md:grid-cols-2" on:submit={submitForm}>
          <label class="flex flex-col gap-1 text-sm">
            <span>First name *</span>
            <input
              class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2"
              bind:value={form.firstName}
              required
            />
          </label>
          <label class="flex flex-col gap-1 text-sm">
            <span>Last name *</span>
            <input
              class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2"
              bind:value={form.lastName}
              required
            />
          </label>
          <label class="flex flex-col gap-1 text-sm">
            <span>Phone *</span>
            <input
              class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2"
              type="tel"
              bind:value={form.phone}
              required
            />
          </label>
          <label class="flex flex-col gap-1 text-sm">
            <span>Email</span>
            <input
              class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2"
              type="email"
              bind:value={form.email}
            />
          </label>
          <label class="flex flex-col gap-1 text-sm">
            <span>City or ZIP *</span>
            <input
              class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2"
              bind:value={form.city}
              required
            />
          </label>
          <label class="flex flex-col gap-1 text-sm">
            <span>ZIP *</span>
            <input
              class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2"
              bind:value={form.zip}
              required
            />
          </label>
          <label class="flex flex-col gap-1 text-sm">
            <span>Vehicle year *</span>
            <input
              class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2"
              bind:value={form.vehicleYear}
              required
            />
          </label>
          <label class="flex flex-col gap-1 text-sm">
            <span>Vehicle make *</span>
            <input
              class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2"
              bind:value={form.vehicleMake}
              required
            />
          </label>
          <label class="flex flex-col gap-1 text-sm">
            <span>Vehicle model *</span>
            <input
              class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2"
              bind:value={form.vehicleModel}
              required
            />
          </label>
          <label class="flex flex-col gap-1 text-sm">
            <span>Preferred date window *</span>
            <input
              class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2"
              bind:value={form.preferredWindow}
              required
            />
          </label>

          <label class="flex flex-col gap-1 text-sm md:col-span-2">
            <span>Plan *</span>
            <select class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2" bind:value={form.plan}>
              {#each planIds as planId}
                <option value={planId}>{planId}</option>
              {/each}
            </select>
          </label>

          <label class="flex flex-col gap-1 text-sm md:col-span-2">
            <span>Message</span>
            <textarea
              rows="3"
              class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2"
              bind:value={form.message}
              placeholder="Anything specific we should know?"
            ></textarea>
          </label>

          <label class="flex flex-col gap-2 text-sm md:col-span-2">
            <span>Best time to contact</span>
            <input
              class="rounded-xl border border-white/20 bg-slate-900/55 px-3 py-2"
              bind:value={form.bestContactTime}
              placeholder="Any preferences"
            />
          </label>

          <fieldset class="md:col-span-2">
            <legend class="mb-2 text-sm">What's included in your quote *</legend>
            <div class="grid gap-2 text-sm sm:grid-cols-2">
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" bind:checked={form.includeInteriorDetailing} /> Interior detailing + carpet shampooing
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" bind:checked={form.includeWheelCleaning} /> Full wheel cleaning
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" bind:checked={form.includeInteriorVacuum} /> Full interior vacuum + glass clean
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" bind:checked={form.includeCeramicWax} /> Complimentary ceramic wax
              </label>
            </div>
          </fieldset>

          <button
            class="col-span-1 rounded-full bg-glow-500 px-5 py-3 font-semibold text-slate-900 disabled:opacity-50 md:col-span-2"
            type="submit"
            disabled={isSubmitting}
            on:click={() => onQuoteIntent('submit_click')}
          >
            {isSubmitting ? 'Sending...' : 'Request Quote'}
          </button>
        </form>
      {/if}

      {#if formMessage && !submitted}
        <p class="mt-3 text-sm text-white/80">{formMessage}</p>
      {/if}
    </section>

    <footer class="rounded-[1.8rem] border border-white/10 bg-black/30 p-6">
      <div class="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>Follow: <a href={socialLinks.instagram} target="_blank" class="underline">Instagram</a> · <a href={socialLinks.facebook} target="_blank" class="underline">Facebook</a> · <a href={socialLinks.google} target="_blank" class="underline">Google</a></p>
        <p>Copyright © Diablo Auto Detailing</p>
      </div>
      <p class="mt-3 text-xs text-white/65">{footerNotes.join(' • ')}</p>
    </footer>
  </main>

  <a
    href="#quote"
    on:click={() => onQuoteIntent('floating_mobile_cta')}
    class="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-glow-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg md:hidden"
  >
    Get Quote
  </a>
</div>
