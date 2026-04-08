<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
  export let forInput = '';
</script>

<label for={forInput} class={cn('text-sm font-medium text-[color:var(--text-primary)]', className)}><slot /></label>
