<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
  export let forInput = '';
</script>

<label for={forInput} class={cn('text-sm font-medium text-white/90', className)}><slot /></label>
