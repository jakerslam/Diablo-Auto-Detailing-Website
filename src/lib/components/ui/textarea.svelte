<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
  export let rows = 3;
  export let name = '';
  export let id = '';
  export let required = false;
  export let placeholder = '';
  export let value = '';
</script>

  <textarea
    {rows}
    {name}
    {id}
    bind:value
    {required}
    {placeholder}
    class={cn(
      'min-h-24 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-2 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-glow-500/55 disabled:cursor-not-allowed disabled:opacity-60',
      className
    )}
  on:input
></textarea>
