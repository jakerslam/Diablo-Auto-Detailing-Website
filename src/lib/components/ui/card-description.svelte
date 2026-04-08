<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
</script>

<p class={cn('text-sm text-white/70', className)}><slot /></p>
