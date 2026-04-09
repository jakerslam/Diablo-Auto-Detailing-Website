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
  let renderedPhotos: Photo[] = [];
  let cardWidth = '100%';
  let animationDuration = 24;
  let photoSpeed = 1;
  let shouldAnimate = false;
  let cycleWidth = 0;
  let trackElement: HTMLDivElement | null = null;

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

    cycleWidth = trackElement.scrollWidth / 3;
  };

  $: photoQueue = normalizePhotos(photos);
  $: shouldAnimate = photoQueue.length > visibleCount;
  $: renderedPhotos = shouldAnimate ? [...photoQueue, ...photoQueue, ...photoQueue] : photoQueue;
  $: cardWidth = getCardWidth(Math.min(visibleCount, photoQueue.length || 1));
  $: animationDuration = Math.max(12, (photoQueue.length * PHOTO_ANIMATION_UNIT) / photoSpeed);
  $: tick().then(updateCycleWidth);

  onMount(() => {
    updateCarouselMetrics();
    updateCycleWidth();
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
    };
  });
</script>

{#if photoQueue.length > 0}
  <div class="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-3">
    <div
      bind:this={trackElement}
      class={`google-photo-track flex ${shouldAnimate ? 'is-animated' : ''} ${reverseDirection ? 'reverse-direction' : ''}`}
      style={`--google-photo-width: ${cardWidth}; --google-photo-duration: ${animationDuration}s; --google-photo-speed: ${photoSpeed}; --google-photo-cycle-width: ${cycleWidth}px;`}
    >
      {#each renderedPhotos as photo}
        <figure
          class="google-photo-card flex-shrink-0 p-2"
          style="width: auto; max-width: min(360px, var(--google-photo-width));"
        >
          <img
            class="h-[18rem] w-auto max-w-full rounded-xl object-contain shadow-lg shadow-black/30"
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

  .google-photo-track.is-animated {
    animation: google-photo-marquee calc(var(--google-photo-duration, 24s) / var(--google-photo-speed, 1)) linear infinite;
    animation-timing-function: linear;
  }

  .google-photo-track.reverse-direction {
    animation-name: google-photo-marquee-reverse;
  }

  @keyframes google-photo-marquee {
    from {
      transform: translateX(calc(-1 * var(--google-photo-cycle-width, 0px)));
    }
    to {
      transform: translateX(calc(-2 * var(--google-photo-cycle-width, 0px)));
    }
  }

  @keyframes google-photo-marquee-reverse {
    from {
      transform: translateX(calc(-1 * var(--google-photo-cycle-width, 0px)));
    }
    to {
      transform: translateX(0px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .google-photo-track {
      animation: none;
    }
  }
</style>
