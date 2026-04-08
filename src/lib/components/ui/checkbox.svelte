<script lang="ts">
  import { cn } from '$lib/utils';

  export let checked = false;
  export let name = '';
  export let value = 'true';
  export let id = '';
  export let required = false;
  export let className = '';
</script>

<input
  type="checkbox"
  {name}
  {id}
  {value}
  {required}
  bind:checked
  class={cn('h-4 w-4 rounded border-white/30 bg-slate-900/60 text-glow-500 focus:ring-glow-400', className)}
/>
