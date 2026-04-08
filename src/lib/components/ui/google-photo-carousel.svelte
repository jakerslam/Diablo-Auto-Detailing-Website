<script lang="ts">
  import { onMount } from 'svelte';

  type Photo = {
    src: string;
    alt?: string;
  };

  export let photos: Photo[] = [];
  export let reverseDirection = false;

  const MAX_PHOTOS = 20;

  let visibleCount = 1;
  let photoQueue: Photo[] = [];
  let loopPhotos: Photo[] = [];
  let cardWidth = '100%';
  let animationDuration = 24;

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

  const getCardWidth = () => {
    if (typeof window === 'undefined') return '100%';
    if (window.innerWidth <= 768) return '100%';

    return `${(100 / Math.max(1, visibleCount)) * 0.82}%`;
  };

  const updateCarouselMetrics = () => {
    visibleCount = getVisibleCount();
    cardWidth = getCardWidth();
  };

  $: photoQueue = normalizePhotos(photos);
  $: loopPhotos = [...photoQueue, ...photoQueue];
  $: animationDuration = Math.max(12, photoQueue.length * 0.9 + 10);

  onMount(() => {
    updateCarouselMetrics();
    window.addEventListener('resize', updateCarouselMetrics);
    return () => {
      window.removeEventListener('resize', updateCarouselMetrics);
    };
  });
</script>

{#if photoQueue.length > 0}
  <div class="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-3">
    <div
      class={`google-photo-track flex ${reverseDirection ? 'reverse-direction' : ''}`}
      style={`--google-photo-duration: ${animationDuration}s; --google-photo-width: ${cardWidth};`}
    >
      {#each loopPhotos as photo}
        <figure
          class="google-photo-card flex-shrink-0 p-2"
          style="width: var(--google-photo-width); max-width: 360px;"
        >
          <img
            class="h-full w-full rounded-xl object-cover shadow-lg shadow-black/30"
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
    animation: google-photo-marquee calc(var(--google-photo-duration, 24s) * 0.8) linear infinite;
    animation-timing-function: linear;
    animation-direction: normal;
    --google-photo-distance: -50%;
  }

  .google-photo-track.reverse-direction {
    --google-photo-distance: 50%;
  }

  .google-photo-card {
    aspect-ratio: 16 / 10;
  }

  @keyframes google-photo-marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(var(--google-photo-distance));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .google-photo-track {
      animation: none;
    }
  }
</style>
