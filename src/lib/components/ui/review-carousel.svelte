<script lang="ts">
  import { onMount } from 'svelte';

  type Review = {
    name: string;
    rating: number;
    text: string;
    date: string;
  };

  export let reviews: Review[] = [];

  const MAX_QUEUE_SIZE = 30;

  let visibleCount = 1;
  let reviewQueue: Review[] = [];
  let loopReviews: Review[] = [];
  let cardWidth = '100%';
  let animationDuration = 26;

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

  const buildReviewQueue = (input: Review[]) => {
    const sanitized = input.filter((item) => item.name && item.text && item.rating === 5);
    if (sanitized.length === 0) return [];

    return sanitized.slice(0, MAX_QUEUE_SIZE);
  };

  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const updateCarouselMetrics = () => {
    visibleCount = getVisibleCount();
    cardWidth = `${(100 / Math.max(1, visibleCount)) * 0.7}%`;
  };

  $: reviewQueue = buildReviewQueue(reviews);
  $: loopReviews = [...reviewQueue, ...reviewQueue];
  $: animationDuration = Math.max(12, reviewQueue.length * 0.8);

  onMount(() => {
    updateCarouselMetrics();
    window.addEventListener('resize', updateCarouselMetrics);

    return () => {
      window.removeEventListener('resize', updateCarouselMetrics);
    };
  });
</script>

{#if reviewQueue.length > 0}
  <div class="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-4">
    <div class="reviews-track flex" style={`--review-duration: ${animationDuration}s;`}>
      {#each loopReviews as review}
        <article
          class="reviews-card flex-shrink-0 p-2"
          style={`width: ${cardWidth}; max-width: 360px;`}
        >
          <div
            class="mx-auto flex aspect-square h-full min-h-0 w-full max-w-[360px] flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <p class="review-text text-sm leading-relaxed text-white/90">“{review.text}”</p>
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

<style>
  .reviews-track {
    will-change: transform;
    animation: review-marquee var(--review-duration, 26s) linear infinite;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes review-marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  .review-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
