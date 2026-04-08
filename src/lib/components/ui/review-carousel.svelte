<script lang="ts">
  import { onMount, tick } from 'svelte';

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
  let cardWidth = '100%';
  let animationDuration = 26;
  let reviewSpeed = 1;
  let shouldAnimate = false;
  let cycleWidth = 0;
  let trackElement: HTMLDivElement | null = null;
  let animationFrame = 0;
  let lastTimestamp = 0;
  let offsetX = 0;

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

  const getCardWidth = (columnCount: number) => {
    if (typeof window === 'undefined') return '100%';
    if (window.innerWidth <= 768) return '100%';

    return `${(100 / Math.max(1, columnCount)) * 0.7}%`;
  };

  const getReviewSpeed = () => {
    if (typeof window === 'undefined') return 1;
    return window.innerWidth <= 768 ? MOBILE_REVIEW_SPEED_MULTIPLIER : 1;
  };

  const updateCarouselMetrics = () => {
    visibleCount = getVisibleCount();
    reviewSpeed = getReviewSpeed();
  };

  const updateCycleWidth = () => {
    if (!trackElement || !shouldAnimate) {
      cycleWidth = 0;
      return;
    }

    cycleWidth = trackElement.scrollWidth;
  };

  const stopAnimation = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
    lastTimestamp = 0;
  };

  const resetTrack = () => {
    offsetX = 0;
    if (trackElement) {
      trackElement.style.transform = 'translateX(0px)';
    }
  };

  const animateTrack = (timestamp: number) => {
    if (!trackElement || !shouldAnimate || cycleWidth <= 0) {
      stopAnimation();
      return;
    }

    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }

    const deltaMs = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    const pixelsPerMs = cycleWidth / (Math.max(animationDuration, 12) * 1000);
    offsetX -= deltaMs * pixelsPerMs;

    let firstCard = trackElement.firstElementChild as HTMLElement | null;
    while (firstCard) {
      const firstWidth = firstCard.getBoundingClientRect().width;
      if (-offsetX < firstWidth) break;
      offsetX += firstWidth;
      trackElement.appendChild(firstCard);
      firstCard = trackElement.firstElementChild as HTMLElement | null;
    }

    trackElement.style.transform = `translateX(${offsetX}px)`;
    animationFrame = requestAnimationFrame(animateTrack);
  };

  const restartAnimation = async () => {
    stopAnimation();
    await tick();
    updateCycleWidth();
    resetTrack();

    if (trackElement && shouldAnimate && cycleWidth > 0) {
      animationFrame = requestAnimationFrame(animateTrack);
    }
  };

  $: reviewQueue = buildReviewQueue(reviews);
  $: shouldAnimate = reviewQueue.length > visibleCount;
  $: cardWidth = getCardWidth(Math.min(visibleCount, reviewQueue.length || 1));
  $: animationDuration = Math.max(12, (reviewQueue.length * REVIEW_ANIMATION_UNIT) / reviewSpeed);
  $: restartAnimation();

  onMount(() => {
    updateCarouselMetrics();
    restartAnimation();
    window.addEventListener('resize', updateCarouselMetrics);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            updateCycleWidth();
          })
        : null;

    if (resizeObserver && trackElement) {
      resizeObserver.observe(trackElement);
    }

    return () => {
      window.removeEventListener('resize', updateCarouselMetrics);
      resizeObserver?.disconnect();
      stopAnimation();
    };
  });
</script>

{#if reviewQueue.length > 0}
    <div class="relative min-h-[18rem] overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-4 md:min-h-0">
      <div bind:this={trackElement} class="reviews-track flex">
        {#each reviewQueue as review}
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
  }

  .review-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
