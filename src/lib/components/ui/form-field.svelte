<script lang="ts">
  import { cn } from '$lib/utils';
  import Label from './label.svelte';

  export let id = '';
  export let label = '';
  export let required = false;
  export let className = '';
</script>

<div class={cn('flex flex-col gap-1 text-sm', className)}>
  <Label forInput={id}>
    {label}
    {#if required}
      <span class="text-glow-400">*</span>
    {/if}
  </Label>
  <slot />
</div>
