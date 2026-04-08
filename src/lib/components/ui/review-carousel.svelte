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
  const REVIEW_ANIMATION_UNIT = 0.8;
  const MOBILE_REVIEW_SPEED_MULTIPLIER = 3;

  let visibleCount = 1;
  let reviewQueue: Review[] = [];
  let loopReviews: Review[] = [];
  let cardWidth = '100%';
  let animationDuration = 26;
  let reviewSpeed = 1;

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

  const getCardWidth = () => {
    if (typeof window === 'undefined') return '100%';
    if (window.innerWidth <= 768) return '100%';

    return `${(100 / Math.max(1, visibleCount)) * 0.7}%`;
  };

  const getReviewSpeed = () => {
    if (typeof window === 'undefined') return 1;
    return window.innerWidth <= 768 ? MOBILE_REVIEW_SPEED_MULTIPLIER : 1;
  };

  const updateCarouselMetrics = () => {
    visibleCount = getVisibleCount();
    cardWidth = getCardWidth();
    reviewSpeed = getReviewSpeed();
  };

  $: reviewQueue = buildReviewQueue(reviews);
  $: loopReviews = [...reviewQueue, ...reviewQueue];
  $: animationDuration = Math.max(12, (reviewQueue.length * REVIEW_ANIMATION_UNIT) / reviewSpeed);

  onMount(() => {
    updateCarouselMetrics();
    window.addEventListener('resize', updateCarouselMetrics);

    return () => {
      window.removeEventListener('resize', updateCarouselMetrics);
    };
  });
</script>

{#if reviewQueue.length > 0}
    <div class="relative min-h-[18rem] overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-4 md:min-h-0">
      <div class="reviews-track flex" style={`--review-duration: ${animationDuration}s; --review-speed: ${reviewSpeed};`}>
        {#each loopReviews as review}
          <article
            class="reviews-card flex-shrink-0 h-full p-2"
            style={`width: ${cardWidth}; max-width: 360px;`}
          >
            <div
              class="review-card mx-auto flex h-full min-h-0 w-full max-w-[360px] flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:aspect-square"
            >
            <p class="review-text text-sm leading-relaxed text-[color:var(--text-muted)]">“{review.text}”</p>
            <div>
              <p class="text-sm font-semibold text-[color:var(--text-primary)]">{formatReviewerName(review.name)}</p>
              <p class="mt-1 text-xs font-semibold text-[color:var(--text-muted)]">
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
    animation: review-marquee calc(var(--review-duration, 26s) / var(--review-speed, 1)) linear infinite;
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
