<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
</script>

<h3 class={cn('text-lg leading-none font-semibold tracking-tight', className)}><slot /></h3>
