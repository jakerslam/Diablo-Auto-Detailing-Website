<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  export let reviews: {
    name: string;
    rating: number;
    text: string;
    date: string;
  }[] = [];

  export let durationMs = 5000;

  let currentIndex = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  let visibleCount = 1;
  let cardWidth = 100;

  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const clampIndex = () => {
    const maxIndex = Math.max(0, total - visibleCount);
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
  };

  const updateCarouselMetrics = () => {
    visibleCount = getVisibleCount();
    cardWidth = 100 / Math.max(1, visibleCount);
    clampIndex();
  };

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
    updateCarouselMetrics();
    if (total <= 1) return;

    timer = setInterval(() => {
      const maxIndex = Math.max(0, total - visibleCount);
      currentIndex = maxIndex === 0 ? 0 : (currentIndex + 1) % (maxIndex + 1);
    }, durationMs);

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateCarouselMetrics);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateCarouselMetrics);
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
<div class="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-4">
    <div
      class="reviews-track flex w-full transition-transform duration-500 ease-in-out"
      style={`transform: translateX(-${currentIndex * cardWidth}%);`}
    >
      {#each reviews as review}
        <article class="reviews-card flex-shrink-0 px-2" style={`width: ${cardWidth}%`}>
          <div class="flex aspect-square h-full min-h-0 flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p class="text-sm leading-relaxed text-white/90">“{review.text}”</p>
            <div>
              <p class="text-sm font-semibold text-white/95">{formatReviewerName(review.name)}</p>
              <p class="mt-1 text-xs font-semibold text-white/80">
                <span class="text-amber-400">{starRow(review.rating)}</span>
                <span class="ml-1">{review.date}</span>
              </p>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
{/if}
