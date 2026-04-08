<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let reviews: {
    name: string;
    rating: number;
    text: string;
    date: string;
  }[] = [];

  export let durationMs = 5000;

  let currentIndex = 0;
  let timer: ReturnType<typeof setInterval> | undefined;

  const total = reviews.length;

  const starRow = (rating: number) => '★'.repeat(Math.max(0, Math.min(5, rating)));

  const formatReviewerName = (fullName: string) => {
    const parts = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstName} ${lastInitial}.`;
  };

  onMount(() => {
    if (total <= 1) return;

    timer = setInterval(() => {
      currentIndex = (currentIndex + 1) % total;
    }, durationMs);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  });

  onDestroy(() => {
    if (timer) {
      clearInterval(timer);
    }
  });
</script>

{#if total > 0}
  <div class="relative h-[190px] overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-4">
    {#key currentIndex}
      <article
        in:fade={{ duration: 350 }}
        out:fade={{ duration: 220 }}
        class="absolute inset-0 flex flex-col justify-between p-4"
      >
        <p class="text-sm leading-relaxed text-white/90">“{reviews[currentIndex].text}”</p>
        <div>
          <p class="text-sm font-semibold text-white/95">{formatReviewerName(reviews[currentIndex].name)}</p>
          <p class="mt-1 text-xs font-semibold text-white/80">
            <span class="text-amber-400">{starRow(reviews[currentIndex].rating)}</span>
            <span class="ml-1">{reviews[currentIndex].date}</span>
          </p>
        </div>
      </article>
    {/key}
  </div>
{/if}
