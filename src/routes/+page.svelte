<script lang="ts">
  import { servicePlans, baseServiceHours, fallbackModelPrice } from '$lib/data/pricing';
  import { serviceAreas, faqItems, socialLinks, footerNotes } from '$lib/data/site-data';
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
  import Textarea from '$lib/components/ui/textarea.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import Select from '$lib/components/ui/select.svelte';
  import Checkbox from '$lib/components/ui/checkbox.svelte';
  import AccordionItem from '$lib/components/ui/accordion-item.svelte';

  import '../app.css';

  let form: LeadFormValues = {
    ...emptyLeadForm
  };

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

  function setPlan(plan: PlanType) {
    form.plan = plan;
    onQuoteIntent(`plan_selected_${plan}`);
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
    <Button variant="secondary" href="#quote" on:click={() => onQuoteIntent('header_cta')}>Request a Quote</Button>
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
        <Button href="#quote" on:click={() => onQuoteIntent('hero_cta')}>Request a Quote</Button>
        <Button variant="secondary" href="#plans" on:click={() => onQuoteIntent('hero_compare')}>
          Compare One-Time vs Monthly
        </Button>
      </div>
      <p class="mt-3 text-sm text-white/65">Call to confirm availability: <a class="underline" href={`tel:${phone}`}>{phone}</a></p>
    </section>

    <section class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>What’s included</CardTitle>
          <CardDescription>Standard service scope for all requested plans.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul class="mt-1 space-y-3 text-white/90">
            {#each baseInclusions as item}
              <li class="flex items-start gap-2">
                <span class="mt-1 h-2 w-2 rounded-full bg-glow-400"></span>
                <span>{item}</span>
              </li>
            {/each}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Service areas</CardTitle>
          <CardDescription>Serving Walnut Creek and nearby cities. We come to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="mt-2 flex flex-wrap gap-2">
            {#each serviceAreas as city}
              <span class="rounded-full border border-white/20 px-3 py-1 text-sm text-white/90">{city}</span>
            {/each}
          </div>
        </CardContent>
      </Card>
    </section>

    <section id="plans">
      <div class="mb-4 flex items-end justify-between gap-3">
        <h2 class="text-2xl font-semibold">Plans & pricing</h2>
        <p class="text-sm text-white/65">*Prices are starting points and subject to vehicle condition / model confirmation.</p>
      </div>

      <div class="grid gap-5 md:grid-cols-3">
        {#each servicePlans as plan}
          <Card>
            <CardHeader>
              <div class="mb-2 inline-flex items-center gap-2">
                <CardTitle>{plan.name}</CardTitle>
                {#if plan.badge}
                  <Badge>{plan.badge}</Badge>
                {/if}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
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
              <Button
                className="mt-5 w-full"
                variant="outline"
                on:click={() => {
                  setPlan(plan.id);
                  document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Get this quote
              </Button>
            </CardContent>
          </Card>
        {/each}
      </div>
      <p class="mt-3 text-sm text-white/65">
        Default baseline reference price: ${fallbackModelPrice} for typical detail vehicles.
      </p>
    </section>

    <section class="grid gap-6 md:grid-cols-2" id="how">
      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol class="mt-2 space-y-4 text-white/80">
            <li>1) Tell us your car make/model and preferred dates.</li>
            <li>2) We confirm scope, final price, and route timing (2-3 hour block).</li>
            <li>3) We arrive fully equipped and complete inside + outside detailing.</li>
            <li>4) You confirm, then we schedule your next route for recurring plans.</li>
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Scheduling model</CardTitle>
          <CardDescription>Operational constraints we follow consistently.</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-white/80">Mon-Sat 8:00 AM - 6:30 PM • 30 min route transitions • 60 min midday reset.</p>
          <p class="mt-3 text-sm text-white/65">If weekend-only and weekend slots are not available, please call for possible Sunday handling.</p>
        </CardContent>
      </Card>
    </section>

    <section id="faq">
      <Card>
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
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

    <section id="quote">
      <Card>
        <CardHeader>
          <CardTitle>Request a quote</CardTitle>
          <CardDescription>All pricing requests route to quote form review before any booking confirmation.</CardDescription>
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

            <input type="hidden" name="source" value="Diablo Auto Detailing Website" />
            <input type="hidden" name="selected_plan" value={form.plan} />

            <label class="flex flex-col gap-1 text-sm">
              <Label>First name *</Label>
              <Input name="first_name" bind:value={form.firstName} required />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <Label>Last name *</Label>
              <Input name="last_name" bind:value={form.lastName} required />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <Label>Phone *</Label>
              <Input name="phone" type="tel" bind:value={form.phone} required />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <Label>Email</Label>
              <Input name="email" type="email" bind:value={form.email} required />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <Label>City or ZIP *</Label>
              <Input name="city_or_zip" bind:value={form.city} required />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <Label>ZIP *</Label>
              <Input name="zip" bind:value={form.zip} required />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <Label>Vehicle year *</Label>
              <Input name="vehicle_year" bind:value={form.vehicleYear} required />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <Label>Vehicle make *</Label>
              <Input name="vehicle_make" bind:value={form.vehicleMake} required />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <Label>Vehicle model *</Label>
              <Input name="vehicle_model" bind:value={form.vehicleModel} required />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <Label>Preferred date window *</Label>
              <Input name="preferred_window" bind:value={form.preferredWindow} required />
            </label>

            <label class="flex flex-col gap-1 text-sm md:col-span-2">
              <Label>Plan *</Label>
              <Select name="plan" bind:value={form.plan}>
                {#each planIds as planId}
                  <option value={planId}>{planId}</option>
                {/each}
              </Select>
            </label>

            <label class="flex flex-col gap-1 text-sm md:col-span-2">
              <Label>Message</Label>
              <Textarea
                rows={3}
                name="message"
                bind:value={form.message}
                placeholder="Anything specific we should know?"
              />
            </label>

            <label class="flex flex-col gap-2 text-sm md:col-span-2">
              <Label>Best time to contact</Label>
              <Input name="best_contact_time" bind:value={form.bestContactTime} placeholder="Any preferences" />
            </label>

            <fieldset class="md:col-span-2">
              <legend class="mb-2 text-sm">What's included in your quote *</legend>
              <div class="grid gap-2 text-sm sm:grid-cols-2">
                <label class="inline-flex items-center gap-2">
                  <input type="hidden" name="include_interior_detailing" value="false" />
                  <Checkbox name="include_interior_detailing" bind:checked={form.includeInteriorDetailing} />
                  Interior detailing + carpet shampooing
                </label>
                <label class="inline-flex items-center gap-2">
                  <input type="hidden" name="include_wheel_cleaning" value="false" />
                  <Checkbox name="include_wheel_cleaning" bind:checked={form.includeWheelCleaning} />
                  Full wheel cleaning
                </label>
                <label class="inline-flex items-center gap-2">
                  <input type="hidden" name="include_interior_vacuum" value="false" />
                  <Checkbox name="include_interior_vacuum" bind:checked={form.includeInteriorVacuum} />
                  Full interior vacuum + glass clean
                </label>
                <label class="inline-flex items-center gap-2">
                  <input type="hidden" name="include_ceramic_wax" value="false" />
                  <Checkbox name="include_ceramic_wax" bind:checked={form.includeCeramicWax} />
                  Complimentary ceramic wax
                </label>
              </div>
            </fieldset>

            <input
              class="col-span-1 rounded-full bg-glow-500 px-5 py-3 font-semibold text-slate-900 disabled:opacity-50 md:col-span-2"
              type="submit"
              value="Request Quote"
              disabled={!ghlFormConfigured}
            />
          </form>
        </CardContent>
      </Card>
    </section>

    <footer class="rounded-[1.8rem] border border-white/10 bg-black/30 p-6">
      <div class="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          Follow:
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" class="underline">Instagram</a> ·
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" class="underline">Facebook</a> ·
          <a href={socialLinks.google} target="_blank" rel="noopener noreferrer" class="underline">Google</a>
        </p>
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
