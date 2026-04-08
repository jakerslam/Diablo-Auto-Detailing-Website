<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
  export let type = 'text';
  export let value = '';
  export let name = '';
  export let id = '';
  export let required = false;
  export let placeholder = '';
</script>

  <input
    {type}
    {name}
    {id}
    bind:value
    {placeholder}
    {required}
    class={cn(
      'h-11 w-full rounded-xl border border-white/20 bg-slate-900/45 px-3 py-2 text-sm text-white placeholder:text-white/55 focus:outline-none focus:ring-2 focus:ring-glow-500/55 disabled:cursor-not-allowed disabled:opacity-60',
      className
    )}
  on:input
/>
