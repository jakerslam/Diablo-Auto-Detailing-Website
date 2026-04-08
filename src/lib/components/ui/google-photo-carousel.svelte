<script lang="ts">
  import { onMount, tick } from 'svelte';

  type Photo = {
    src: string;
    alt?: string;
  };

  export let photos: Photo[] = [];
  export let reverseDirection = false;

  const MAX_PHOTOS = 20;
  const PHOTO_ANIMATION_UNIT = 0.8;
  const MOBILE_PHOTO_SPEED_MULTIPLIER = 3;

  let visibleCount = 1;
  let photoQueue: Photo[] = [];
  let cardWidth = '100%';
  let animationDuration = 24;
  let photoSpeed = 1;
  let shouldAnimate = false;
  let cycleWidth = 0;
  let trackElement: HTMLDivElement | null = null;
  let animationFrame = 0;
  let lastTimestamp = 0;
  let offsetX = 0;

  const normalizePhotos = (input: Photo[]) => {
    if (!Array.isArray(input)) return [];

    return input
      .filter((photo) => typeof photo?.src === 'string')
      .map((photo) => ({
        src: photo.src,
        alt: typeof photo.alt === 'string' ? photo.alt : ''
      }))
      .filter((photo) => photo.src.trim().length > 0)
      .slice(0, MAX_PHOTOS);
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

    return `${(100 / Math.max(1, columnCount)) * 0.82}%`;
  };

  const getPhotoSpeed = () => {
    if (typeof window === 'undefined') return 1;
    return window.innerWidth <= 768 ? MOBILE_PHOTO_SPEED_MULTIPLIER : 1;
  };

  const updateCarouselMetrics = () => {
    visibleCount = getVisibleCount();
    photoSpeed = getPhotoSpeed();
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
    offsetX += (reverseDirection ? 1 : -1) * deltaMs * pixelsPerMs;

    if (reverseDirection) {
      let lastCard = trackElement.lastElementChild as HTMLElement | null;
      while (lastCard) {
        const lastWidth = lastCard.getBoundingClientRect().width;
        if (offsetX < lastWidth) break;
        offsetX -= lastWidth;
        trackElement.insertBefore(lastCard, trackElement.firstElementChild);
        lastCard = trackElement.lastElementChild as HTMLElement | null;
      }
    } else {
      let firstCard = trackElement.firstElementChild as HTMLElement | null;
      while (firstCard) {
        const firstWidth = firstCard.getBoundingClientRect().width;
        if (-offsetX < firstWidth) break;
        offsetX += firstWidth;
        trackElement.appendChild(firstCard);
        firstCard = trackElement.firstElementChild as HTMLElement | null;
      }
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

  $: photoQueue = normalizePhotos(photos);
  $: shouldAnimate = photoQueue.length > visibleCount;
  $: cardWidth = getCardWidth(Math.min(visibleCount, photoQueue.length || 1));
  $: animationDuration = Math.max(12, (photoQueue.length * PHOTO_ANIMATION_UNIT) / photoSpeed);
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

{#if photoQueue.length > 0}
  <div class="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-3">
    <div bind:this={trackElement} class="google-photo-track flex" style={`--google-photo-width: ${cardWidth};`}>
      {#each photoQueue as photo}
        <figure
          class="google-photo-card flex-shrink-0 p-2"
          style="width: auto; max-width: min(360px, var(--google-photo-width));"
        >
          <img
            class="h-auto max-h-[18rem] w-auto max-w-full rounded-xl object-contain shadow-lg shadow-black/30"
            src={photo.src}
            alt={photo.alt ?? ''}
            loading="lazy"
          />
        </figure>
      {/each}
    </div>
  </div>
{/if}

<style>
  .google-photo-track {
    will-change: transform;
  }

  @media (prefers-reduced-motion: reduce) {
    .google-photo-track {
      animation: none;
    }
  }
</style>
