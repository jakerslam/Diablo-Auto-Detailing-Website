<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
  export let name = '';
  export let id = '';
  export let value = '';
  export let required = false;
</script>

  <select
    {name}
    {id}
    bind:value
    {required}
    class={cn(
      'h-11 w-full rounded-xl border border-white/20 bg-slate-900/45 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-glow-500/55',
      className
    )}
>
  <slot />
</select>
