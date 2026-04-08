<script lang="ts">
  import { cn } from '$lib/utils';

  export let value = '';
  export let name = 'submit';
  export let disabled = false;
  export let className = '';
</script>

  <input
    {name}
    type="submit"
    {value}
    {disabled}
    class={cn(
      'col-span-1 w-full rounded-full bg-gradient-to-r from-glow-400 to-glow-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-glow-500/40 disabled:opacity-50 md:col-span-2',
      className
    )}
  />
