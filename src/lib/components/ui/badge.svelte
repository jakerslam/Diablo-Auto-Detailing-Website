<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
</script>

<span
  class={cn(
    'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold bg-glow-500 text-slate-900',
    className
  )}
>
  <slot />
</span>
