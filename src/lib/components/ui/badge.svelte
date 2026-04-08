<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
</script>

<span
  class={cn(
    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide text-slate-900 bg-glow-400',
    className
  )}
>
  <slot />
</span>
