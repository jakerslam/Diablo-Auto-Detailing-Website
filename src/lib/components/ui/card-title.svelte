<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
</script>

<h3 class={cn('text-lg leading-tight font-semibold tracking-tight md:text-xl', className)}><slot /></h3>
