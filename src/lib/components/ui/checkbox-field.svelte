<script lang="ts">
  import { cn } from '$lib/utils';
  import Checkbox from './checkbox.svelte';

  export let id = '';
  export let name = '';
  export let checked = false;
  export let includeFalse = true;
  export let className = '';
  export let label = '';

  const falseValue = false;
  const trueValue = 'true';
</script>

<label class={cn('inline-flex items-center gap-2', className)}>
  {#if includeFalse}
    <input type="hidden" name={name} value={String(falseValue)} />
  {/if}
  <Checkbox id={id} {name} value={trueValue} bind:checked />
  <span>{label}</span>
</label>
